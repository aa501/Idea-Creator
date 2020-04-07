using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace MindOverMapper_Movim.Models.Requests
{
    public partial class CreateSurveyRequest
    {
        public string surveyName { get; set; }

        public Array questions { get; set; }
        public Array concepts { get; set; }
        public Array prototypes { get; set; }
        public int pricingOptionId { get; set; }
        public Boolean idea { get; set; }
        public Boolean package { get; set; }
        public Boolean product { get; set; }
        public Boolean name { get; set; }
        public Boolean purchaseFrequency { get; set; }
        public Boolean purchasePrice { get; set; }
        public Boolean qualitative { get; set; }
        public Boolean demographics { get; set; }

    }
}

