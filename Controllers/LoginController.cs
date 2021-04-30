using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        private bsnUser bsnUser = new bsnUser();
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult insertUser(User user)
        {
            var companyResponse = bsnUser.insertUser(user);
            return Json(new { data = companyResponse }, JsonRequestBehavior.AllowGet);

        }
        //[HttpPost]
        public JsonResult LoginUser(User user)
        {
            var response = bsnUser.verifyUser(user.userAccount, user.passwordAccount);

            if (response.Done)
            {
                var userResponse = bsnUser.getUser(response.Value);
                response.Message = "Logueado Exitosamente ";
                Session["user"] = "probando ";//userResponse;
                Session["h"] = "fdsdas";
                return Json(new { message = response.Message, Done = response.Done }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new { message= response.Message, Done= response.Done}, JsonRequestBehavior.AllowGet);
            }
        }


    }
}