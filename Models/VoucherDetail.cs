using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class VoucherDetail
    {
        public int idVaucherDetail { get; set; }
        public int numberVoucher { get; set; }
        public string gloss { get; set; }
        public decimal amountOwed{ get; set; }
        public decimal amountAssets{ get; set; }
        public decimal amountOwedAlt{ get; set; }
        public decimal amountAssetsAlt{ get; set; }
        public int idUser{ get; set; }
        public int  idVoucher{ get; set; }
        public int  idAccount{ get; set; }
    }
}