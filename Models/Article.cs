using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Article
    {
        public int idArticle{ get; set; }
        public string nameArticle{ get; set; }
        public string description{ get; set; }
        public int quantity{ get; set; }
        public decimal salePrice{ get; set; }
        public int dailyDemand{ get; set; }
        public DateTime dailyWaitTime{ get; set; }
        public DateTime dailyWaitTimeMax{ get; set; }
        public decimal costOrder{ get; set; }
        public decimal costInventory{ get; set; }
        public int pointNewOrder{ get; set; }
        public int idUser{ get; set; }
        public int idCompany{ get; set; }
        public List<Category> categories { get; set; }
        public List<ArticleCategory> articleCategories{ get; set; }
        public List<int> listCategoriesNumber { get; set; }
    }
}