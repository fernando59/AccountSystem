using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class NoteController : Controller
    {

        private bsnNote bsnNote= new bsnNote();
        // GET: Note
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult IndexSale()
        {
            return View();
        }


        public ActionResult List()
        {

            return View();
        }
        public JsonResult getNote(int typeNote)
        {
            var company = (Company)Session["company"];
            var nroNote= bsnNote.nroNote(company.idCompany,typeNote);
            return Json(new { data = nroNote}, JsonRequestBehavior.AllowGet);
        }
         public JsonResult getLoteList(int idArticle)
        {
            var company = (Company)Session["company"];
            var nroNote= bsnNote.getLoteList(idArticle);
            return Json(new { data = nroNote}, JsonRequestBehavior.AllowGet);
        }

         public JsonResult getNotes(int typeNote)
        {
            var company = (Company)Session["company"];
            var nroNote= bsnNote.getNotes(company.idCompany,typeNote);
            return Json(new { data = nroNote}, JsonRequestBehavior.AllowGet);
        }


        public JsonResult insertBuyNote(Note note,List<Lote> lotes)
        {
            var company = (Company)Session["company"];
            note.idCompany = company.idCompany;
            note.idUser = 1;
            var res = bsnNote.insertBuyNote(note,lotes);
            return Json(new { data = res}, JsonRequestBehavior.AllowGet);
        }

         public JsonResult insertSaleNote(Note note,List<Detail> details)
        {
            var company = (Company)Session["company"];
            note.idCompany = company.idCompany;
            note.idUser = 1;
            var res = bsnNote.insertSaleNote(note,details);
            return Json(new { data = res}, JsonRequestBehavior.AllowGet);
        }



        public ActionResult ListSale()
        {
            return View();
        }
       public JsonResult getEditDataNote(int idNote)
        {
            var res = bsnNote.getEditDataNote(idNote);
            return Json(new { data = res}, JsonRequestBehavior.AllowGet);
        }
        public JsonResult deleteNote(int idNote,List<Lote> lotes)
        {
            var res = bsnNote.deleteNote(idNote,lotes);
            return Json(new { data = res}, JsonRequestBehavior.AllowGet);
        }





    }
}