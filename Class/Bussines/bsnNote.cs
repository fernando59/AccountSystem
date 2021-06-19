using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnNote
    {
         private clsNote classNote = new clsNote();
        public List<Note> getNotes(int idCompany,int typeNote)
        {
            return classNote.getNotes(idCompany,typeNote);
        }
       public List<Lote> getLoteList(int idArticle)
        {
            return classNote.getLoteList(idArticle);
        }


        public DetailDTO insertSaleNote(Note note, List<Detail> details)
        {

            return classNote.insertSaleNote(note, details);
        }
        public NoteDTO insertBuyNote(Note note, List<Lote> lotes)
        {

            return classNote.insertBuyNote(note, lotes);
        }

        public int nroNote (int idCompany,int typeNote)
        {
            return classNote.getNroNext(idCompany,typeNote);
        }
        public NoteDTO getEditDataNote(int idNote)
        {
            return classNote.getEditDataNote(idNote);
        }
        public Response deleteNote(int idNote,List<Lote> lotes)
        {
            return classNote.deleteNote(idNote,lotes);
        }



    }
}