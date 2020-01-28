using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace MindOverMapper_Movim.Models
{
    public partial class StateRequest
    {
        public int version { get; set; }
        public State state { get; set; }
    }
}
