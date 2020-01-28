using System;
using System.Linq;
using MindOverMapper_Movim.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using MindOverMapper_Movim.Helpers;
using MindOverMapper_Movim.Services;
using MindOverMapper_Movim.Models.Requests;
using System.Threading.Tasks;
using System.Security.Claims;

namespace MindOverMapper_Movim.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {

        private readonly MovimDbContext _context;
        private readonly AuthService _service;
        private readonly AppSettings _appSettings;

        public AuthController(MovimDbContext context, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _service = new AuthService(_appSettings);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginRequest req)
        {
            var user = _context.User.Where(u => u.Email == req.Email).FirstOrDefault<User>();

            if (user == null)
            {
                return BadRequest(new { message = "Invalid Email or Password." });
            }

            if (user.Active == 0)
            {
                return Unauthorized(new { message = "Account Deactivated by Admin." });
            }

            if (user.LockOut != null)
            {
                if (user.LockOut > DateTime.Now)
                {
                    return Unauthorized(new { message = "Locked." });
                }
                else
                {
                    user.LockOut = null;
                    user.LoginAttempts = 0;
                }
            }

            if (!_service.VerifyHashedPassword(user.PasswordHash, req.Password))
            {
                if (user.LoginAttempts == 4)
                {
                    user.LockOut = DateTime.Now.AddMinutes(15);
                    _context.SaveChanges();
                    return Unauthorized(new { message = "Locked." });
                }
                else
                {
                    user.LoginAttempts++;
                    _context.SaveChanges();
                    return BadRequest(new { message = "Invalid Email or Password." });
                }
            }

            user.LockOut = null;
            user.LoginAttempts = 0;

            var tokenString = _service.GenerateToken(user.Uid, user.Type);

            _context.SaveChanges();
            return Ok(new {
                uid = user.Uid,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                type = user.Type,
                token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("grant")]
        public async Task<ActionResult> GetGrant([FromBody] GrantRequest req)
        {
            var user = _context.User.Where(u => u.Email == req.Email).FirstOrDefault<User>();
            string grant = Guid.NewGuid().ToString();
            if (user != null)
            {
                string code = _service.RandomDigits(6);
                await _service.SendEmail(
                    req.Email,
                    "Movim Password Recovery Code",
                    "Your recovery code is: " + code,
                    "Your recovery code is: <b>" + code + "</b>"
                );
                var recoveryGrant = new RecoveryGrant();
                recoveryGrant.Code = code;
                recoveryGrant.Email = req.Email;
                recoveryGrant.DateSent = DateTime.Now;
                recoveryGrant.Uid = grant;
                _context.RecoveryGrant.Add(recoveryGrant);
                _context.SaveChanges();
            }
            return Ok(new { grant = grant }); 
        }

        [AllowAnonymous]
        [HttpPost("recover")]
        public ActionResult Recover([FromBody] RecoverRequest req)
        {
            var rec = _context.RecoveryGrant.Where(r => r.Uid == req.Grant).FirstOrDefault<RecoveryGrant>();
            if (rec == null || rec.Code != req.Code)
            {
                return BadRequest(new { message = "Invalid Grant or Code." });
            }
            var user = _context.User.Where(u => u.Email == rec.Email).FirstOrDefault<User>();
            user.PasswordHash = _service.HashPassword(req.NewPassword);
            var recs = _context.RecoveryGrant.Where(r => r.DateSent < DateTime.Now.AddMinutes(5)).ToList();
            recs.Add(rec);
            _context.RecoveryGrant.RemoveRange(recs);
            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }

        [Authorize(Roles = "admin")]
        [HttpGet("get-users")]
        public ActionResult GetAllUsers()
        {
            var users = _context.User.Select(user => new { user.Uid, user.FirstName, user.LastName, user.Email, user.Type, user.Active }).ToList();
            return Ok(users);
        }

        [HttpPatch("password")]
        [Authorize]
        public ActionResult UpdatePassword([FromBody] PasswordRequest req)
        {
            var uid = _service.GetUid(HttpContext.User.Identity as ClaimsIdentity);
            var user = _context.User.Where(u => u.Uid == uid).FirstOrDefault<User>();
            if (!_service.VerifyHashedPassword(user.PasswordHash, req.OldPassword))
            {
                return BadRequest(new { message = "Invalid Password." });
            }
            user.PasswordHash = _service.HashPassword(req.NewPassword);
            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult Register([FromBody] AddPermissionsRequest req)
        {
            string email = req.Email;
            if (!AuthService.IsEmailValid(email))
            {
                 return BadRequest(new { message = "Invalid Email." });
            }
            if (_context.User.Where(user => user.Email == req.Email).Any())
            {
                return BadRequest(new { message = "Account With Email Already Exists." });
            }

            User newUser = new User();

            newUser.LockOut = null;
            newUser.LoginAttempts = 0;
            newUser.Active = 1;
            newUser.Email = req.Email;
            newUser.FirstName = req.FirstName;
            newUser.LastName = req.LastName;
            newUser.DateCreated = DateTime.Now;
            newUser.Uid = Guid.NewGuid().ToString();
            newUser.Type = "regular";
            newUser.PasswordHash = _service.HashPassword(req.Password);


            _context.User.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "Success!" });
        }

        [Authorize(Roles = "admin")]
        [HttpPost("user")]
        public ActionResult AdminUpdateUser([FromBody] UserRequest req)
        {
            var user = _context.User.Where(u => u.Uid == req.Uid).FirstOrDefault<User>();
            if (user == null)
            {
                return BadRequest(new { message = "User Does Not Exist." });
            }
            if (req.Type != null)
            {

                if (req.Type == "admin" || req.Type == "regular")
                {
                    user.Type = req.Type;
                }
                else
                {
                    return BadRequest(new { message = "Invalid Type" });
                }
            }
            if(req.Active != null)
            {
                user.Active = ((byte)(req.Active == true ? 1 : 0));
            }
            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }

    }
}
