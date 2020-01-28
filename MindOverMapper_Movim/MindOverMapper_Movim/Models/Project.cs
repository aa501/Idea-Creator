using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class Project
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public int OwnerId { get; set; }
        public string Stimulus { get; set; }
        public string Definition { get; set; }
    }
}
