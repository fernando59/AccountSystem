using AccountingSystem.Class.Bussines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class CurrencyController : Controller
    {
        // GET: Currency
        private bsnCurrency bsnCurrency= new bsnCurrency();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult getCurrency()
        {
            //var user = (User)Session["user"];
            //var company = (Company)Session["company"];
            var listCurrency=bsnCurrency.getCurrency();
            return Json(new { data = listCurrency }, JsonRequestBehavior.AllowGet);
        }
    }
}