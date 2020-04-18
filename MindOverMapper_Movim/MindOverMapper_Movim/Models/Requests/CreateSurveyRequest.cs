using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace MindOverMapper_Movim.Models.Requests
{
    public partial class CreateSurveyRequest
    {
        public string SurveyName { get; set; }
        public string UniqueId { get; set; }
        public string ProjectUid { get; set; }
        public string Prototypes { get; set; }
        public string ConceptUid { get; set; }
        public string Notes { get; set; }
        public string Qualifications { get; set; }
        public string Questions { get; set; }
        public string Status { get; set; }
    }
}
