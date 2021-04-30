using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Period
    {
        public int idPeriod { get; set; }
        public string namePeriod { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public int statusPeriod { get; set; }
        public int idUser { get; set; }
        public int state { get; set; }
        public int idManagement { get; set; }

    }
}