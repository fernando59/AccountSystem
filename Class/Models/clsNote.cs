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
    public class clsNote
    {
        private string conexion;
        private clsVoucher _voucher ;
         public clsNote()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
            _voucher = new clsVoucher();
        }
         public List<Note> getNotes(int idCompany,int typeNote)
         {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "select * from tblNotes where idCompany = "+idCompany+" and typeNote = "+typeNote+" order by nroNote desc";
                var companies = sqlConnection.Query<Note>(query, new { idCompany=idCompany},commandType: System.Data.CommandType.Text).ToList();
                return companies ?? new List<Note>();

            }
         }
        public List<Lote> getLoteList(int idArticle,int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "select * from tblLotes where idArticle = "+idArticle+ " and stock >0 and statusLote =1 order by nroLote desc";
                var lotes = sqlConnection.Query<Lote>(query,commandType: System.Data.CommandType.Text).ToList();
                return lotes ?? new List<Lote>();

            }
        }
        public List<Lote> getLoteListTable(int idArticle,int idCompany)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "select * from tblLotes where idArticle = " + idArticle;
                    var lotes = sqlConnection.Query<Lote>(query,commandType: System.Data.CommandType.Text).ToList();

                return lotes ?? new List<Lote>();

            }
        }

          public  int getNroNext(int idCompany,int typeNote)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "SELECT top 1  nroNote from tblNotes where idCompany="+idCompany+" and typeNote= "+typeNote+
                            " ORDER BY  nroNote desc";
               int serieVoucher = sqlConnection.ExecuteScalar<int>(query, commandType: System.Data.CommandType.Text);
                return serieVoucher+1;

            }
        }


        public NoteDTO insertBuyNote(Note note,List<Lote> lotes)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                sqlConnection.Open();
                NoteDTO noteDTO = new NoteDTO();
                using (var transaction = sqlConnection.BeginTransaction())
                {
                    try
                    {
                        note.typeNote = 1;
                        string sqlInsertNote = "insert into tblNotes (nroNote,dateNote,description,total,typeNote,idCompany,idUser,idVoucher) values (@nroNote,@dateNote," +
                            "@description,@total,@typeNote,@idCompany,@idUser,@idVoucher)SELECT SCOPE_IDENTITY()";
                        var idRes =sqlConnection.ExecuteScalar(sqlInsertNote,note, transaction: transaction);
                        int idNote= Convert.ToInt32(idRes);
                        string getNote = "select * from tblNotes where idNote = " + idNote;
                        Note noteGet = sqlConnection.Query<Note>(getNote, commandType: System.Data.CommandType.Text,transaction: transaction).FirstOrDefault();
                        noteDTO.note = noteGet;
                        if(lotes.Count > 0)
                        {
                            foreach(var lote in lotes)
                            {
                                lote.stock = lote.quantityLote;
                                //Get number lote by article

                                string sqlGetNroLote = "select top 1 nroLote from tblLotes where idArticle = "+lote.idArticle+" ORDER BY nroLote desc ";
                                int nroLote= sqlConnection.ExecuteScalar<int>(sqlGetNroLote, commandType: System.Data.CommandType.Text,transaction:transaction)+1;
                                this.insertVoucherBuyNote(note.dateNote);

                                //insert Lote
                                lote.nroLote = nroLote;
                                lote.idNote = idNote;
                                lote.dateEntry = note.dateNote;
                                 string sqlInsertLote = "insert into tblLotes (idArticle,nroLote,idNote,dateEntry,dueDate,quantityLote,price,stock) values (@IdArticle,@nroLote,@idNote,@dateEntry,@dueDate,@quantityLote,@price,@stock)";
                                if(lote.dueDate.ToString() == "1/1/0001 00:00:00")
                                {
                                     sqlInsertLote = "insert into tblLotes (idArticle,nroLote,idNote,dateEntry,dueDate,quantityLote,price,stock) values (@IdArticle,@nroLote,@idNote,@dateEntry,null,@quantityLote,@price,@stock)";
                                }
                                 sqlConnection.Execute(sqlInsertLote,lote, transaction: transaction);
                                //lote.idNote = Convert.ToInt32(idNoteInserted);
                            }
                            noteDTO.lotes = lotes;
                        }

                        //Obtengo la configuracion de las cuentas para generar el comprobante
                        string getConfiguration= "select * from tblConIntegration where idCompany = " +note.idCompany +" and isIntegration = 1" ;
                        ConfigurationIntegration configurationIntegration =sqlConnection.Query<ConfigurationIntegration>(getConfiguration, transaction: transaction).FirstOrDefault();

                        //Obtengo la moneda actual

                        if(configurationIntegration == null)
                        {
                            transaction.Commit();
                            noteDTO.response = new Response { Done =true,Message="Creado exitosamente",Value=0};
                            return noteDTO;
                        }

                            string getCurrencyMain = "select * from tblCompanyCurrency where idCompany = "+note.idCompany+" and active = 1 ";
                            var currency  = sqlConnection.Query<CompanyCurrency>(getCurrencyMain, commandType: System.Data.CommandType.Text, transaction: transaction).FirstOrDefault();


                        Voucher voucher = new Voucher();
                        voucher.dateVoucher = note.dateNote;
                        voucher.gloss = "Compra de Mercaderia";
                        voucher.typeVoucher = 2;
                        voucher.tc = currency.exchange;
                        voucher.idUser = 1;
                        voucher.idCompany = note.idCompany;
                        voucher.idCurrency = currency.idCurrencyMain;
                        voucher.serieVoucher = getIdNext(note.idCompany);
                        List<VoucherDetail> listVoucher = new List<VoucherDetail>();

                        VoucherDTO voucherDTO =_voucher.sendAll(voucher, makeListVoucher(configurationIntegration,note.total,voucher.idVoucher));
                        if (voucherDTO.response.Done == true)
                        {
                            transaction.Commit();
                            noteDTO.lotes = lotes;
                            noteDTO.response = new Response { Done =true,Message="Creado exitosamente",Value=0};
                            return noteDTO;

                        }
                        else
                        {
                            transaction.Rollback();
                            noteDTO.response = new Response { Done =false,Message=voucherDTO.response.Message,Value=0};
                            return noteDTO;
                        }
                    }catch(Exception e)
                    {
                        transaction.Rollback();
                         noteDTO.response = new Response { Done =false,Message="Error",Value=0};
                        return noteDTO;
                    }
                }
            }


        }
        public List<VoucherDetail> makeListVoucher(ConfigurationIntegration configurationIntegration,float total,int idVoucher)
        {


            List<VoucherDetail> listVoucher = new List<VoucherDetail>();
            VoucherDetail compras = new VoucherDetail();
            VoucherDetail creditoFiscal = new VoucherDetail();
            VoucherDetail caja = new VoucherDetail();

            caja.amountAssets =(double) total;
            caja.idAccount = configurationIntegration.idCash;
            caja.gloss = "Compra de Mercaderias";
            caja.idVoucher = idVoucher;
            caja.idUser = 1;

            creditoFiscal.amountOwed = (double)total *(double) 0.13;
            creditoFiscal.gloss = "Compra de Mercaderias";
            creditoFiscal.idVoucher = idVoucher;
            creditoFiscal.idUser = 1;
            creditoFiscal.idAccount = configurationIntegration.idFiscalCredit;


            compras.amountOwed = (double)total - creditoFiscal.amountOwed;
            compras.gloss = "Compra de Mercaderias";
            compras.idVoucher = idVoucher;
            compras.idUser = 1;
            compras.idAccount = configurationIntegration.idPurchases;

            listVoucher.Add(compras);
            listVoucher.Add(creditoFiscal);
            listVoucher.Add(caja);
            return listVoucher;

        }
        public int  insertVoucherBuyNote(DateTime dateInsert)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                sqlConnection.Open();
                using (var transaction = sqlConnection.BeginTransaction())
                {
                    try
                    {
                        string sqlInsertVoucher = "insert into tblVoucher (serieVoucher,gloss,dateVoucher,tc,typeVoucher,idUser,idCompany) values " +
                            "(@serieVoucher,'Compra de Mercaderias',"+dateInsert+",1,1,1,1)";

                        transaction.Commit();
                        return 1;

                    }catch(Exception e)
                    {
                        transaction.Rollback();
                        return 0;
                    }
                }
            }
        }

      public DetailDTO insertSaleNote(Note note,List<Detail> details)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                sqlConnection.Open();
                DetailDTO detailDTO = new DetailDTO();
                using (var transaction = sqlConnection.BeginTransaction())
                {
                    try
                    {
                        note.typeNote = 2;
                        string sqlInsertNote = "insert into tblNotes (nroNote,dateNote,description,total,typeNote,idCompany,idUser,idVoucher) values (@nroNote,@dateNote," +
                            "@description,@total,@typeNote,@idCompany,@idUser,@idVoucher)SELECT SCOPE_IDENTITY()";
                        var idRes =sqlConnection.ExecuteScalar(sqlInsertNote,note, transaction: transaction);
                        int idNote= Convert.ToInt32(idRes);
                        string getNote = "select * from tblNotes where idNote = " + idNote;
                        Note noteGet = sqlConnection.Query<Note>(getNote, commandType: System.Data.CommandType.Text,transaction: transaction).FirstOrDefault();
                        detailDTO.note = noteGet;
                        if(details.Count > 0)
                        {
                            var dateEntry = DateTime.Now;
                            foreach(var detail in details)
                            {
                                detail.dateEntry = dateEntry;
                                detail.idNote = idNote;
                                detail.idVoucher = 1;
                                 string sqlInsertLote = "insert into tblDetail (idArticle,nroLote,idNote,quantityDetail,priceSale,idVoucher)" +
                                    " values (@IdArticle,@nroLote,@idNote,@quantityDetail,@priceSale,@idVoucher)";
                                 sqlConnection.Execute(sqlInsertLote,detail, transaction: transaction);
                                ////Edit Article
                                string updateArticle = "update tblArticles set quantity = quantity -" + detail.quantityDetail + " where idArticle = " + detail.idArticle;
                                sqlConnection.Execute(updateArticle, transaction: transaction);
                            }
                            detailDTO.details= details;
                        }
                        //Obtengo la configuracion de las cuentas para generar el comprobante
                        string getConfiguration= "select * from tblConIntegration where idCompany = " +note.idCompany +" and isIntegration = 1" ;
                        ConfigurationIntegration configurationIntegration =sqlConnection.Query<ConfigurationIntegration>(getConfiguration, transaction: transaction).FirstOrDefault();

                        //Obtengo la moneda actual
                            string getCurrencyMain = "select * from tblCompanyCurrency where idCompany = "+note.idCompany+" and active = 1 ";
                            var currency  = sqlConnection.Query<CompanyCurrency>(getCurrencyMain, commandType: System.Data.CommandType.Text, transaction: transaction).FirstOrDefault();

                            if(configurationIntegration == null)
                            {
                                transaction.Commit();
                                detailDTO.response = new Response { Done =true,Message="Creado exitosamente",Value=0};
                                return detailDTO;
                            }
                            Voucher voucher = new Voucher();
                            voucher.dateVoucher = note.dateNote;
                            voucher.gloss = "Venta de Mercaderias";
                            voucher.typeVoucher = 1;
                            voucher.tc = currency.exchange;
                            voucher.idUser = 1;
                            voucher.idCompany = note.idCompany;
                            voucher.idCurrency = currency.idCurrencyMain;
                            voucher.serieVoucher = getIdNext(note.idCompany);
                            List<VoucherDetail> listVoucher = new List<VoucherDetail>();

                            VoucherDTO voucherDTO =_voucher.sendAll(voucher, makeListVoucherSale(configurationIntegration,note.total,voucher.idVoucher));
                            if (voucherDTO.response.Done == true)
                            {
                                transaction.Commit();
                                detailDTO.details = details;
                                detailDTO.response = new Response { Done =true,Message="Creado exitosamente",Value=0};
                                return detailDTO;

                            }
                            else
                            {
                                transaction.Rollback();
                                detailDTO.response = new Response { Done =false,Message=voucherDTO.response.Message,Value=0};
                                return detailDTO;
                            }
                    }catch(Exception e)
                    {
                        transaction.Rollback();
                         detailDTO.response = new Response { Done =false,Message="Error",Value=0};
                        return detailDTO;
                    }
                }
            }


        }
        public List<VoucherDetail> makeListVoucherSale(ConfigurationIntegration configurationIntegration,float total,int idVoucher)
        {


            List<VoucherDetail> listVoucher = new List<VoucherDetail>();
            VoucherDetail caja = new VoucherDetail();
            VoucherDetail it = new VoucherDetail();
            VoucherDetail ventas = new VoucherDetail();
            VoucherDetail debitoFiscal = new VoucherDetail();
            VoucherDetail itxPagar = new VoucherDetail();
            string gloss = "Venta de Mercaderias ";


            caja.amountOwed =(double) total;
            caja.idAccount = configurationIntegration.idCash;
            caja.gloss = gloss;
            caja.idVoucher = idVoucher;
            caja.idUser = 1;


            it.amountOwed = (double)total * (double)0.03;
            it.gloss = gloss;
            it.idVoucher = idVoucher;
            it.idUser = 1;
            it.idAccount = configurationIntegration.idIt;


            debitoFiscal.amountAssets = (double)total *(double) 0.13;
            debitoFiscal.gloss = gloss;
            debitoFiscal.idVoucher = idVoucher;
            debitoFiscal.idUser = 1;
            debitoFiscal.idAccount = configurationIntegration.idFiscalDebit;

            ventas.amountAssets = caja.amountOwed - debitoFiscal.amountAssets;
            ventas.gloss = gloss;
            ventas.idVoucher = idVoucher;
            ventas.idUser = 1;
            ventas.idAccount = configurationIntegration.idSales;


            itxPagar.amountAssets = (double)total * (double)0.03;
            itxPagar.gloss = gloss;
            itxPagar.idVoucher = idVoucher;
            itxPagar.idUser = 1;
            itxPagar.idAccount = configurationIntegration.idItToPay;


          
            listVoucher.Add(caja);
            listVoucher.Add(it);
            listVoucher.Add(ventas);
            listVoucher.Add(debitoFiscal);
            listVoucher.Add(itxPagar);
            return listVoucher;

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


       public NoteDTO getEditDataNote(int idNote)
       {

            using (var sqlConnection = new SqlConnection(conexion))
            {

              NoteDTO noteDTO = new NoteDTO();
                string sqlGetVoucher = "select * from tblNotes where idNote =" + idNote;
              noteDTO.note= sqlConnection.Query<Note>(sqlGetVoucher, commandType: System.Data.CommandType.Text).FirstOrDefault();
                if(noteDTO.note.typeNote == 2){

                    string sqlGetDetail = "select tl.idArticle,tl.idNote,tl.nroLote,tl.quantityDetail,tl.priceSale,ta.nameArticle as article,(tl.quantityDetail*tl.priceSale) as subTotal " +
                    " from tblDetail tl,tblArticles ta " +
                    " where tl.idArticle = ta.idArticle and tl.idNote = " + idNote;
                    noteDTO.details= sqlConnection.Query<Detail>(sqlGetDetail, commandType: System.Data.CommandType.Text).ToList();
                    noteDTO.response = new Response { Done = true, Message = "Get successfully", Value = 1 };
                    return noteDTO;
                }
                else
                {
                    string sqlGetVoucherDetail = "select tl.idArticle,tl.idNote,tl.nroLote,tl.dateEntry,tl.dueDate,tl.quantityLote,tl.price,tl.stock,ta.nameArticle as article,(tl.quantityLote*tl.price) as subTotal " +
                    " from tblLotes tl,tblArticles ta " +
                    " where tl.idArticle = ta.idArticle and tl.idNote = " + idNote;
                    noteDTO.lotes= sqlConnection.Query<Lote>(sqlGetVoucherDetail, commandType: System.Data.CommandType.Text).ToList();
                    noteDTO.response = new Response { Done = true, Message = "Get successfully", Value = 1 };
                    return noteDTO;
                }

            }

       }
       public Response deleteNote(int idNote, List<Lote> lotes,List<Detail>details)
       {
            using (var sqlConnection = new SqlConnection(conexion))
            {

                sqlConnection.Open();
                using (var transaction = sqlConnection.BeginTransaction())
                {

                try
                {
                     string sqlDelete = "update tblNotes set statusNote=2 where idNote= "+idNote;
                     sqlConnection.Execute(sqlDelete,transaction:transaction);
                        string getNote = "select * from tblNotes where idNote = " + idNote;
                        Note note =sqlConnection.Query<Note>(getNote, transaction: transaction).FirstOrDefault();
                        if(note.typeNote == 1)
                        {
                            foreach(var lote in lotes)
                            {
                                if(lote.quantityLote != lote.stock)
                                {
                                    transaction.Rollback();
                                    return new Response { Done = false, Message = "Ya se realizo una venta con un lote", Value = 1 };
                                }
                                string sqlDeleteLote = "update tblLotes set statusLote=2 where idNote= "+idNote+" and nroLote = "+lote.nroLote+" and idArticle = "+lote.idArticle;
                                sqlConnection.Execute(sqlDeleteLote,transaction:transaction);

                                //update article
                                 // string updateArticle = "update tblArticles set quantity = quantity -" + lote.quantityLote + " where idArticle = " + lote.idArticle;
                                 //sqlConnection.Execute(updateArticle, transaction: transaction);

                            }
                                transaction.Commit();
                             return new Response { Done = true, Message = "Anulado Exitosamente", Value = 1 };
                        }
                        else
                        {

                            foreach(var detail in details)
                            {
                                string sqlDeleteDetail= "update tblDetail set statusDetail=2 where idNote= "+idNote+" and nroLote = "+detail.nroLote+" and idArticle = "+detail.idArticle;
                                sqlConnection.Execute(sqlDeleteDetail,transaction:transaction);
                                //update articles
                                string updateArticle = "update tblArticles set quantity = quantity +" + detail.quantityDetail + " where idArticle = " + detail.idArticle;
                                 sqlConnection.Execute(updateArticle, transaction: transaction);
                            }

                             transaction.Commit();
                             return new Response { Done = true, Message = "Anulado Exitosamente", Value = 1 };

                        }
                }catch(Exception e)
                {
                        transaction.Rollback();
                    return new Response { Done = false, Message = "Ha ocurrido un error", Value = 1 };
                }
                }
            }
       }
       }



    }
