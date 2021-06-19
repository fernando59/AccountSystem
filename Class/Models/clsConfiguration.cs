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
    public class clsConfiguration
    {
        private string conexion;
        public clsConfiguration()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
        public Response insertConfiguration(ConfigurationIntegration configurationIntegration)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                try
                {
                    var queryVerify = "SELECT  idCompany from tblConIntegration where idCompany=" + configurationIntegration.idCompany;
                    int res = sqlConnection.ExecuteScalar<int>(queryVerify, commandType: System.Data.CommandType.Text);
                    if (res == 0)
                    {
                        var query = "insert into tblConIntegration (idCash,idFiscalCredit,idFiscalDebit,idPurchases,idSales,idIt,idItToPay,idCompany,isIntegration)" +
                        " values (@idCash,@idFiscalCredit,@idFiscalDebit,@idPurchases,@idSales,@idIt,@idItToPay,@idCompany,@isIntegration)";
                        sqlConnection.Execute(query, configurationIntegration);
                        return new Response { Done = true, Message = "Agregado Exitosamente ", Value = 1 };
                    }
                    else
                    {
                        //Edit
                        var query = "update tblConIntegration set idCash=@idCash,idFiscalCredit=@idFiscalCredit,idFiscalDebit=@idFiscalDebit,idPurchases=@idPurchases," +
                            "idSales=@idSales,idIt=@idIt,idItToPay=@idItToPay,isIntegration=@isIntegration where idCompany = @idCompany";
                        sqlConnection.Execute(query, configurationIntegration);
                        return new Response { Done = true, Message = "Editado exitosamente", Value = 1 };
                    }

                } catch (Exception e)
                {
                    return new Response { Done = false, Message = e.Message, Value = 0 };
                }
            }
        }

        public ConfigurationDTO checkIfExist(int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                ConfigurationDTO configurationDTO = new ConfigurationDTO();

                try
                {
                    var queryVerify = "SELECT  * from tblConIntegration where idCompany=" + idCompany;
                    ConfigurationIntegration conf = sqlConnection.Query<ConfigurationIntegration>(queryVerify, commandType: System.Data.CommandType.Text).First();
                    if (conf ==null)
                    {
                        configurationDTO.response= new Response { Done = false, Message = "Error", Value = 0 };
                        return configurationDTO;
                    }
                    else
                    {
                        configurationDTO.response = new Response { Done = true, Message = "Existe", Value = 1 };
                        configurationDTO.configuration = conf;
                        return configurationDTO;
                    }

                }
                catch (Exception e)
                {
                    configurationDTO.response = new Response { Done = false, Message = e.Message, Value = 0 };
                    return configurationDTO;
                }
            }


        }    
    }
}