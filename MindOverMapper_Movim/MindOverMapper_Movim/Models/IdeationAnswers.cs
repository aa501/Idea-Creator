using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public partial class IdeationAnswers
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public int Cid { get; set; }
        public int Qid { get; set; }
        public string Answer { get; set; }
    }
}
