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
using System.IO;
using System.Collections.Generic;
using Microsoft.Azure.Storage.File;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;


namespace MindOverMapper_Movim.Controllers
{
    [Route("api/[controller]")]
    public class ResearchController : Controller
    {

        private readonly MovimDbContext _context;
        private readonly SurveyService _service;
        private readonly AppSettings _appSettings;
        private readonly IHostingEnvironment _env;

        public ResearchController(MovimDbContext context, IOptions<AppSettings> appSettings, IHostingEnvironment env)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _service = new SurveyService();
            _env = env;
            
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
        [HttpGet("file/{FileName}")]
        public ActionResult GetFile(String FileName)
        {
            AzureFileService fileService = new AzureFileService(this._appSettings);
            CloudFile cloudFile = fileService.getFIle("files", FileName);
            string path = Path.Combine(_env.WebRootPath, "files");
            cloudFile.DownloadToFile(Path.Combine(path, FileName), FileMode.Create);
            var stream = new FileStream(Path.Combine(path, FileName), FileMode.Open);
            var mimeProvider = new FileExtensionContentTypeProvider();
            string mimeType;
            mimeProvider.TryGetContentType(Path.Combine(path, FileName), out mimeType);
            return File(stream, mimeType);
        }

       [Authorize]
       [HttpDelete("file")]
       public ActionResult DeleteFile(DeleteFileRequest req)
        {
            AzureFileService fileService = new AzureFileService(this._appSettings);
            var result = fileService.DeleteFile("files", req.FileName);
            if(result){
                    ResearchFile research = _context.ResearchFile.Where(
                        researchFile => researchFile.ProjectId == req.ProjectId 
                        && researchFile.FileName == req.FileName).FirstOrDefault();
                    _context.ResearchFile.Remove(research);

                    IList<ResearchFile> researchFileList = _context.ResearchFile.Where(
                        researchFile => researchFile.ProjectId == req.ProjectId).ToList();
                return Ok(researchFileList);
            }
            return NotFound();
        }

        [Authorize]
        [HttpPost("file")]
        public ActionResult StoreFile(CreateResearchFileRequest req)
        {   
            string path = Path.Combine(_env.WebRootPath, "files");   
            IList<ResearchFile> researchFiles = new List<ResearchFile>();         
            foreach(IFormFile file in req.Files)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                string filepath = Path.Combine(path, fileName);
                FileStream fileStream = new FileStream(filepath, FileMode.Create);
                file.CopyTo(fileStream);
                fileStream.Close();
                AzureFileService fileService = new AzureFileService(this._appSettings);
                fileService.storeFile("files", fileName, filepath);
                ResearchFile researchFile = new ResearchFile();
                researchFile.FileName = fileName;
                researchFile.ProjectId = req.ProjectId;
                researchFiles.Add(researchFile);
                _context.ResearchFile.Add(researchFile);
            }

            _context.SaveChanges();
            return Ok(researchFiles);
        }


        [Authorize]
        [HttpGet("{ProjectUid}")]
        public ActionResult GetFiles(String ProjectUid)
        {
            Project project = _context.Project.Where(proj => proj.Uid == ProjectUid).First<Project>();
            IList<ResearchFile> researchFiles = _context.ResearchFile.Where(files => files.ProjectId == project.Id).ToList();
            return Ok(researchFiles);
        }
    }
}
