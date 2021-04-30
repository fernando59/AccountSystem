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
    public class clsPeriod
    {
        private string conexion;

        public clsPeriod()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
        public List<Period> getPeriods(int idManagement)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var periods= sqlConnection.Query<Period>("Select * from tblPeriods where idManagement=@idManagement",new { idManagement=idManagement}, commandType: System.Data.CommandType.Text).ToList();
                return periods ?? new List<Period>();

            }
        }
         public Response insertPeriod(Period period)
        {
            string sql = "insert into tblPeriods (namePeriod,startDate,endDate,idUser,idManagement) " +
                "values (@namePeriod,@startDate,@endDate,@idUser,@idManagement)";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.Execute(sql, period);
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
       public Response deletePeriod(int idPeriod)
        {
            string sql = "delete tblPeriods where idPeriod= @idPeriod";
            using (var connection = new SqlConnection(conexion))
            {
                try
                {

                var respuesta = connection.Execute(sql, new { idPeriod= idPeriod});
                return new Response { Done = true, Message = "Eliminado Exitosamente", Value = 1 };
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
      public Response updateperiod(Period period)
        {
            string sql = "update tblPeriods set namePeriod=@namePeriod,startDate=@startDate,endDate=@endDate where idPeriod = @idPeriod";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.Execute(sql, period);
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
                            Message = "Nombre de periodo repetido"
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