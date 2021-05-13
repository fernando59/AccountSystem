using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Models
{
    public class clsVoucherDetail
    {
         private string conexion;
         public clsVoucherDetail()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
        // public List<VoucherDetail> getCurrency()
        //{
        //    using (var sqlConnection = new SqlConnection(conexion))
        //    {
        //        var query = "select * from tblCurrency where idCurrency !=1";
        //        var currencies= sqlConnection.Query<Currency>(query,commandType: System.Data.CommandType.Text).ToList();
        //        return currencies?? new List<Currency>();

        //    }
        //}

    }
}