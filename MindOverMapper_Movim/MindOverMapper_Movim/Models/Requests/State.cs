using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace MindOverMapper_Movim.Models
{
    public partial class State
    {
        public string rootTopicKey { get; set; }
        public List<object> topics { get; set; }
        public object config { get; set; }
    }
}
