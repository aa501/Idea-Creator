using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using MindOverMapper_Movim.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using MindOverMapper_Movim.Helpers;
using MindOverMapper_Movim.Services;
using System.Security.Claims;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace MindOverMapper_Movim.Controllers
{
    [Route("api/[controller]")]
    public class ProjectController : Controller
    {

        private readonly MovimDbContext _context;
        private readonly ProjectService _service;
        private readonly AppSettings _appSettings;

        public ProjectController(MovimDbContext context, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _service = new ProjectService();
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

        [Authorize(Roles = "admin")]
        [HttpPost("{uid}/permissions")]
        public ActionResult AddUserToProject(string uid, [FromBody] ActionWithUsersRequest req)
        {
            foreach (string userUid in req.UserUids)
            {
                var project = _context.Project.Where(proj => proj.Uid == uid).FirstOrDefault<Project>();
                var user = _context.User.Where(u => u.Uid == userUid).FirstOrDefault<User>();

                if (user == null)
                {
                    return BadRequest(new { message = "Invalid User Uid. [" + userUid + "]" });
                }

                if (project == null)
                {
                    return BadRequest(new { message = "Invalid Project." });
                }

                var per = _context.Permissions.Where(p => p.UserId == user.Id && p.ProjId == project.Id).FirstOrDefault<Permissions>();

                if (per != null)
                {
                    return BadRequest(new { message = "User [" + userUid + "] Already has Permission." });
                }

                var newPer = new Permissions();
                newPer.UserId = user.Id;
                newPer.ProjId = project.Id;

                _context.Permissions.Add(newPer);
            }
            _context.SaveChanges();


            return Ok(new { message = "Success!" });

        }

        [Authorize(Roles = "admin")]
        [HttpGet("{uid}/permissions")]
        public ActionResult GetPermissions(string uid)
        {
            var users = _context.User.ToList();
            var proj = _context.Project.Where(p => p.Uid == uid).FirstOrDefault<Project>();

            if (proj == null)
            {
                return BadRequest();
            }

            var perms = _context.Permissions.Where(p => p.ProjId == proj.Id).ToList();

            var r = new List<object>();

            foreach (User u in users)
            {
                bool hasP = false;
                foreach (Permissions p in perms)
                {
                    if (p.UserId == u.Id)
                    {
                        hasP = true;
                        break;
                    }
                }
                r.Add(new
                {
                    uid = u.Uid,
                    email = u.Email,
                    firstName = u.FirstName,
                    lastName = u.LastName,
                    type = u.Type,
                    hasPermission = hasP || u.Type == "admin"
                });

            }

            return Ok(r);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{uid}/permissions")]
        public ActionResult RemoveUserFromProject(string uid, [FromBody] ActionWithUsersRequest req)
        {
            foreach (string userUid in req.UserUids)
            {

                var project = _context.Project.Where(proj => proj.Uid == uid).FirstOrDefault<Project>();
                var user = _context.User.Where(u => u.Uid == userUid).FirstOrDefault<User>();

                if (user == null)
                {
                    return BadRequest(new { message = "Invalid User Uid. [" + userUid + "]" });
                }

                if (project == null)
                {
                    return BadRequest(new { message = "Invalid Project." });
                }

                var permission = _context.Permissions.Where(p => p.ProjId == project.Id && p.UserId == user.Id).FirstOrDefault<Permissions>();

                if (project == null)
                {
                    return BadRequest(new { message = "User [" + userUid + "] Doesn't Have Permission For This Project." });
                }

                _context.Permissions.Remove(permission);
            }
            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }

        [Authorize]
        [HttpGet]
        public ActionResult GetPreviews()
        {
            var uid = _service.GetUid(HttpContext.User.Identity as ClaimsIdentity);
            var type = _service.GetType(HttpContext.User.Identity as ClaimsIdentity);

            if (type == "admin")
            {
                var projects = _context.Project.Select(proj => new
                {
                    Uid = proj.Uid,
                    Title = proj.Title,
                    Description = proj.Description,
                    DateCreated = proj.DateCreated,
                }).ToList();

                return Ok(projects);
            }
            else
            {
                var projects = _context.User.Join(_context.Permissions, u => u.Id, p => p.UserId, (u, p) => new
                {
                    ProjectId = p.ProjId,
                    UserUid = u.Uid
                }).Join(_context.Project, per => per.ProjectId, proj => proj.Id, (per, proj) => new
                {
                    UserUid = per.UserUid,
                    Uid = proj.Uid,
                    Title = proj.Title,
                    Description = proj.Description,
                    DateCreated = proj.DateCreated,
                }).Where(per => per.UserUid == uid).Select(proj => new
                {
                    Uid = proj.Uid,
                    Title = proj.Title,
                    Description = proj.Description,
                    DateCreated = proj.DateCreated,
                }).ToList();

                return Ok(projects);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{uid}")]
        public ActionResult DeleteProject(string uid)
        {
            var proj = _context.Project.Where(p => p.Uid == uid).FirstOrDefault<Project>();

            if (proj == null)
            {
                return BadRequest(new { message = "Invalid project uid." });
            }

            var perm = _context.Permissions.Where(p => p.ProjId == proj.Id);
            var param = _context.ProjectParameters.Where(p => p.ProjectId == proj.Id).ToList<ProjectParameters>();

            foreach (ProjectParameters p in param)
            {
                if (p.LinkId != null)
                {
                    var link = _context.Links.Where(l => l.Id == p.LinkId).FirstOrDefault<Links>();
                    _context.Links.Remove(link);
                }
            }

            _context.ProjectParameters.RemoveRange(param);
            _context.Permissions.RemoveRange(perm);
            _context.Project.Remove(proj);
            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }

        [Authorize]
        [HttpPut("{uid}/state")]
        public ActionResult PutState(string uid, [FromBody] StateRequest req)
        {
            var userUid = _service.GetUid(HttpContext.User.Identity as ClaimsIdentity);

            if (!hasPermission(userUid, uid))
            {
                return Unauthorized(new { message = "User is not authorized" });
            }

            var proj = _context.Project.Where(p => p.Uid == uid).FirstOrDefault<Project>();

            if (proj == null)
            {
                return BadRequest(new { message = "Invalid Project." });
            }

            ProjectStimulus stim = JsonConvert.DeserializeObject<ProjectStimulus>(proj.Stimulus);

            if (stim.state.version != req.version)
            {
                HttpContext.Response.StatusCode = 403;
                return Json(stim.state);
            }

            stim.state = req;
            stim.state.version++;
            proj.Stimulus = JsonConvert.SerializeObject(stim);
            _context.SaveChanges();
            return Ok(stim.state);
        }

        [Authorize]
        [HttpGet("{uid}/state")]
        public ActionResult GetState(string uid)
        {
            var userUid = _service.GetUid(HttpContext.User.Identity as ClaimsIdentity);

            if (!hasPermission(userUid, uid))
            {
                return Unauthorized(new { message = "User is not authorized" });
            }

            var proj = _context.Project.Where(p => p.Uid == uid).FirstOrDefault<Project>();

            if (proj == null)
            {
                return BadRequest(new { message = "Invalid Project." });
            }

            ProjectStimulus stim = JsonConvert.DeserializeObject<ProjectStimulus>(proj.Stimulus);
            return Ok(stim.state);
        }

        [Authorize]
        [HttpGet("{uid}")]
        public ActionResult GetProjectInfo(string uid)
        {
            var userUid = _service.GetUid(HttpContext.User.Identity as ClaimsIdentity);

            if (!hasPermission(userUid, uid))
            {
                return BadRequest(new { message = "User doesn't have permission." });
            }

            var proj = _context.Project.Where(p => p.Uid == uid).FirstOrDefault<Project>();
            var param = _context.ProjectParameters.Where(p => p.ProjectId == proj.Id).ToList<ProjectParameters>();
            var exclusions = new List<Object>();
            var areasOfResearch = new List<Object>();

            foreach (ProjectParameters p in param)
            {
                Links link = null;
                if (p.LinkId != null)
                {
                    link = _context.Links.Where(l => l.Id == p.LinkId).FirstOrDefault<Links>();
                }
                if (p.Type == "e")
                {
                    Object e;
                    if (link == null)
                    {
                        e = new
                        {
                            content = p.Content
                        };
                    }
                    else
                    {
                        e = new
                        {
                            Content = p.Content,
                            Link = new
                            {
                                href = link.Href,
                                hrefName = link.Name
                            }
                        };
                    }
                    exclusions.Add(e);
                }
                else if (p.Type == "a")
                {
                    Object a;
                    if (link == null)
                    {
                        a = new
                        {
                            content = p.Content
                        };
                    }
                    else
                    {
                        a = new
                        {
                            Content = p.Content,
                            Link = new
                            {
                                href = link.Href,
                                hrefName = link.Name
                            }
                        };
                    }
                    areasOfResearch.Add(a);
                }
            }

            var res = new
            {
                uid = proj.Uid,
                title = proj.Title,
                description = proj.Description,
                exclusions = exclusions,
                definition = proj.Definition,
                areasOfResearch = areasOfResearch,
                dateCreated = proj.DateCreated
            };
            return Ok(res);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{uid}")]
        public ActionResult UpdateProject(string uid, [FromBody] UpdateProjectRequest req)
        {
            var proj = _context.Project.Where(p => p.Uid == uid).FirstOrDefault<Project>();

            if (proj == null)
            {
                return BadRequest(new { message = "Invalid Project" });
            }

            proj.Title = req.Title;
            proj.Definition = req.Definition;
            proj.Description = req.Description;

            var oldParam = _context.ProjectParameters.Where(p => p.ProjectId == proj.Id).ToList<ProjectParameters>();

            foreach (ProjectParameters p in oldParam)
            {
                if (p.LinkId != null)
                {
                    var link = _context.Links.Where(l => l.Id == p.LinkId).FirstOrDefault<Links>();
                    if (link != null)
                    {
                        _context.Links.Remove(link);
                    }
                }
            }

            _context.ProjectParameters.RemoveRange(oldParam);

            List<ProjectParameters> parameters = new List<ProjectParameters>();

            foreach (ProjectParametersRequest param in req.Exclusions)
            {
                ProjectParameters p = new ProjectParameters();

                if (param.Link != null)
                {
                    Links l = new Links();
                    l.Href = param.Link.Href;
                    l.Name = param.Link.HrefName;
                    l.Uid = Guid.NewGuid().ToString();
                    _context.Links.Add(l);
                    _context.SaveChanges();
                    p.LinkId = l.Id;
                }
                p.Uid = Guid.NewGuid().ToString();
                p.Content = param.Content;
                p.Type = "e";
                p.ProjectId = proj.Id;
                parameters.Add(p);
            }

            foreach (ProjectParametersRequest param in req.AreasOfResearch)
            {
                ProjectParameters p = new ProjectParameters();

                if (param.Link != null)
                {
                    Links l = new Links();
                    l.Href = param.Link.Href;
                    l.Name = param.Link.HrefName;
                    l.Uid = Guid.NewGuid().ToString();
                    _context.Links.Add(l);
                    _context.SaveChanges();
                    p.LinkId = l.Id;
                }
                p.Uid = Guid.NewGuid().ToString();
                p.Content = param.Content;
                p.Type = "a";
                p.ProjectId = proj.Id;
                parameters.Add(p);
            }
            _context.ProjectParameters.AddRange(parameters);
            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public ActionResult CreateProject([FromBody] CreateProjectRequest req)
        {
            var uid = _service.GetUid(HttpContext.User.Identity as ClaimsIdentity);
            var user = _context.User.Where(u => u.Uid == uid).FirstOrDefault<User>();

            Project proj = new Project();

            proj.Title = req.Title;
            proj.Uid = Guid.NewGuid().ToString();
            proj.Description = req.Description;
            proj.Definition = req.Definition;
            proj.DateCreated = DateTime.Now;
            proj.OwnerId = user.Id;

            var stimulus = new ProjectStimulus();
            stimulus.state = new StateRequest();

            stimulus.state.state = new State();

            List<string> rootSubKeys = new List<string>();
            for (int index = 1; index <= req.InitStimulus.Count; index++)
            {
                rootSubKeys.Add("init" + index);
            }

            stimulus.state.state.rootTopicKey = "root";
            stimulus.state.state.topics = new List<object>() {
                    new {
                        key = "root",
                        subKeys = rootSubKeys,
                        collapse = false,
                        style = "{\"background\":\"#e2e2e2\"}",
                        blocks = new List<object>() {
                                new {
                                  type = "CONTENT",
                                  data = req.ProblemStatement.Content
                                }
                        }
                    },
                };
            stimulus.state.state.config = new
            {
                readOnly = false,
                allowUndo = true,
                layoutDir = 2,
                theme = new
                {
                    name = "theme2",
                    randomColor = false,
                    background = "#f8f8f8",
                    highlightColor = "#50C9CE",
                    marginH = 45,
                    marginV = 10,
                    fontFamily = "",
                    bold = false,
                    italic = false,
                    textAlign = "left",
                    rootTopic = new
                    {
                        background = "#50C18A",
                        color = "#fff",
                        fontSize = "34px",
                        borderRadius = "5px",
                        padding = "16px 18px 16px 18px",
                        linkStyle = new
                        {
                            lineType = "curve",
                            lineWidth = 2,
                            lineColor = "rgb(113, 203, 45)"
                        }
                    },
                    primaryTopic = new
                    {
                        background = "#ffffff",
                        borderWidth = "1px",
                        borderStyle = "solid",
                        borderColor = "rgb(221, 170, 68)",
                        borderRadius = "5px",
                        color = "rgb(103,103,103)",
                        fontSize = "14px",
                        padding = "6px 10px 5px 10px",
                        linkStyle = new
                        {
                            lineType = "curve",
                            lineWidth = 2,
                            lineColor = "#43a9ff"
                        }
                    },
                    normalTopic = new
                    {
                        background = "#fff",
                        borderRadius = "5px",
                        color = "rgb(103,103,103)",
                        fontSize = "13px",
                        padding = "3px 9px 4px",
                        boxShadow = "1px 1px 1px #ccc",
                        linkStyle = new
                        {
                            lineType = "round",
                            lineRadius = 5,
                            lineWidth = 1,
                            lineColor = "#43a9ff"
                        }
                    }

                }
            };
            stimulus.related = new List<StateItemRequest>();
            stimulus.unrelated = new List<StateItemRequest>();
            stimulus.state.version = 0;

            int i = 1;
            foreach (StimulusRequest stim in req.InitStimulus)
            {
                string key = "init" + i;

                string desc = stim.Description;
                if (stim.Link != null)
                {
                    desc += " " + stim.Link.HrefName + ": (" + stim.Link.Href + ")";
                }

                var init = new
                {
                    key = key,
                    parentKey = "root",
                    subKeys = new List<string>(),
                    collapse = false,
                    style = "{\"borderColor\":\"#d67416\"}",
                    blocks = new List<object>() {
                        new {
                            type = "CONTENT",
                            data = stim.Content
                        },
                        new {
                            type = "DESC",
                            data = desc
                        }
                    }
                };

                stimulus.state.state.topics.Add(init);
                i++;
            }

            foreach (StimulusRequest stim in req.RelatedStimulus)
            {
                var related = new StateItemRequest();
                related.content = stim.Content;
                related.desc = stim.Description;
                if (stim.Link != null)
                {
                    related.desc += stim.Link.HrefName + ": (" + stim.Link.Href + ")";
                }
                stimulus.related.Add(related);
            }

            foreach (StimulusRequest stim in req.UnrelatedStimulus)
            {
                var unrelated = new StateItemRequest();
                unrelated.content = stim.Content;
                unrelated.desc = stim.Description;
                if (stim.Link != null)
                {
                    unrelated.desc += " " + stim.Link.HrefName + ": (" + stim.Link.Href + ")";
                }
                stimulus.related.Add(unrelated);
            }

            proj.Stimulus = JsonConvert.SerializeObject(stimulus);

            _context.Project.Add(proj);
            _context.SaveChanges();


            List<ProjectParameters> parameters = new List<ProjectParameters>();

            foreach (ProjectParametersRequest param in req.Exclusions)
            {
                ProjectParameters p = new ProjectParameters();

                if (param.Link != null)
                {
                    Links l = new Links();
                    l.Href = param.Link.Href;
                    l.Name = param.Link.HrefName;
                    l.Uid = Guid.NewGuid().ToString();
                    _context.Links.Add(l);
                    _context.SaveChanges();
                    p.LinkId = l.Id;
                }
                p.Uid = Guid.NewGuid().ToString();
                p.Content = param.Content;
                p.Type = "e";
                p.ProjectId = proj.Id;
                parameters.Add(p);
            }

            foreach (ProjectParametersRequest param in req.AreasOfResearch)
            {
                ProjectParameters p = new ProjectParameters();

                if (param.Link != null)
                {
                    Links l = new Links();
                    l.Href = param.Link.Href;
                    l.Name = param.Link.HrefName;
                    l.Uid = Guid.NewGuid().ToString();
                    _context.Links.Add(l);
                    _context.SaveChanges();
                    p.LinkId = l.Id;
                }
                p.Uid = Guid.NewGuid().ToString();
                p.Content = param.Content;
                p.Type = "a";
                p.ProjectId = proj.Id;
                parameters.Add(p);
            }
            _context.ProjectParameters.AddRange(parameters);
            _context.SaveChanges();

            return Ok(new { message = "Success!" });
        }

        [Authorize]
        [HttpPost("concept")]
        public ActionResult CreateConcept([FromBody] ConceptRequest req)
        {
            var new_uid = Guid.NewGuid().ToString();
            Project proj = _context.Project.Where(p => p.Uid == req.projectUid).FirstOrDefault();
            var answerls = req.answerList;
            var length = _context.Question.Count<Question>();

            Concept cpt = new Concept
            {
                Uid = new_uid,
                ProjectId = proj.Id,
                ConceptName = req.ConceptName,
                NewsHeadline = req.NewsHeadline,
                Customer = req.Customer,
                CustomerProblem = req.CustomerProblem,
                Promise = req.Promise,
                Proof = req.Proof,
                Price = req.Price,
                Passion = req.Passion,
                DeathThreats = req.DeathThreats
            };

            _context.Concept.Add(cpt);
            _context.SaveChanges();

            var conc = _context.Concept.Where(c => c.Uid == new_uid).FirstOrDefault<Concept>();

            foreach (var obj in answerls){
                if (obj != null) {
                    IdeationAnswers ans = new IdeationAnswers
                    {
                        Uid = Guid.NewGuid().ToString(),
                        Cid = conc.Id,
                        Qid = Array.IndexOf(answerls, obj),
                        Answer = obj
                    };

                    _context.IdeationAnswers.Add(ans);
                }
            }

            _context.SaveChanges();

            return Ok(new { message = "Success!" });
        }

        [Authorize]
        [HttpGet("questions")]
        public ActionResult GetQuestions()
        {
            var queryString = "concept";
            var questions = _context.Question.Where(q => q.Type == queryString);

            return Ok(questions);
        }

        [Authorize]
        [HttpPost("submit-question")]
        public ActionResult CreateConceptQuestion([FromBody] QuestionSubmission req)
        {

            Question qsn = new Question
            {
                Uid = Guid.NewGuid().ToString(),
                Text = req.Text,
                Type = req.Type,
                Notes = req.Notes,
                DateCreated = DateTime.Now,
                Archived = "No"
            };

            _context.Question.Add(qsn);
            _context.SaveChanges();
            return Ok(new { message = "Success!" });
        }
    }
}
