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
    public class clsArticle
    {
         private string conexion;
         public clsArticle()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
        public List<Article> getArticles(int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "select * from tblArticles";
                var articles = sqlConnection.Query<Article>(query, new { idCompany = idCompany }, commandType: System.Data.CommandType.Text).ToList();
                foreach(var article in articles)
                {
                    string queryCategory = "select * from tblArticleCategory where idArticle ="+article.idArticle;
                    List<ArticleCategory> listcategories = sqlConnection.Query<ArticleCategory>(queryCategory,commandType:System.Data.CommandType.Text).ToList();
                    article.articleCategories = listcategories;

                    string queryCategoryNumber = "select idCategory from tblArticleCategory where idArticle ="+article.idArticle;
                    List<int> listcategoriesNumber = sqlConnection.Query<int>(queryCategoryNumber,commandType:System.Data.CommandType.Text).ToList();
                    article.articleCategories = listcategories;
                    article.listCategoriesNumber = listcategoriesNumber;
                }
                return articles ?? new List<Article>();

            }
        }

        public Response insertArticle(Article article,List<int> articleCategories)
        {
            article.idUser = 1;

            string sql = "insert into tblArticles (nameArticle,description,salePrice,idCompany,idUser) values (@nameArticle,@description,@salePrice,@idCompany,@idUser)SELECT SCOPE_IDENTITY()";
            using (var sqlConnection = new SqlConnection(conexion))
            {
                sqlConnection.Open();
                using(var transaction = sqlConnection.BeginTransaction())
                {
                try
                {
                    var respuesta = sqlConnection.ExecuteScalar(sql, article,transaction:transaction);
                    int id= Convert.ToInt32(respuesta);

                        if (articleCategories.Count > 0)
                        {

                             for(var i=0; i<articleCategories.Count; i++)
                             {
                                string sqlInsertCategoryArticle ="insert into tblArticleCategory (idArticle,idCategory) values("+id+","+articleCategories[i]+")";
                                sqlConnection.ExecuteScalar(sqlInsertCategoryArticle ,transaction:transaction);

                             }
                        }

                        //if(articleCategories.Count >0)
                        //{
                        //    foreach(ArticleCategory art in articleCategories)
                        //    {
                        //        string sqlInsertCategoryArticle = "insert into tblArticleCategory (idArticle,idCategory) values ("+id+","+art.idCategory+")";
                        //        var resInsert= sqlConnection.Execute(sqlInsertCategoryArticle,art,transaction:transaction);
                        //    }
                        //}
                    transaction.Commit();
                    return new Response { Done = true, Message = "Articulo insertado exitosamente", Value = -1 };
                }
                catch (SqlException e)
                {
                        transaction.Rollback();
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

        }
         public Response updateArticle(Article article,List<int> articleCategories)
        {
            article.idUser = 1;

            string sql = "update tblArticles set nameArticle=@nameArticle, description=@description,salePrice =@salePrice where idArticle=@idArticle ";
            using (var sqlConnection = new SqlConnection(conexion))
            {
                sqlConnection.Open();
                using(var transaction = sqlConnection.BeginTransaction())
                {
                try
                {
                    var respuesta = sqlConnection.Execute(sql, article,transaction:transaction);

                        //Elimino todas las categorias
                    string sqlDelete = "delete tblArticleCategory where idArticle = "+article.idArticle;
                    sqlConnection.Execute(sqlDelete, transaction:transaction);
                        if (articleCategories.Count > 0)
                        {
                            for (var i = 0; i < articleCategories.Count; i++)
                            {
                                string sqlInsertCategoryArticle ="insert into tblArticleCategory (idArticle,idCategory) values("+article.idArticle+","+articleCategories[i]+")";
                                sqlConnection.ExecuteScalar(sqlInsertCategoryArticle ,transaction:transaction);
                            }
                        }

                        transaction.Commit();
                    return new Response { Done = true, Message = "Articulo editado exitosamente", Value = -1 };
                }
                catch (SqlException e)
                {
                        transaction.Rollback();
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

        }
        public Response deleteArticle(int idArticle)
        {
            string sql = "delete tblArticles where idArticle= @idArticle";
            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.Execute(sql, new { idArticle= idArticle});
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