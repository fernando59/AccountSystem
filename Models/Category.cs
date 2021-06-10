using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class Category
    {
        public int idCategory { get; set; }
        public string nameCategory{ get; set; }
        public string text{ get; set; }
        public int id{ get; set; }
        public int levelCategory{ get; set; }
        public string description { get; set; }
        public int idCompany { get; set; }
        public int idUser { get; set; }
        public int idCategoryFather{ get; set; }
        public List<Category> children { get; set; }

    }
}