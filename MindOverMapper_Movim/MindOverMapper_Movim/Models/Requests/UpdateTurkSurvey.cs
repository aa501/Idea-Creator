using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace MindOverMapper_Movim.Models.Requests
{
    public partial class UpdateTurkSurvey
    {
        public string SurveyName { get; set; }
        public string Prototypes { get; set; }
        public string ConceptUid { get; set; }
        public string Notes { get; set; }
        public string Qualifications { get; set; }
        public string Questions { get; set; }
        public string Status { get; set; }
        public string reward { get; set; }
        public string country { get; set; }
        public string subDivision{get;set;}
        public int maxSurveys{ get; set;}
    }
}
