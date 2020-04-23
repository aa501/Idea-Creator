using System;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class CreateResearchFileRequest
    {
      public string FileName { get; set; }
      public string uid { get; set; }
      public List<IFormFile> Files { get; set; }
    }
}
