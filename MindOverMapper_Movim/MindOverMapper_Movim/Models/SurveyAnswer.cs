using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public partial class SurveyAnswer
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string SurveyTakerUid { get; set; }
        public string SurveyUid { get; set; }
        public string Answer { get; set; }
        public DateTime DateCompleted { get; set; }
        public int Qid { get; set; }
    }
}
