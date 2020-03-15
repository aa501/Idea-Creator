using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public partial class Prototype
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public int ProjectId { get; set; }
        public string PrototypeDescription { get; set; }
        public string PrototypeName { get; set; }
    }
}
