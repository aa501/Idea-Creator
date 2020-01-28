using System;
using System.Collections.Generic;

namespace MindOverMapper_Movim.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Type { get; set; }
        public DateTime DateCreated { get; set; }
        public string Uid { get; set; }
        public int LoginAttempts { get; set; }
        public DateTime? LockOut { get; set; }
        public byte Active { get; set; }
    }
}
