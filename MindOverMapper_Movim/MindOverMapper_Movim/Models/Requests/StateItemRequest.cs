using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class StateItemRequest
    {
        public string key { get; set; }
        public string parentKey { get; set; }
        public string content { get; set; }
        public string desc { get; set; }
        public List<string> subItemKeys { get; set; }
        public bool collapse { get; set; }
    }
}