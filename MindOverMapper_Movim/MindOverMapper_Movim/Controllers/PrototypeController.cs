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
using Microsoft.Azure.Storage.File;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MindOverMapper_Movim.Controllers
{
    [Route("api/[controller]")]
    //[ApiController]
    public class PrototypeController : Controller
    {
        private readonly MovimDbContext _context;
       // private readonly PrototypeService _service;
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
            Project proj = _context.Project.Where(p => p.Uid == req.ProjectUid).FirstOrDefault<Project>();

            string path = Path.Combine(_env.WebRootPath, "files");
            IList<string> filePaths = new List<string>();
            foreach(IFormFile file in req.Files)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                string filepath = Path.Combine(path, fileName);
                FileStream fileStream = new FileStream(filepath, FileMode.Create);
                file.CopyTo(fileStream);
                fileStream.Close();
                AzureFileService fileService = new AzureFileService(this._appSettings);
                fileService.storeFile("files", fileName, filepath);

                filePaths.Add(fileName);
            }

            Project Project = _context.Project.Where(project => project.Uid == req.ProjectId).First<Project>();
            Prototype prototype = new Prototype();
            prototype.ProjectId = Project.Id;
            prototype.PrototypeName = req.PrototypeName;
            prototype.PrototypeDescription = req.PrototypeName;
            prototype.Uid = Guid.NewGuid().ToString();
            prototype.PrototypePath = Newtonsoft.Json.JsonConvert.SerializeObject(filePaths);
            var result = _context.Prototype.Add(prototype);
            _context.SaveChanges();
            return Ok(prototype);

        }
        
        [Authorize]
        [HttpGet("{uid}")]
        public ActionResult getPrototypes(string uid)
        {
            Project prototypeProject = _context.Project.Where(project => project.Uid == uid).First<Project>();
            var prototypes = _context.Prototype.Where(prototype => prototype.ProjectId == prototypeProject.Id).ToList<Prototype>();
            return Ok(prototypes);
        }

        [Authorize]
        [HttpGet("file/{FileName}")]
        public ActionResult getFile(String FileName)
        {
            AzureFileService fileService = new AzureFileService(this._appSettings);
            CloudFile cloudFile = fileService.getFIle("files", FileName);
            string path = Path.Combine(_env.WebRootPath, "files");
            cloudFile.DownloadToFile(Path.Combine(path, FileName), FileMode.Create);
            var stream = new FileStream(Path.Combine(path, FileName), FileMode.Open);
            return File(stream, "application/octet-stream",FileName);
        }
    }
}
