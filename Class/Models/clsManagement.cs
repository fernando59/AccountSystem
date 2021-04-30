using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using Dapper;
using System.Configuration;
using AccountingSystem.Models;
using AccountingSystem.Class.Global;

namespace AccountingSystem.Class.Models
{
    public class clsManagement
    {
        private string conexion;

        public clsManagement()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
        public List<Management> getManagements(int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var managements= sqlConnection.Query<Management>("Select * from tblManagements where idCompany = @idCompany",new { idCompany=idCompany}, commandType: System.Data.CommandType.Text).ToList();
                return managements ?? new List<Management>();

            }
        }
        public Response insertManagement(Management management)
        {
            string sql = "insert into tblManagements (nameManagement,startDate,endDate,idUser,idCompany) " +
                "values (@nameManagement,@startDate,@endDate,@idUser,@idCompany)";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.Execute(sql, management);
                    return new Response{ Done= true, Message= "Creado exitosamente", Value= 1 };
                }
                catch (Exception e)
                {
                    if (e.InnerException != null && e.InnerException.InnerException != null)
                    {
                        return new Response
                        {
                            Done= false,
                            Message= e.Message + " IE " + e.InnerException.Message + " IE " +
                                      e.InnerException.InnerException.Message
                        };
                    }
                    else
                    {
                        return new Response{ Done= false, Message= e.Message };
                    }
                }

            }
        }
      public Response deleteManagement(int idManagement)
        {
            string sql = "delete tblManagements where idManagement= @idManagement";
            using (var connection = new SqlConnection(conexion))
            {
                try
                {

                var respuesta = connection.Execute(sql, new { idManagement= idManagement});
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
      public Response updateManagement(Management management)
        {
            string sql = "update tblManagements set nameManagement=@nameManagement,startDate=@startDate,endDate=@endDate where idManagement = @idManagement";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.Execute(sql, management);
                    return new Response { Done = true, Message = "Actualizado Exitosamente", Value = 1 };
                }
                catch (SqlException e)
                {
                    //error 42000 o 3726
                    if (e.ErrorCode == -2146232060)
                    {
                        return new Response
                        {
                            Done = false,
                            Message = "Nombre de gestion repetida"
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