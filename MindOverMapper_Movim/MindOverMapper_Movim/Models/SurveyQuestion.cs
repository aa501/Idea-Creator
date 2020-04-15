using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class SurveyQuestion
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public int SurveyId { get; set; }
    }
}
