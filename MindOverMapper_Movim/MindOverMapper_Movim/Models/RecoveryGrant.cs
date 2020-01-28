using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class RecoveryGrant
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime DateSent { get; set; }
    }
}
