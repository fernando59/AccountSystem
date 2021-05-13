using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Voucher
    {
        public int idVoucher { get; set; }
        public int serieVoucher { get; set; }
        public string gloss { get; set; }
        public DateTime dateVoucher { get; set; }
        public decimal tc { get; set; }
        public int statusVoucher { get; set; }
        public int typeVoucher{ get; set; }
        public int idUser { get; set; }
        public int idCurrency { get; set; }
        public int idCompany{ get; set; }
        public string abbreviationCurrency{ get; set; }
    }
}