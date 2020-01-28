using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;
using SendGrid;
using SendGrid.Helpers.Mail;
using MindOverMapper_Movim.Helpers;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;

namespace MindOverMapper_Movim.Services
{
    public class Service
    {

        public Service()
        {
        }

        public string GetUid(ClaimsIdentity identity)
        {
            IEnumerable<Claim> claims = identity.Claims;
            return identity.FindFirst(ClaimTypes.NameIdentifier).Value;
        }

        public string GetType(ClaimsIdentity identity)
        {
            IEnumerable<Claim> claims = identity.Claims;
            return identity.FindFirst(ClaimTypes.Role).Value;
        }

    }
}
