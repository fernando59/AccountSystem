using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class ConfigurationIntegration
    {
        public int idCash { get; set; }
        public int idFiscalCredit{ get; set; }
        public int idFiscalDebit{ get; set; }
        public int idPurchases { get; set; }
        public int idSales{ get; set; }
        public int idIt{ get; set; }
        public int idItToPay{ get; set; }
        public int idCompany{ get; set; }
        public bool isIntegration{ get; set; }
    }
}