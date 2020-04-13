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

        [Authorize]
        [HttpGet("{uid}")]
        public ActionResult GetSurveys(string uid) { 
            Project proj = _context.Project.Where(p => p.Uid == uid).FirstOrDefault<Project>();
            var surveys = _context.Survey.Where(s => s.ProjectId == proj.Id);
            return Ok(surveys);
        }

        [Authorize]
        [HttpPost]
        public ActionResult CreateSurvey([FromBody] CreateSurveyRequest req)
        {
           Project proj = _context.Project.Where(p => p.Uid == req.ProjectUid).FirstOrDefault<Project>();
           Prototype proto = _context.Prototype.Where(o => o.Uid == req.PrototypeUid).FirstOrDefault<Prototype>();
           Concept cpt = _context.Concept.Where(c => c.Uid == req.ConceptUid).FirstOrDefault<Concept>();


            Survey survey = new Survey();
            survey.Uid = req.UniqueId;
            survey.ProjectId = proj.Id;
            survey.PrototypeId = proto.Id;
            if (cpt != null)
            survey.ConceptId = cpt.Id;
            survey.SurveyName = req.SurveyName;
            survey.Notes = req.Notes;
            survey.Qualifications = req.Qualifications;
            survey.DateCreated = DateTime.Now;
            survey.Questions = req.Questions;
            survey.Status = req.Status;
            survey.EndDate = req.EndDate;

           _context.Survey.Add(survey);
           _context.SaveChanges();
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
        [HttpGet("get-survey-questions")]
        public ActionResult GetSurveyQuestions()
        {
            var questions = _context.Question.Where(q => q.Type != "concept");

            return Ok(questions);
        }

        //[Authorize]
        //[HttpPost("/turk")]
        //public ActionResult TurkSurvey([FromBody]CreateTurkSurveyRequest req)
        //{
        //    ISurvey emailSurvey = SurveyFactory.Build(SurveyTypes.TurkSurvey);
        //    var survey = _context.Survey.Find(req.Id);
        //    emailSurvey.LoadSurvey(survey);
        //    emailSurvey.execute();
        //    return Ok();
        //}
        //private bool hasPermission(string userUid, string projUid)
        //{
        //    var user = _context.User.Where(u => u.Uid == userUid).FirstOrDefault<User>();

        //    if (user == null)
        //    {
        //        return false;
        //    }
        //    else if (user.Type == "admin")
        //    {
        //        return true;
        //    }

        //    var proj = _context.Project.Where(p => p.Uid == projUid).FirstOrDefault<Project>();

        //    if (proj == null)
        //    {
        //        return false;
        //    }

        //    var per = _context.Permissions.Where(p => p.ProjId == proj.Id && p.UserId == user.Id).FirstOrDefault<Permissions>();
        //    return per != null;
        //}
    }
}
