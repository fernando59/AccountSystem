using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class VoucherDetail
    {
        public int idVoucherDetail { get; set; }
        public int numberVoucher { get; set; }
        public string gloss { get; set; }
        public string account{ get; set; }
        public double amountOwed{ get; set; }
        public double amountAssets{ get; set; }
        public double  amountOwedAlt{ get; set; }
        public double amountAssetsAlt{ get; set; }
        public int idUser{ get; set; }
        public int stateAddorUpdate { get; set; } = 1;
        public int  idVoucher{ get; set; }
        public int  idAccount{ get; set; }
    }
}