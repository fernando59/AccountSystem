using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnCategory
    {

        private clsCategory classCategory= new clsCategory();
         public Category insertCategory(Category category)
        {
            return classCategory.insertCategory(category);
        }
        public List<Category> getCategories(int idCompany)
        {
            return classCategory.getCategories(idCompany);
        }
       public Response updateCategory(Category category)
        {
            return classCategory.updateCategory(category);
        }

        public Response deleteCategory(int idCategory)
        {
            return classCategory.deleteCategory(idCategory);
        }



    }
}