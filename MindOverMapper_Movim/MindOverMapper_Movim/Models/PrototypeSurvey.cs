using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public class PrototypeSurvey
    {
        public int Id { get; set; }
        public int PrototypeId { get; set; }
        public Prototype Prototype { get; set; }
        public int SurveyId { get; set; }
        public Survey Survey { get; set; }

    }
}
