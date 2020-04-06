using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public class ConceptSurvey
    {
        public int Id { get; set; }
        public int ConceptId { get; set; }
        public Concept Concept { get; set; }
        public int SurveyId { get; set; }
        public Survey Survey { get; set; }
    }
}
