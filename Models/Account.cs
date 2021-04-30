using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Account
    {
        public int id{ get; set; }
        public int idAccount{ get; set; }
        public string codeAccount { get; set; }
        public string text { get; set; }
        public string nameAccount { get; set; }
        public int levelAccount{ get; set; }
        public int typeAccount { get; set; }
        public int idUser { get; set; }
        public int idCompany { get; set; }
        public int idAccountFather { get; set; }
        public Array children { get; set; }

    }
}