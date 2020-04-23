using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class ResearchFile
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string FileName {get; set; }
    }
}
