using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public partial class SurveyTaker
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string SurveyUid { get; set; }
        public bool? Turk { get; set; }
    }
}
