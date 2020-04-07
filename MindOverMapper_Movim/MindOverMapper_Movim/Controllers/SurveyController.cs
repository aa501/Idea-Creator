using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using MindOverMapper_Movim.Models;
using MindOverMapper_Movim.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using MindOverMapper_Movim.Helpers;
using MindOverMapper_Movim.Services;
using MindOverMapper_Movim.Surveys;
using System.Security.Claims;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace MindOverMapper_Movim.Controllers
{
    [Route("api/[controller]")]
    public class SurveyController : Controller
    {

        private readonly MovimDbContext _context;
        private readonly SurveyService _service;
        private readonly AppSettings _appSettings;

        public SurveyController(MovimDbContext context, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _service = new SurveyService();
        }

        [Authorize]
        [HttpGet("{uid}")]
        public ActionResult GetSurveys(string uid)
        {
            //Do Some code to validate access?
            /*var Surveys = from survey in _context.Set<Survey>()
                          join project in _context.Set<Project>()
                            on survey.ProjectId equals project.Id
                          where project.Uid == uid
                          select new { survey };*/
            IList<Survey> surveys = new List<Survey>();
            Survey survey = new Survey();
            survey.SurveyName = "Harry Killer";
            survey.Name = false;
            survey.ProjectId = 1;
            survey.Package = false;
            surveys.Add(survey);
            return Ok(surveys);
        }

        [Authorize]
        [HttpPost]
        public ActionResult CreateSurvey([FromBody] CreateSurveyRequest  req)
        {
            Survey survey = new Survey();
            survey.SurveyName = req.surveyName;
            survey.PricingOptionId = req.pricingOptionId;
            survey.Idea = req.idea;
            survey.Package = req.package;
            survey.Product = req.product;
            survey.Name = req.name;
            survey.PurchaseFrequency = req.purchaseFrequency;
            survey.PurchasePrice = req.purchasePrice;
            survey.Qualitative = req.qualitative;
            survey.Demographics = req.demographics;
            _context.Survey.Add(survey);
            return Ok();
        }

        [Authorize]
        [HttpPost("/email")]
        public ActionResult EmailSurvey([FromBody] EmailSurveyRequest req)
        {

            ISurvey emailSurvey = SurveyFactory.Build(SurveyTypes.EmailSurvey);
            var survey = _context.Survey.Find(req.SurveyId);
            emailSurvey.LoadSurvey(survey);
            emailSurvey.execute();
            return Ok();
        }

        [Authorize]
        [HttpPost("/turk")]
        public ActionResult TurkSurvey([FromBody]CreateTurkSurveyRequest req)
        {
            ISurvey emailSurvey = SurveyFactory.Build(SurveyTypes.TurkSurvey);
            var survey = _context.Survey.Find(req.Id);
            emailSurvey.LoadSurvey(survey);
            emailSurvey.execute();
            return Ok();
        }
        private bool hasPermission(string userUid, string projUid)
        {
            var user = _context.User.Where(u => u.Uid == userUid).FirstOrDefault<User>();

            if (user == null)
            {
                return false;
            }
            else if (user.Type == "admin")
            {
                return true;
            }

            var proj = _context.Project.Where(p => p.Uid == projUid).FirstOrDefault<Project>();

            if (proj == null)
            {
                return false;
            }

            var per = _context.Permissions.Where(p => p.ProjId == proj.Id && p.UserId == user.Id).FirstOrDefault<Permissions>();
            return per != null;
        }
    }
}
