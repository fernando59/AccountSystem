using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class ConfigurationController : Controller
    {
        // GET: Configuration

        private bsnVoucher bsnVoucher= new bsnVoucher();
        private bsnConfiguration bsnConfiguration= new bsnConfiguration();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getAccounts()
        {
            var company = (Company)Session["company"];
            var accounts = bsnVoucher.getAccountList(company.idCompany,1);
            return Json(new { data = accounts}, JsonRequestBehavior.AllowGet);
        }
        public JsonResult insertConfiguration(ConfigurationIntegration configurationIntegration)
        {
            var company = (Company)Session["company"];
            configurationIntegration.idCompany = company.idCompany;
            var configuration= bsnConfiguration.insertConfiguration(configurationIntegration);
            return Json(new { data = configuration}, JsonRequestBehavior.AllowGet);
        }
        public JsonResult checkIfExist()
        {

            var company = (Company)Session["company"];
            var configuration= bsnConfiguration.checkIfExist(company.idCompany);
            return Json(new { data = configuration}, JsonRequestBehavior.AllowGet);
        }

    }
}