using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnArticle
    {

        private clsArticle classArticle= new clsArticle();
        public List<Article> getArticles(int idCompany)
        {
            return classArticle.getArticles(idCompany);
        }


        public Response insertArticle(Article article,List<ArticleCategory> list)
        {
            return classArticle.insertArticle(article,list);

        } 

        public Response updateArticle(Article article)
        {
            return classArticle.updateArticle(article);

        } 

        public Response deleteArticle(int idArticle)
        {
            return classArticle.deleteArticle(idArticle);

        } 

    }
}