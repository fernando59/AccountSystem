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
    public class clsLote
    {
        private string conexion;
         public clsLote()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
         public List<Lote> getLotes(int idUser,int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "Select t.idAccount as id,t.codeAccount,concat(t.codeAccount,' - ',t.nameAccount) as text,t.nameAccount,t.levelAccount,t.typeAccount,t.idUser,t.idCompany,t.idAccountFather  from tblAccounts t  where idCompany =@idCompany order by levelAccount,codeAccount asc ";
                var companies = sqlConnection.Query<Lote>(query, new { idCompany=idCompany},commandType: System.Data.CommandType.Text).ToList();
                return companies ?? new List<Lote>();

            }
        }

    }
}