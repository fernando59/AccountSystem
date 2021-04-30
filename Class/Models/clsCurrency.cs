using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using AccountingSystem.Models;
using Dapper;

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
                var query = "Select * from tblCurrency";
                var currencies= sqlConnection.Query<Currency>(query,commandType: System.Data.CommandType.Text).ToList();
                return currencies?? new List<Currency>();

            }
        }

    }
}