using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class ManagementController : Controller
    {

        private bsnManagement bsnManagement= new bsnManagement();
        // GET: Management
        public ActionResult Index()
        {

            var company = (Company)Session["company"];
            ViewBag.idCompany = company.idCompany;
                if(company == null )
            {
                return RedirectToAction("Index", "Company");
            }
            return View();
        }
         public JsonResult getManagements()
        {

            var company = (Company)Session["company"];

            var listManagement= bsnManagement.getManagements(company.idCompany);
            return Json(new { data = listManagement}, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult insertManagement(Management management)
        {
            //var user = (User)Session["user"];
            var company = (Company)Session["company"];
            management.idUser = 1;//user.idUser;
            management.idCompany = company.idCompany;
            var managementResponse = bsnManagement.insertManagement(management);
            return Json(new { data = managementResponse }, JsonRequestBehavior.AllowGet);

        }
       [HttpPost]
        public JsonResult deleteManagement(int idManagement)
        {
            var ManagementResponse = bsnManagement.deleteManagement(idManagement);
            return Json(new { data = ManagementResponse }, JsonRequestBehavior.AllowGet);

        }
        public JsonResult updateManagement(Management management)
        {
            var managementResponse = bsnManagement.updateManagement(management);
            return Json(new { data = managementResponse }, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult goToPeriod(Management management)
        {

                Session["management"] = management;
            if (Session["management"] != null)
            {

                return Json(new { data = true },JsonRequestBehavior.AllowGet);
            }
            else
            {

                return Json(new { data = false},JsonRequestBehavior.AllowGet);
            }
        }





    }
}