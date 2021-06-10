using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class CategoryController : Controller
    {

        private bsnCategory bsnCategory= new bsnCategory();
        // GET: Category
        public ActionResult Index()
        {

            var company = (Company)Session["company"];
            return View();
        }
         public JsonResult getCategories()
        {
            var company = (Company)Session["company"];
            var listCategories= bsnCategory.getCategories(company.idCompany);
            return Json(new { data = listCategories}, JsonRequestBehavior.AllowGet);
        }
           public JsonResult insertCategory(Category category)
        {
            var company = (Company)Session["company"];
            category.idCompany = company.idCompany;
            var categoryResponse = bsnCategory.insertCategory(category);
            return Json(new { data = categoryResponse}, JsonRequestBehavior.AllowGet);
        }
       [HttpPost]
        public JsonResult deleteCategory(int idCategory)
        {
            var companyResponse = bsnCategory.deleteCategory(idCategory);
            return Json(new { data = companyResponse }, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult updateCategory(Category category )
        {
            var companyResponse = bsnCategory.updateCategory(category);
            return Json(new { data = companyResponse }, JsonRequestBehavior.AllowGet);

        }



    }
}