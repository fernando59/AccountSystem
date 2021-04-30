using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class CompanyCurrency
    {
        public int idCompanyCurrency{ get; set; }
        public string exchange { get; set; }
        public string active { get; set; }
        public DateTime dateRegister{ get; set; }
        public int idCompany{ get; set; }
        public int idCurrencyMain { get; set; }
        public int idCurrencyAltern{ get; set; }
        public int idUser{ get; set; }
    }
}