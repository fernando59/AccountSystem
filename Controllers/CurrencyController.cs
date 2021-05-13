using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
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
            var listCurrency=bsnCurrency.getCurrency();
            return Json(new { data = listCurrency }, JsonRequestBehavior.AllowGet);
        }
         public JsonResult getCurrencyWithOutMain()
        {
            //var user = (User)Session["user"];
            var company = (Company)Session["company"];
            var listCurrency=bsnCurrency.getCurrencyWithOutMain(company.idCompany,1);
            return Json(new { data = listCurrency }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult insertCurrency(Currency currency)
        {
            //var user = (User)Session["user"];
            currency.idUser = 1;//user.idUser;
            var currencyResponse = bsnCurrency.insertCurrency(currency);
            return Json(new { data = currencyResponse }, JsonRequestBehavior.AllowGet);



        }

    }
}