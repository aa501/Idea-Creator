using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using MindOverMapper_Movim.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using MindOverMapper_Movim.Helpers;
using MindOverMapper_Movim.Services;
using MindOverMapper_Movim.Models.Requests;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Collections.Generic;


// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MindOverMapper_Movim.Controllers
{
    [Route("api/[controller]")]
    //[ApiController]
    public class PrototypeController : Controller
    {
        private readonly MovimDbContext _context;
        private readonly ProjectService _service;
        private readonly AppSettings _appSettings;
        private readonly IHostingEnvironment _env;

        public PrototypeController(MovimDbContext context, IOptions<AppSettings> appSettings, IHostingEnvironment env)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _env = env;
        }

        [Authorize]
        [HttpPost]
        public ActionResult UploadPrototype([FromForm] CreatePrototypeRequest req)
        {

            string path = Path.Combine(_env.WebRootPath, "files");
            IList<string> filePaths = new List<string>();
            foreach(IFormFile file in req.Files)
            {
                string fileName = Guid.NewGuid().ToString() + file.FileName;
                string filepath = Path.Combine(path, fileName);
                file.CopyTo(new FileStream(filepath, FileMode.Create));
                filePaths.Add(filepath);
            }
            Prototype prototype = new Prototype();
            prototype.Uid = Guid.NewGuid().ToString();
            prototype.ProjectId = req.ProjectId;
            prototype.PrototypeName = req.PrototypeName;
            prototype.PrototypeDescription = req.PrototypeName;
            prototype.PrototypePath = Newtonsoft.Json.JsonConvert.SerializeObject(filePaths);
            _context.Prototype.Add(prototype);
            _context.SaveChanges();
            return Ok();

        }
    }
}
