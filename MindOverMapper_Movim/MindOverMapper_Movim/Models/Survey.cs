using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public class Survey
    {
        public int id { get; set; }
        public int projectId { get; set; }
        public string SurveyName { get; set; }
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
