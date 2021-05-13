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
    public class clsCompanyCurrency
    {
         private string conexion;

        public clsCompanyCurrency()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
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

        public List<CompanyCurrency> getCompanyCurrency(int idCompany,int idUser)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {

                var query = "select tcc.idCompanyCurrency,tc1.abbreviationCurrency as main,tc2.abbreviationCurrency as altern,tcc.exchange,tcc.active,tcc.dateRegister  " +
                    "from tblCompanyCurrency tcc " +
                    "join tblCurrency tc1  on tcc.idCurrencyMain = tc1.idCurrency " +
                    "join tblCurrency tc2 on tcc.idCurrencyAltern = tc2.idCurrency "+
                    "where tcc.idCompany ="+idCompany+" and tcc.idUser ="+idUser+
                    " ORDER BY tcc.active  desc,tcc.dateRegister desc";
                var currencies= sqlConnection.Query<CompanyCurrency>(query,commandType: System.Data.CommandType.Text).ToList();
                return currencies?? new List<CompanyCurrency>();

            }
        }

        public string getCurrency(int idCompany,int idUser)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {

                var query = "select top 1 tc.nameCurrency " +
                    " from tblCompanyCurrency tcc,tblCurrency tc" +
                    " where tcc.idCompany =" + idCompany + " and tcc.idCurrencyAltern = 1 and  tcc.idCurrencyMain =  tc.idCurrency and tcc.idUser =" + idUser;
                string currencies= sqlConnection.ExecuteScalar<string>(query,commandType: System.Data.CommandType.Text);
                return currencies;

            }
        }
      public Response addCompanyCurrency(CompanyCurrency companyCurrency)
        {

            string sql = "insert into tblCompanyCurrency (exchange,active,dateRegister,idCompany,idCurrencyMain,idCurrencyAltern,idUser)  values (@exchange,@active,@dateRegister,@idCompany,@idCurrencyMain,@idCurrencyAltern,@idUser)";
            companyCurrency.dateRegister = DateTime.Now;
            string sqlGetActive = "select idCompanyCurrency from tblCompanyCurrency where active=1 and idCompany="+companyCurrency.idCompany;
            using (var sqlConnection = new SqlConnection(conexion))
            {

                var queryGetCurrencyMain = "select  top 1 idCurrencyMain from tblCompanyCurrency where idCompany="+companyCurrency.idCompany ;
                var idCurrencyMain = sqlConnection.ExecuteScalar<int>(queryGetCurrencyMain, commandType: System.Data.CommandType.Text);
                    companyCurrency.idCurrencyMain = idCurrencyMain;

                var idCompanyActive = sqlConnection.ExecuteScalar<int>(sqlGetActive, commandType: System.Data.CommandType.Text);
                string sqlUpdateActive = "update tblCompanyCurrency set active=0 where idCompanyCurrency =" + idCompanyActive;
                var res = sqlConnection.Execute(sqlUpdateActive, new { idCompanyActive = idCompanyActive });
                try
                {
                    var respuesta = sqlConnection.Execute(sql, companyCurrency);
                    return new Response { Done = true, Message = "Moneda insertada Exitosamente", Value = -1 };
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

    }
}