using System;
namespace MindOverMapper_Movim.Models.Requests
{
    public partial class PasswordRequest
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
