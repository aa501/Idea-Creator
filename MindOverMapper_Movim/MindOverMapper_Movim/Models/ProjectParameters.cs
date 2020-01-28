using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class ProjectParameters
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string Type { get; set; }
        public string Content { get; set; }
        public int? LinkId { get; set; }
        public int ProjectId { get; set; }
    }
}
