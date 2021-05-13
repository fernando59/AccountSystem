using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using AccountingSystem.Models;
using Dapper;
using AccountingSystem.Class.Global;

namespace AccountingSystem.Class.Models
{
    public class clsCurrency
    {
         private string conexion;
         public clsCurrency()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
         public List<Currency> getCurrency()
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "select * from tblCurrency where idCurrency !=1";
                var currencies= sqlConnection.Query<Currency>(query,commandType: System.Data.CommandType.Text).ToList();
                return currencies?? new List<Currency>();

            }
        }
         public List<Currency> getCurrencyWithOutMain(int idCompany,int idUser)
        {
            string sql = "select idCurrencyMain from tblCompanyCurrency where idCompany = "+idCompany;
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var idCurrency = sqlConnection.ExecuteScalar<int>(sql, commandType: System.Data.CommandType.Text);
                var query = "select * from tblCurrency where idCurrency !=1 and  idCurrency != "+idCurrency;
                var currencies= sqlConnection.Query<Currency>(query,commandType: System.Data.CommandType.Text).ToList();
                return currencies?? new List<Currency>();

            }
        }

        public Response insertCurrency(Currency currency)
        {

            string sql = "insert into tblCurrency (nameCurrency,descriptionCurrency,abbreviationCurrency,idUser) values(@nameCurrency,@descriptionCurrency,@abbreviationCurrency,@idUser)";
            using (var sqlConnection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = sqlConnection.Execute(sql, currency);
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