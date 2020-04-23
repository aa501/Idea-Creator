using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public class Survey
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string SurveyName { get; set; }
        public int ProjectId { get; set; }
        public string Prototypes { get; set; }
        public int ConceptId { get; set; }
        public string Notes { get; set; }
        public string Qualifications { get; set; }
        public string Questions { get; set; }
        public DateTime DateCreated { get; set; }
        public string Status { get; set; }
        public string EndDate { get; set; }
        public string Reward { get; set; }
        public string HitId { get; set; }
    }
}
