using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class ProjectStimulus
    {
        public StateRequest state { get; set; }
        public List<StateItemRequest> related { get; set; }
        public List<StateItemRequest> unrelated { get; set; }
    }
}
