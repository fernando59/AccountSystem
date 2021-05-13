using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class CompanyCurrencyController : Controller
    {
        private bsnCompanyCurrency bsnCompanyCurrency = new bsnCompanyCurrency();
        // GET: CompanyCurrency
        public ActionResult Index()
        {
            return View();
        }
      
        public ActionResult getCompanyCurrency()
        {
            var company = (Company)Session["company"];
            var listCompanyCurrency = bsnCompanyCurrency.getCompanyCurrency(company.idCompany,1);
            var currency = bsnCompanyCurrency.getCurrency(company.idCompany, 1);
            return Json(new { data = listCompanyCurrency,currency = currency}, JsonRequestBehavior.AllowGet);
        }
         public JsonResult addCompanyCurrency(CompanyCurrency companyCurrency)
        {
            //var user = (User)Session["user"];
            var company = (Company)Session["company"];
            companyCurrency.idUser = 1;//user.idUser;
            companyCurrency.idCompany = company.idCompany;
            var currencyResponse = bsnCompanyCurrency.addCompanyCurrency(companyCurrency);
            return Json(new { data = currencyResponse }, JsonRequestBehavior.AllowGet);



        }

    }
}