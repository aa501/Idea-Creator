using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class SurveyPrototype
    {
        public int Id { get; set; }
        public int PrototypeId { get; set; }
        public int SurveyId { get; set; }
    }
}
