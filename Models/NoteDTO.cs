using AccountingSystem.Class.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class NoteDTO
    {
        public Note note{ get; set; }
        public List<Lote> lotes{ get; set; }
        public List<Detail> details{ get; set; }
        public Response  response { get; set; }


    }
}