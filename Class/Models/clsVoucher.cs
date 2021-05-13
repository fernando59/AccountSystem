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
    public class clsVoucher
    {
          private string conexion;
         public clsVoucher()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }
         public List<Voucher> getVoucher(int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "select serieVoucher,dateVoucher,tc.abbreviationCurrency,tv.typeVoucher,gloss,idVoucher"
                            + " from tblVoucher tv,tblCurrency tc" +
                            " where tv.idCurrency = tc.idCurrency and tv.idCompany =" + idCompany+
                            " order by serieVoucher desc,dateVoucher desc";
                var currencies= sqlConnection.Query<Voucher>(query,commandType: System.Data.CommandType.Text).ToList();
                return currencies?? new List<Voucher>();

            }
        }
        public  int getIdNext(int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "SELECT top 1  serieVoucher from tblVoucher where idCompany="+idCompany+
                            "ORDER BY  serieVoucher desc";
               int serieVoucher = sqlConnection.ExecuteScalar<int>(query, commandType: System.Data.CommandType.Text);
                return serieVoucher+1;

            }
        }
      public  decimal getExchange(int idCompany,int idUser)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                string query= "select exchange from tblCompanyCurrency where idCompany ="+idCompany+" and idUser="+idUser+" and active =1";
               decimal serieVoucher = sqlConnection.ExecuteScalar<decimal>(query, commandType: System.Data.CommandType.Text);
                return serieVoucher;

            }
        }
          public List<Account> getAccountList(int idCompany,int idUser)
        {

            using (var sqlConnection = new SqlConnection(conexion))
            {
                string query= "select * from tblAccounts where idCompany = "+idCompany+" and idUser = "+idUser+" and typeAccount=2";
               var account = sqlConnection.Query<Account>(query, commandType: System.Data.CommandType.Text).ToList();
                return account;
            }

        }


        public List<Currency> getCurrencyDetailCompany(int idCompany,int idUser)
        {

            using (var sqlConnection = new SqlConnection(conexion))
            {
                string queryGetCompanyCurrency = "select * from tblCompanyCurrency where idCompany ="+idCompany+" and idUser="+idUser+" and active =1";
                CompanyCurrency companyCurrency = new CompanyCurrency();
                companyCurrency=  sqlConnection.Query<CompanyCurrency>(queryGetCompanyCurrency, commandType: System.Data.CommandType.Text).First();
                var query = "select * from tblCurrency where  idCurrency ="+companyCurrency.idCurrencyAltern+" or idCurrency ="+companyCurrency.idCurrencyMain;
               var currency = sqlConnection.Query<Currency>(query, commandType: System.Data.CommandType.Text).ToList();
                return currency;
            }

        }
        public Response sendAll(Voucher voucher,List<VoucherDetail> listVoucher)
        {
            
            using (var sqlConnection = new SqlConnection(conexion))
            {
                sqlConnection.Open();

                using(var transaction = sqlConnection.BeginTransaction())
                {
                    try
                    {

                        
                        //getVoucherManagement Apertura
                        string getVoucherManagement = "select tv.idVoucher,tv.gloss,tv.dateVoucher,tv.typeVoucher from tblVoucher tv,tblCompanies tc,tblManagements tm where tv.idCompany = tc.idCompany and tc.idCompany = tm.idCompany and tc.idCompany ="+voucher.idCompany+" and tv.dateVoucher >= tm.startDate and tv.dateVoucher <= tm.endDate and tm.state = 1 and tv.typeVoucher=4";
                        var voucherList = sqlConnection.Query<Voucher>(getVoucherManagement, commandType: System.Data.CommandType.Text,transaction: transaction).ToList();
                        if (voucherList.Count > 0 && voucher.typeVoucher ==4)
                        {
                            return new Response{ Done = false, Message = "Ya existe un comprobante de apertura", Value = 0 };
                        }

                        string sqlVerifyPeriod = "select tp.idPeriod from tblPeriods tp,tblManagements tm where tm.idCompany="+voucher.idCompany+" and tp.idManagement = tm.idManagement";
                        int idPeriodExist = sqlConnection.ExecuteScalar<int>(sqlVerifyPeriod, commandType: System.Data.CommandType.Text,transaction:transaction);

                        //Get managements actives 
                        //string sqlGetManagement = "select * from tblManagements where idCompany ="+voucher.idCompany+" and state =1";
                        //var management = sqlConnection.Query<Management>(sqlGetManagement, commandType: System.Data.CommandType.Text).ToList();
                        






                        string sqlInsert = "insert into tblVoucher (serieVoucher,gloss,dateVoucher,tc,typeVoucher,idUser,idCurrency,idCompany) values " +
                        "(@serieVoucher,@gloss,@dateVoucher,@tc,@typeVoucher,@idUser,@idCurrency,@idCompany)SELECT SCOPE_IDENTITY()";

                        var idRes =sqlConnection.ExecuteScalar(sqlInsert,voucher, transaction: transaction);
                        int idVoucher = Convert.ToInt32(idRes);
                        string sqlInsertVoucherDetail = "insert into tblVoucherDetail (numberVoucher,gloss,amountOwed,amountAssets,amountOwedAlt,amountAssetsAlt,idUser,idVoucher,idAccount) values " +
                            "(@numberVoucher,@gloss,@amountOwed,@amountAssets,@amountOwedAlt,@amountAssetsAlt,@idUser,"+idVoucher+",@idAccount)";
                        foreach(VoucherDetail voucherDetail in listVoucher)
                        {
                            voucherDetail.idUser = 1;
                            sqlConnection.Execute(sqlInsertVoucherDetail,voucherDetail, transaction: transaction);
                        }
                        transaction.Commit();
                        return new Response{ Done = true, Message = "fdsa", Value = 0 };
                    }catch(Exception e)
                    {
                        transaction.Rollback();
                        return new Response{ Done = false, Message = "fdsa", Value = 0 };
                    }
                }
            }

        }




    }
}