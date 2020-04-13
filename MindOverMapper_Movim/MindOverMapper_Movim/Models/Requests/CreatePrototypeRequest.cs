using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MindOverMapper_Movim.Models.Requests
{
    public class CreatePrototypeRequest
    {
        public string PrototypeName { get; set; }
        public string PrototypeDescription { get; set; }
        public string ProjectUid { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}
