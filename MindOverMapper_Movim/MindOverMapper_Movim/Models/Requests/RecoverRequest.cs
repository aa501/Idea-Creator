using System;
namespace MindOverMapper_Movim.Models
{
    public partial class RecoverRequest
    {
        public string Code { get; set; }
        public string Grant { get; set; }
        public string NewPassword { get; set; }
    }
}
