using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public class Concept
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string ConceptName { get; set; }
        public string NewsHeadline { get; set; }
        public string Customer { get; set; }
        public string CustomerProblem { get; set; }
        public string Promise { get; set; }
        public string Proof { get; set; }
        public string Price { get; set; }
        public string Passion { get; set; }
        public string DeathThreats { get; set; }
        public int ProjectId { get; set; }
    }
}
