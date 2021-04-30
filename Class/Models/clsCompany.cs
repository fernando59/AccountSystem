using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using Dapper;
using System.Configuration;
using AccountingSystem.Models;
using AccountingSystem.Class.Global;

namespace AccountingSystem.Class.Models
{
    public class clsCompany
    {
        private string conexion;

        public clsCompany()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
        public List<Company> getCompanies()
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var companies = sqlConnection.Query<Company>("Select * from tblCompanies", commandType: System.Data.CommandType.Text).ToList();
                return companies ?? new List<Company>();

            }
        }

        public Company insertCompany(Company company)
        {
            string sql = "insert into tblCompanies (nameCompany,nit,sigla,cellphone,email,addressCompany,levels,idUser)" +
                        " values (@nameCompany,@nit,@sigla,@cellphone,@email,@addressCompany,@levels,@idUser) SELECT SCOPE_IDENTITY()";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.ExecuteScalar(sql,company);
                    company.idCompany = Convert.ToInt32(respuesta);
                    return company;
                }
                catch (SqlException e)
                {
                    if(e.ErrorCode == -2146232060)
                    {
                        return new Company();
                        //return new Response
                        //{
                        //    Done = false,
                        //    Message = "Registro repetido"                  
                        //};



                    }
                    else
                    {
                        return new Company();
                        //return new Response { Done = false, Message = e.Message,Value=0 };
                    }

                }

            }

        }

        public Response updateCompany(Company company)
        {
            string sql = "update tblCompanies  set nameCompany=@nameCompany,nit=@nit,sigla=@sigla,cellphone=@cellphone," +
                         "email=@email,addressCompany=@addressCompany,levels=@levels where idCompany = @idCompany ";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.Execute(sql, company);
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
        public Response deleteCompany(int idCompany)
        {
            string sql = "delete tblCompanies where idCompany= @idCompany";
            using (var connection = new SqlConnection(conexion))
            {
                try
                {

                var respuesta = connection.Execute(sql, new { idCompany = idCompany });
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