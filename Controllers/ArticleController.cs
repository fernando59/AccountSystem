using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class ArticleController : Controller
    {

        private bsnArticle bsnArticle= new bsnArticle();
        // GET: Article
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult getArticles()
        {
            var company = (Company)Session["company"];
            var listArticles = bsnArticle.getArticles(company.idCompany);
            return Json(new { data = listArticles}, JsonRequestBehavior.AllowGet);
        }


        public JsonResult insertArticle(Article article,List<int> categories)
        {

            var company = (Company)Session["company"];
            article.idCompany = company.idCompany;
            var articleResponse = bsnArticle.insertArticle(article,categories);
            return Json(new { data = articleResponse}, JsonRequestBehavior.AllowGet);
        }
         public JsonResult updateArticle(Article article,List<int> categories)
        {

            var articleResponse = bsnArticle.updateArticle(article,categories);
            return Json(new { data = articleResponse}, JsonRequestBehavior.AllowGet);
        }
        public JsonResult deleteArticle(int id)
        {

            var articleResponse = bsnArticle.deleteArticle(id);
            return Json(new { data = articleResponse}, JsonRequestBehavior.AllowGet);
        }


    }
}