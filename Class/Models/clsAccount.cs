using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using AccountingSystem.Models;
using Dapper;
using AccountingSystem.Class.Global;

namespace AccountingSystem.Class.Models
{
    public class clsAccount
    {

        private string conexion;
         public clsAccount()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
         public List<Account> getAccounts(int idUser,int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "Select t.idAccount as id,t.codeAccount,concat(t.codeAccount,' - ',t.nameAccount) as text,t.nameAccount,t.levelAccount,t.typeAccount,t.idUser,t.idCompany,t.idAccountFather  from tblAccounts t  where idCompany =@idCompany order by levelAccount,codeAccount asc ";
                var companies = sqlConnection.Query<Account>(query, new { idCompany=idCompany},commandType: System.Data.CommandType.Text).ToList();
                return companies ?? new List<Account>();

            }
        }

         public List<Account> getLastAccounts(int idUser,int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "Select t.idAccount as id,t.codeAccount,concat(t.codeAccount,' - ',t.nameAccount) as text,t.nameAccount,t.levelAccount,t.typeAccount,t.idUser,t.idCompany,t.idAccountFather  from tblAccounts t  where idCompany =@idCompany order by levelAccount,codeAccount asc ";
                var companies = sqlConnection.Query<Account>(query, new { idCompany=idCompany},commandType: System.Data.CommandType.Text).ToList();
                return companies ?? new List<Account>();

            }
        }
       public Account inserAccount(Account account)
        {
            string sql = "";
            if(account.idAccountFather == 0)
            {

            sql = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather)" +
                        " values (@codeAccount,@nameAccount,@levelAccount,@typeAccount,@idUser,@idCompany,null) SELECT SCOPE_IDENTITY()";
            }
            else
            {

            sql = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather)" +
                        " values (@codeAccount,@nameAccount,@levelAccount,@typeAccount,@idUser,@idCompany,@idAccountFather) SELECT SCOPE_IDENTITY()";
            }
            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.ExecuteScalar(sql,account);
                    account.id= Convert.ToInt32(respuesta);
                    return account;
                }
                catch (SqlException e)
                {
                    if(e.ErrorCode == -2146232060)
                    {
                        return new Account();
                        //return new Response
                        //{
                        //    Done = false,
                        //    Message = "Registro repetido"                  
                        //};



                    }
                    else
                    {
                        return new Account();
                        //return new Response { Done = false, Message = e.Message,Value=0 };
                    }

                }

            }

        }
       public Response updateAccount(Account account)
        {
            string sql = "update tblAccounts set nameAccount = @nameAccount where idAccount = @idAccount ";

            using (var connection = new SqlConnection(conexion))
            {
                try
                {
                    var respuesta = connection.Execute(sql, account);
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


        public Response deleteAccount(int idAccount)
        {
            string sql = "delete tblAccounts where idAccount= @idAccount";
            using (var connection = new SqlConnection(conexion))
            {
                try
                {

                var respuesta = connection.Execute(sql, new { idAccount = idAccount });
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