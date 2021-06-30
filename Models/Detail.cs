using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Detail
    {
        public int idArticle { get; set; }
        public int idVoucher{ get; set; }
        public int idNote{ get; set; }
        public int nroLote { get; set; }
        public DateTime dateEntry { get; set; }
        public int quantityDetail{ get; set; }
        public decimal priceSale { get; set; }
        public decimal subTotal{ get; set; }
        public string article { get; set; }
        public int statusLote{ get; set; }

    }
}