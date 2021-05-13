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

        public  Company insertCompany(Company company)
        {
            string sql = "insert into tblCompanies (nameCompany,nit,sigla,cellphone,email,addressCompany,levels,idUser)" +
                        " values (@nameCompany,@nit,@sigla,@cellphone,@email,@addressCompany,@levels,@idUser) SELECT SCOPE_IDENTITY()";
            using (var connection = new SqlConnection(conexion))
            {
                connection.Open();
                      using(var transaction = connection.BeginTransaction())
                {

                try
                {
                    var respuesta = connection.ExecuteScalar(sql,company,transaction:transaction);
                    int idCompany =Convert.ToInt32(respuesta);
                    string codeAccountInsert = string.Concat(Enumerable.Repeat(".0", company.levels-1));
                    string codeAccountInsertSecond = string.Concat(Enumerable.Repeat(".0", company.levels-2));
                    string sqlInsertAccount1 = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather) values ('1"+codeAccountInsert+"','Activo',1,2,1,"+idCompany+",null)";
                    string sqlInsertAccount2 = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather) values ('2"+codeAccountInsert+"','Pasivo',1,2,1,"+idCompany+",null)";
                    string sqlInsertAccount3 = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather) values ('3"+codeAccountInsert+"','Patrimonio',1,2,1,"+idCompany+",null)";
                    string sqlInsertAccount4 = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather) values ('4"+codeAccountInsert+"','Ingresos',1,2,1,"+idCompany+",null)";
                    string sqlInsertAccount5 = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather) values (@codeAccount,@nameAccount,@levelAccount,@typeAccount,@idUser,@idCompany,null) SELECT SCOPE_IDENTITY()";
                    connection.Execute(sqlInsertAccount1, transaction: transaction);
                    connection.Execute(sqlInsertAccount2, transaction: transaction);
                    connection.Execute(sqlInsertAccount3, transaction: transaction);
                    connection.Execute(sqlInsertAccount4, transaction: transaction);
                    var account1 = new Account();
                    account1.codeAccount = "5"+codeAccountInsert;
                    account1.nameAccount= "Egresos";
                    account1.levelAccount = 1;
                    account1.typeAccount = 1;
                    account1.idUser= 1;
                    account1.idCompany= idCompany;
                    var egresos =connection.ExecuteScalar(sqlInsertAccount5,account1, transaction: transaction);
                    int idEgresos = Convert.ToInt32(egresos);

                    string sqlInsertAccount51 = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather) values ('5.1"+codeAccountInsertSecond+"','Costos',2,2,1,"+idCompany+","+idEgresos+")";
                    string sqlInsertAccount52 = "insert into tblAccounts (codeAccount,nameAccount,levelAccount,typeAccount,idUser,idCompany,idAccountFather) values ('5.2"+codeAccountInsertSecond+"','Gastos',2,2,1,"+idCompany+","+idEgresos+")";
                    connection.Execute(sqlInsertAccount51, transaction: transaction);
                    connection.Execute(sqlInsertAccount52, transaction: transaction);
                    company.idCompany = idCompany;
                    string sqlInsertCurrencyCompany = "insert into tblCompanyCurrency (exchange,active,dateRegister,idCompany,idCurrencyMain,idCurrencyAltern,idUser) values (@exchange,@active,@dateRegister,@idCompany,@idCurrencyMain,1,@idUser)";
                    var currencyCompany = new CompanyCurrency();
                    currencyCompany.active = true;
                    currencyCompany.exchange = 0;
                    currencyCompany.idCompany = idCompany;
                    currencyCompany.dateRegister = DateTime.Now;
                    currencyCompany.idCurrencyMain =company.idCurrency;
                    currencyCompany.idCurrencyAltern =1 ;
                    currencyCompany.idUser = 1;
                    connection.Execute(sqlInsertCurrencyCompany, currencyCompany, transaction: transaction);
                        transaction.Commit();
                    return company;
                }
                catch (SqlException e)
                {
                            transaction.Rollback();
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