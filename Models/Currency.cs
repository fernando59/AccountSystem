using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Currency
    {
        public int idCurrency{ get; set; }
        public string nameCurrency { get; set; }
        public string descriptionCurrency { get; set; }

        public string abbreviationCurrency{ get; set; }
        public int idUser { get; set; }
    }
}