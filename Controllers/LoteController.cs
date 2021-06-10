using AccountingSystem.Class.Bussines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class LoteController : Controller
    {

        private bsnLote bsnLote= new bsnLote();
        // GET: Lote
        public ActionResult Index()
        {
            return View();
        }
    }
}