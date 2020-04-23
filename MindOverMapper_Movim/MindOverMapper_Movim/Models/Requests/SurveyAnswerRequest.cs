using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public partial class SurveyAnswerRequest
    {
        public string SurveyUid { get; set; }
        public string[] AnswerList { get; set; }
        public bool? Turk { get; set; }
        public string Demographics { get; set; }
    }
}
