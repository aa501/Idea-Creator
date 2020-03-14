using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class Question
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
        public DateTime DateCreated { get; set; }
        public string Archived { get; set; }
    }
}
