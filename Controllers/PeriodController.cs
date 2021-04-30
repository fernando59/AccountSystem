using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class PeriodController : Controller
    {

        private bsnPeriod bsnPeriod= new bsnPeriod();
        // GET: Period
        public ActionResult Index()
        {

            var management= (Management)Session["management"];
            ViewBag.idCompany = management.idCompany;
            ViewBag.idManagement = management.idManagement;
            return View();
        }
       public JsonResult getPeriod()
        {


            var management= (Management)Session["management"];
            var listPeriod= bsnPeriod.getPeriods(management.idManagement);
            return Json(new { data = listPeriod}, JsonRequestBehavior.AllowGet);
        }

       public JsonResult insertPeriod(Period period)
        {
            //var user = (User)Session["user"];
            var management = (Management)Session["management"];
            period.idUser = 1;//user.idUser;
            period.idManagement= management.idManagement;
            var periodResponse = bsnPeriod.insertPeriod(period);
            return Json(new { data = periodResponse }, JsonRequestBehavior.AllowGet);

        }
       [HttpPost]
        public JsonResult deletePeriod(int idPeriod)
        {
            var periodResponse = bsnPeriod.deletePeriod(idPeriod);
            return Json(new { data = periodResponse }, JsonRequestBehavior.AllowGet);

        }
        public JsonResult updatePeriod(Period period)
        {
            var periodResponse = bsnPeriod.updatePeriod(period);
            return Json(new { data = periodResponse }, JsonRequestBehavior.AllowGet);

        }

    }
}