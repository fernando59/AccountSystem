using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account

        private bsnAccount bsnAccount = new bsnAccount();
        public ActionResult Index()
        {
            var company = (Company)Session["company"];
            ViewBag.idCompany = company.idCompany;
            return View();
        }
        //[HttpGet]
        public JsonResult getAccounts()
        {
            var user = (User)Session["user"];
            var company = (Company)Session["company"];
            var listAccounts = bsnAccount.getAccounts(1, company.idCompany);
            return Json(new { data = listAccounts }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult insertAccount(Account account)
        {

            var company = (Company)Session["company"];
            account.idCompany = company.idCompany;
            var inserted = bsnAccount.insertAccount(account);
            return Json(new { data = inserted }, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult deleteAccount(int idAccount)
        {
            var companyResponse = bsnAccount.deleteAccount(idAccount);
            return Json(new { data = companyResponse }, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult updateCompany(Account account )
        {
            var companyResponse = bsnAccount.updateAccount(account);
            return Json(new { data = companyResponse }, JsonRequestBehavior.AllowGet);

        }


    }
}