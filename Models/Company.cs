using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Company
    {
        public int idCompany { get; set; }
        public string nameCompany { get; set; }
        public int nit { get; set; }

        public string sigla { get; set; }
        public string cellphone { get; set; }
        public string email { get; set; }
        public string addressCompany { get; set; }
        public int levels { get; set; }
        public int state { get; set; }
        public int idUser { get; set; }
        public int idCurrency { get; set; }
    }
}