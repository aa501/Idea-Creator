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
            var surveys = _context.Survey.Where(u => u.ProjectId == proj.Id);
            return Ok(surveys);
        }

        [AllowAnonymous]
        [HttpGet("{uid}/retrieve")]
        public ActionResult GetSingleSurvey(string uid)
        {
            var survey = _context.Survey.Where(u => u.Uid == uid);

            if (survey == null)
            {
                return BadRequest(new { message = "Survey does not exist!" });
            }

            return Ok(survey);
        }

        [AllowAnonymous]
        [HttpPost("post-answers")]
        public ActionResult PostAnswers([FromBody] SurveyAnswerRequest req) {

            SurveyTaker taker = new SurveyTaker();
            taker.Uid = Guid.NewGuid().ToString();
            taker.Turk = req.Turk;
            taker.SurveyUid = req.SurveyUid;
            var answerList = req.AnswerList;
            _context.SurveyTaker.Add(taker);

            foreach (var obj in answerList)
            {
                if (obj != null)
                {
                    SurveyAnswer answer = new SurveyAnswer();
                    answer.Uid = Guid.NewGuid().ToString();
                    answer.SurveyTakerUid = taker.Uid;
                    answer.SurveyUid = req.SurveyUid;
                    answer.Answer = obj;
                    answer.DateCompleted = DateTime.Now;
                    answer.Qid = Array.IndexOf(answerList, obj);
                    _context.SurveyAnswer.Add(answer);
                }
            }

            _context.SaveChanges();

            return Ok(new { message = "Success!" });
        }


        [Authorize]
        [HttpGet]
        public ActionResult GetAllSurveys(string uid) {
            var surveys = _context.Survey;

            return Ok(surveys);
        }

        [Authorize]
        [HttpPut("{uid}")]
        public ActionResult UpdateSurvey(string uid, [FromBody] UpdateSurveyRequest req) {
            Survey surv = _context.Survey.Where(u => u.Uid == uid).FirstOrDefault<Survey>();

            if (surv == null)
            {
                return BadRequest(new { message = "Invalid Survey" });
            }

            surv.Prototypes = req.Prototypes;
            surv.SurveyName = req.SurveyName;
            surv.Notes = req.Notes;
            surv.Qualifications = req.Qualifications;
            surv.DateCreated = DateTime.Now;
            surv.Questions = req.Questions;
            surv.Status = req.Status;

            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }

        [Authorize]
        [HttpPut("{uid}/pass")]
        public ActionResult ChangeSurveyStatus(string uid, [FromBody] UpdateSurveyStatus req) {
            Survey surv = _context.Survey.Where(u => u.Uid == uid).FirstOrDefault<Survey>();

            if (surv == null)
            {
                return BadRequest(new { message = "Invalid Survey" });
            }

            surv.Status = req.Status;
            surv.EndDate = req.EndDate;

            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }

        [Authorize]
        [HttpPost]
        public ActionResult CreateSurvey([FromBody] CreateSurveyRequest req)
        {
           Project proj = _context.Project.Where(p => p.Uid == req.ProjectUid).FirstOrDefault<Project>();
           Concept cpt = _context.Concept.Where(c => c.Uid == req.ConceptUid).FirstOrDefault<Concept>();


            Survey survey = new Survey();
            survey.Uid = req.UniqueId;
            survey.ProjectId = proj.Id;
            survey.Prototypes = req.Prototypes;
            if (cpt != null)
            survey.ConceptId = cpt.Id;
            survey.SurveyName = req.SurveyName;
            survey.Notes = req.Notes;
            survey.Qualifications = req.Qualifications;
            survey.DateCreated = DateTime.Now;
            survey.Questions = req.Questions;
            survey.Status = req.Status;

           _context.Survey.Add(survey);
           _context.SaveChanges();

            return Ok(new { message = "Success!" });
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

        [Authorize]
        [HttpGet("{uid}/responses")]
        public ActionResult GetResponses(string uid)
        {
            var responses = _context.SurveyAnswer.Where(a => a.SurveyUid == uid);
            return Ok(responses);
        }

        [Authorize]
        [HttpGet("{uid}/takers")]
        public ActionResult GetTakers(string uid)
        {
            var takers = _context.SurveyAnswer.Where(a => a.SurveyUid == uid);
            return Ok(takers);
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
