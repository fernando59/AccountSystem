using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnLote
    {
       private clsLote classNote = new clsLote();
        public List<Lote> getLotes()
        {
            return classNote.getLotes(1,2);
        }

    }
}