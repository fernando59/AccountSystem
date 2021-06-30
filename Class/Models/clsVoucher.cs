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
                var query = "select serieVoucher,dateVoucher,tc.abbreviationCurrency,tv.typeVoucher,gloss,idVoucher,tv.statusVoucher,tv.idCompany,tc.nameCurrency "
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
        public VoucherDTO sendAll(Voucher voucher,List<VoucherDetail> listVoucher)
        {
            
            using (var sqlConnection = new SqlConnection(conexion))
            {
                sqlConnection.Open();

                using(var transaction = sqlConnection.BeginTransaction())
                {
                    try
                    {
                            VoucherDTO voucherDTO = new VoucherDTO();
                       //Validacion de periodos
                        string dateStart = voucher.dateVoucher.ToString("yyyy-MM-dd");
                        string getValidatePeriods = "select * from  tblPeriods tp,tblManagements tm where tm.idCompany = " + voucher.idCompany + " and tm.idManagement = tp.idManagement and '" +dateStart + "' >= tp.startDate and '" + dateStart+ "' <= tp.endDate";
                        int countPeriods = sqlConnection.Query(getValidatePeriods, commandType: System.Data.CommandType.Text, transaction: transaction).Count();
                        if (countPeriods == 0)
                        {

                            voucherDTO.response = new Response { Done = false, Message = "La fecha no pertenece a ningun periodo", Value = 0 };
                            return voucherDTO;
                        }

                        if(voucher.idVoucher == 0)
                        {
                            //Create
                           //getVoucherManagement Apertura
                        string getVoucherManagement = "select tv.idVoucher,tv.gloss,tv.dateVoucher,tv.typeVoucher from tblVoucher tv,tblCompanies tc,tblManagements tm where tv.idCompany = tc.idCompany and tc.idCompany = tm.idCompany" +
                                " and tc.idCompany ="+voucher.idCompany+" and '"+dateStart+"'>= tm.startDate and '"+dateStart+"'<=tm.endDate  and tv.dateVoucher >= tm.startDate and tv.dateVoucher <= tm.endDate and tm.state = 1 and tv.typeVoucher=4 and tv.statusVoucher =1";
                        var voucherList = sqlConnection.Query<Voucher>(getVoucherManagement, commandType: System.Data.CommandType.Text,transaction: transaction).ToList();
                        if (voucherList.Count > 0 && voucher.typeVoucher ==4)
                        {
                            voucherDTO.response = new Response { Done =false,Message="Ya existe un comprobante de apertura",Value=0};
                            return voucherDTO;
                        }

                         voucherDTO.voucherDetail = new List<VoucherDetail>();
                            //Get Currency
                            string getCurrencyMain = "select * from tblCompanyCurrency where idCompany = "+voucher.idCompany+" and active = 1 ";
                            var currency  = sqlConnection.Query<CompanyCurrency>(getCurrencyMain, commandType: System.Data.CommandType.Text, transaction: transaction).FirstOrDefault();

                         string sqlInsert = "insert into tblVoucher (serieVoucher,gloss,dateVoucher,tc,typeVoucher,idUser,idCurrency,idCompany) values " +
                        "(@serieVoucher,@gloss,@dateVoucher,@tc,@typeVoucher,@idUser,@idCurrency,@idCompany)SELECT SCOPE_IDENTITY()";

                        var idRes =sqlConnection.ExecuteScalar(sqlInsert,voucher, transaction: transaction);
                        int idVoucher = Convert.ToInt32(idRes);
                        voucher.idVoucher = idVoucher;
                        voucherDTO.voucher = voucher;
                         string sqlInsertVoucherDetail = "insert into tblVoucherDetail (numberVoucher,gloss,amountOwed,amountAssets,amountOwedAlt,amountAssetsAlt,idUser,idVoucher,idAccount) values " +
                            "(@numberVoucher,@gloss,@amountOwed,@amountAssets,@amountOwedAlt,@amountAssetsAlt,@idUser,"+idVoucher+",@idAccount)";
                                 foreach(VoucherDetail voucherDetail in listVoucher)
                                 {
                                        
                                    if(voucher.idCurrency == currency.idCurrencyMain )
                                    {
                                        voucherDetail.amountAssetsAlt = voucherDetail.amountAssets / (double) voucher.tc;
                                        voucherDetail.amountOwedAlt = voucherDetail.amountOwed / (double) voucher.tc;

                                    }
                                    else
                                    {
                                    var assets = voucherDetail.amountAssets;
                                    var owed = voucherDetail.amountOwed;
                                        //voucherDetail.amountAssetsAlt = voucherDetail.amountAssets * (double) voucher.tc;
                                        //voucherDetail.amountOwedAlt= voucherDetail.amountOwed * (double) voucher.tc;
                                       voucherDetail.amountAssetsAlt = voucherDetail.amountAssets;
                                       voucherDetail.amountOwedAlt= voucherDetail.amountOwed ;

                                    //------------------
                                    voucherDetail.amountAssets = assets * (double)voucher.tc;
                                    voucherDetail.amountOwed = owed * (double)voucher.tc;
                                    }   
                                    voucherDetail.idUser = 1;
                                    voucherDTO.voucherDetail.Add(voucherDetail);
                                    sqlConnection.Execute(sqlInsertVoucherDetail,voucherDetail, transaction: transaction);
                             }
                        transaction.Commit();
                           voucherDTO.response = new Response { Done =true,Message="Creado exitosamente",Value=0};
                           return voucherDTO;


                        }
                        else
                        {
                            //Edit
                            string sqlEditVoucher = "update tblVoucher set gloss=@gloss,dateVoucher=@dateVoucher,tc=@tc,statusVoucher=@statusVoucher,typeVoucher=@typeVoucher,idCurrency=@idCurrency where idVoucher=@idVoucher";
                            var respuesta = sqlConnection.Execute(sqlEditVoucher, voucher,transaction:transaction);
                            voucherDTO.voucher = voucher;
                            //Get List VoucherDetail 
                            string getVoucherDetail = "select * from tblVoucherDetail where idVoucher= " + voucher.idVoucher;
                            List<VoucherDetail> voucherList = sqlConnection.Query<VoucherDetail>(getVoucherDetail, commandType: System.Data.CommandType.Text,transaction: transaction).ToList();
                            //Array para eliminar
                            if(voucherList.Count > 0)
                            {
                              foreach (VoucherDetail voucherDetail1 in voucherList)
                              {
                                string deleteVoucherDetail = "delete tblVoucherDetail where idVoucherDetail ="+voucherDetail1.idVoucherDetail;
                                var resDelete= sqlConnection.Execute(deleteVoucherDetail,transaction:transaction);
                              }

                            }
                             string sqlInsertVoucherDetail = "insert into tblVoucherDetail (numberVoucher,gloss,amountOwed,amountAssets,amountOwedAlt,amountAssetsAlt,idUser,idVoucher,idAccount) values " +
                                    "(@numberVoucher,@gloss,@amountOwed,@amountAssets,@amountOwedAlt,@amountAssetsAlt,"+voucher.idUser+","+voucher.idVoucher+",@idAccount)";
                              sqlConnection.Execute(sqlInsertVoucherDetail,listVoucher, transaction: transaction);

                            voucherDTO.voucherDetail = voucherList;
                            voucherDTO.response = new Response { Done =true,Message="Editado exitosamente",Value=0};
                            transaction.Commit();
                            return voucherDTO;

                        }
                     }catch(Exception e)
                    {
                        transaction.Rollback();
                           VoucherDTO voucherDTO = new VoucherDTO();
                           voucherDTO.response = new Response { Done =false,Message="Error",Value=0};
                           return voucherDTO;
                    }
                }
            }

        }
        public VoucherDTO getEditDataVoucher(int idVoucher)
        {

            using (var sqlConnection = new SqlConnection(conexion))
            {

              VoucherDTO voucherDTO = new VoucherDTO();
             string sqlGetVoucher = " select tv.idVoucher,tv.serieVoucher,tv.gloss,tv.dateVoucher,tv.tc,tv.statusVoucher,tv.typeVoucher,tv.idUser,tv.idCurrency,tv.idCompany,tc.nameCurrency " +
                    " from tblVoucher  tv,tblCurrency tc " +
                    " where tv.idCurrency =tc.idCurrency and  idVoucher =  " + idVoucher;
              voucherDTO.voucher= sqlConnection.Query<Voucher>(sqlGetVoucher, commandType: System.Data.CommandType.Text).FirstOrDefault();

             string sqlGetVoucherDetail = "select tv.idVoucherDetail,concat(ta.codeAccount,'-',ta.nameAccount) as account,tv.gloss,tv.amountOwed,tv.amountAssets,tv.amountOwedAlt,tv.amountAssetsAlt,ta.idAccount,tv.idVoucher " +
                    " from tblVoucherDetail tv,tblAccounts ta" +
                    " where tv.idAccount = ta.idAccount and  tv.idVoucher =" + idVoucher;
              voucherDTO.voucherDetail= sqlConnection.Query<VoucherDetail>(sqlGetVoucherDetail, commandType: System.Data.CommandType.Text).ToList();
              voucherDTO.response = new Response { Done = true, Message = "Get successfully", Value = 1 };
              return voucherDTO;
            }

        }
        public Response deleteVoucher(int idVoucher)
        {

            using (var sqlConnection = new SqlConnection(conexion))
            {
                try
                {
                     string sqlDelete = "update tblVoucher set statusVoucher = 3 where idVoucher = "+idVoucher;
                     sqlConnection.Execute(sqlDelete);
                     return new Response { Done = true, Message = "Anulado Exitosamente", Value = 1 };
                }catch(Exception e)
                {
                    return new Response { Done = false, Message = "Ha ocurrido un error", Value = 1 };
                }
            }
        }




    }
}