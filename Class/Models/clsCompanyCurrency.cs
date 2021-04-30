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
    public class clsCompanyCurrency
    {
         private string conexion;

        public clsCompanyCurrency()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
        //public List<Company> getCompanies()
        //{
        //    using (var sqlConnection = new SqlConnection(conexion))
        //    {
        //        var companies = sqlConnection.Query<Company>("Select * from tblCompanies", commandType: System.Data.CommandType.Text).ToList();
        //        return companies ?? new List<Company>();

        //    }
        //}

        public CompanyCurrency insertCompanyCurrency(CompanyCurrency companyCurrency)
        {
            string sql = "";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.ExecuteScalar(sql,companyCurrency);
                    //company.idCompany = Convert.ToInt32(respuesta);
                    return companyCurrency;
                }
                catch (SqlException e)
                {
                    if(e.ErrorCode == -2146232060)
                    {
                        return new CompanyCurrency();
                        //return new Response
                        //{
                        //    Done = false,
                        //    Message = "Registro repetido"                  
                        //};



                    }
                    else
                    {
                        return new CompanyCurrency();
                        //return new Response { Done = false, Message = e.Message,Value=0 };
                    }

                }

            }

        }

    }
}