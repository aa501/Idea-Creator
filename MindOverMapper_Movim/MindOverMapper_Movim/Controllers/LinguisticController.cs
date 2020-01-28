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
using Syn.WordNet;
using System.IO;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class LinguisticController: Controller
    {

        private readonly MovimDbContext _context;
        private readonly AuthService _service;
        private readonly AppSettings _appSettings;

        public LinguisticController(MovimDbContext context, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _service = new AuthService(_appSettings);
        }

        [AllowAnonymous]
        [HttpPost("test")]
        public ActionResult Login([FromBody] LinguisticRequest linguisticRequest)
        {
            var directory = Directory.GetCurrentDirectory();
            directory = Path.Combine(directory, "Artifacts");

            var wordNet = new WordNetEngine();
            var words = new List<String>();

            try
            {
                wordNet.AddDataSource(new StreamReader(Path.Combine(directory, "data.adj")), PartOfSpeech.Adjective);
                wordNet.AddDataSource(new StreamReader(Path.Combine(directory, "data.adv")), PartOfSpeech.Adverb);
                wordNet.AddDataSource(new StreamReader(Path.Combine(directory, "data.noun")), PartOfSpeech.Noun);
                wordNet.AddDataSource(new StreamReader(Path.Combine(directory, "data.verb")), PartOfSpeech.Verb);

                wordNet.AddIndexSource(new StreamReader(Path.Combine(directory, "index.adj")), PartOfSpeech.Adjective);
                wordNet.AddIndexSource(new StreamReader(Path.Combine(directory, "index.adv")), PartOfSpeech.Adverb);
                wordNet.AddIndexSource(new StreamReader(Path.Combine(directory, "index.noun")), PartOfSpeech.Noun);
                wordNet.AddIndexSource(new StreamReader(Path.Combine(directory, "index.verb")), PartOfSpeech.Verb);

                wordNet.Load();

                var synSetList = wordNet.GetSynSets(linguisticRequest.Word);

                if (synSetList.Count == 0)
                    return BadRequest(new { message = "No Words Found." });

                foreach (var synSet in synSetList)
                {
                    foreach (string word in synSet.Words)
                    { words.Add(word); }
                }


                return Ok(words);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }



        }

  

    }
}
