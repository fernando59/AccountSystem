using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Lote
    {
        public int idArticle { get; set; }
        public int idNote{ get; set; }
        public int nroLote { get; set; }
        public DateTime dateEntry { get; set; }
        public DateTime dueDate { get; set; }
        public int quantityLote { get; set; }
        public decimal price { get; set; }
        public decimal subTotal{ get; set; }
        public string article { get; set; }
        public int statusLote{ get; set; }
        public int stock { get; set; }


    }
}