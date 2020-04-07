using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public class Survey
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string SurveyName { get; set; }
        public int PricingOptionId { get; set; }
        public Boolean Idea { get; set; }
        public Boolean Package { get; set; }
        public Boolean Product { get; set; }
        public Boolean Name { get; set; }
        public Boolean PurchaseFrequency { get; set; }
        public Boolean PurchasePrice { get; set; }
        public Boolean Qualitative { get; set; }
        public Boolean Demographics { get; set; }
    }

}
