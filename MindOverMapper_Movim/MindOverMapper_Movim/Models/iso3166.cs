using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MindOverMapper_Movim.Models
{
    public class iso3166
    {
        public int Id { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public string CountryCodeAlpha3 { get; set; }
        public string CountryNumericCode { get; set; }
    }
}
