using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace MindOverMapper_Movim.Models
{
    public partial class UpdateProjectRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Definition { get; set; }
        public List<ProjectParametersRequest> Exclusions { get; set; }
        public List<ProjectParametersRequest> AreasOfResearch { get; set; }
    }
}
