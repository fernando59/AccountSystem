using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Note
    {
        public int idNote { get; set; }
        public int nroNote { get; set; }
        public DateTime dateNote { get; set; }
        public string description { get; set; }
        public float total { get; set; }
        public int typeNote { get; set; }
        public int idCompany { get; set; }
        public int idUser { get; set; }
        public int statusNote{ get; set; }
        public int idVoucher { get; set; }
    }
}