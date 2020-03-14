using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class CreateProjectRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Definition { get; set; }
        public StimulusRequest ProblemStatement { get; set; }
        public List<ProjectParametersRequest> Exclusions { get; set; }
        public List<ProjectParametersRequest> AreasOfResearch { get; set; }
        public List<StimulusRequest> InitStimulus { get; set; }
        public List<StimulusRequest> RelatedStimulus { get; set; }
        public List<StimulusRequest> UnrelatedStimulus { get; set; }
    }
}
   
