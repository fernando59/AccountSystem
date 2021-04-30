using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Management
    {
        public int idManagement { get; set; }
        public string nameManagement { get; set; }
        public DateTime startDate { get; set; }

        public DateTime endDate { get; set; }
        public int state { get; set; }
        public int idUser { get; set; }
        public int idCompany { get; set; }
    }
}