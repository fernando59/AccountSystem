using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class User
    {
        public int idUser { get; set; }
        public string nameUser { get; set; }
        public string userAccount { get; set; }

        public string passwordAccount { get; set; }
        public int typeAccount { get; set; }
        public int state { get; set; }

          }
}