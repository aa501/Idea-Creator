using System;
namespace MindOverMapper_Movim.Models
{
    public partial class UserRequest
    {
        public string Uid { get; set; }
        public bool? Active { get; set; }
        public string Type { get; set; }
    }
}
