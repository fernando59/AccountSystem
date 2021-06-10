using AccountingSystem.Class.Global;
using AccountingSystem.Models;
using Dapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Models
{
    public class clsCategory
    {
        private string conexion;
         public clsCategory()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }

        public List<Category> getCategories(int idCompany)
        {
            using(var sqlConnection = new SqlConnection(conexion))
            {
                var categories = getCategoriesRecursive(idCompany, 0);
                return categories ??new List<Category>();
            }
        }
        public List<Category> getCategoriesRecursive(int idCompany,int idCategoryParent)
        {
            using (var sqlConnection = new SqlConnection(conexion))


            {
                var query = "select * from tblCategories where idCompany ="+idCompany+" and idCategoryFather = "+idCategoryParent;
                if (idCategoryParent == 0)
                {
                 query = "select * from tblCategories where idCompany ="+idCompany+" and idCategoryFather is null ";
                }
                
                var categories = sqlConnection.Query<Category>(query, commandType: System.Data.CommandType.Text).ToList();
                     List<Category> categories1 = new List<Category>();
                if(categories.Count > 0)
                {

                     foreach (var category in categories)
                     {
                         Category newCategory = new Category();
                         newCategory.children = getCategoriesRecursive(category.idCompany,category.idCategory);
                         newCategory.description = category.description;
                         newCategory.text = category.nameCategory;
                         newCategory.idCategoryFather = category.idCategoryFather;
                         newCategory.id = category.idCategory;
                        newCategory.levelCategory = category.levelCategory;
                         newCategory.nameCategory = category.nameCategory;
                         newCategory.idCategory = category.idCategory;
                         categories1.Add(newCategory);

                     }
                     return categories1 ?? new List<Category>();
                }
                else
                {
                    return categories1;
                }
            }
        }
        public Response updateCategory(Category category)
        {
            string sql = "update tblCategories set nameCategory = @nameCategory,description=@description where idCategory = @idCategory ";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.Execute(sql, category);
                    return new Response { Done = true, Message = "Actualizado Exitosamente", Value = -1 };
                }
                catch (SqlException e)
                {
                    //error 42000 o 3726
                    if (e.ErrorCode == -2146232060)
                    {
                        return new Response
                        {
                            Done = false,
                            Message = "Registro repetido"
                        };
                    }
                    else
                    {
                        return new Response { Done = false, Message = e.Message, Value = 0 };
                    }
                }

            }

        }

       public Category insertCategory(Category category)
        {
            category.idUser = 1;
            string sql = "";
            if(category.idCategoryFather == 0)
            {
             sql = "insert into tblCategories (nameCategory,description,levelCategory,idCompany,idUser,idCategoryFather) values(@nameCategory,@description,@levelCategory,@idCompany,@idUser,null) SELECT SCOPE_IDENTITY()";
            }
            else
            {
             sql = "insert into tblCategories (nameCategory,description,levelCategory,idCompany,idUser,idCategoryFather) values(@nameCategory,@description,@levelCategory,@idCompany,@idUser,@idCategoryFather) SELECT SCOPE_IDENTITY()";
            }
            using (var sqlConnection = new SqlConnection(conexion))
            {
                sqlConnection.Open();
                using(var transaction = sqlConnection.BeginTransaction())
                {
                try
                {
                    var respuesta = sqlConnection.ExecuteScalar(sql, category,transaction:transaction);
                    category.idCategory= Convert.ToInt32(respuesta);
                     transaction.Commit();
                     return category;
                }
                catch (SqlException e)
                {
                        transaction.Rollback();
                    //error 42000 o 3726
                        return new Category();
                }
                }



            }

        }

        public Response deleteCategory(int idCategory)
        {
            string sql = "delete tblCategories where idCategory= @idCategory";
            using (var connection = new SqlConnection(conexion))
            {
                try
                {

                var respuesta = connection.Execute(sql, new { idCategory = idCategory });
                return new Response { Done = true, Message = "Successfully deleted", Value = 1 };
                }catch(Exception e)
                {
                    if (e.InnerException != null && e.InnerException.InnerException != null)
                    {
                        return new Response
                        {
                            Done = false,
                            Message = e.Message + " IE " + e.InnerException.Message + " IE " +
                                      e.InnerException.InnerException.Message
                        };
                    }
                    else
                    {
                        return new Response { Done = false, Message = e.Message, Value = 0 };
                    }
                }
            }


        }

    }
}