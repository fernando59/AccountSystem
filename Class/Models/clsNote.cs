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
        public List<Lote> getLoteList(int idArticle)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var query = "select * from tblLotes where idArticle = "+idArticle;
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
                        Voucher voucher = new Voucher();
                        voucher.dateVoucher = note.dateNote;
                        voucher.gloss = "Compra de Mercaderia";
                        voucher.typeVoucher = 2;
                        voucher.tc = 1;
                        voucher.idUser = 1;
                        voucher.idCompany = note.idCompany;
                        voucher.idCurrency = 2;
                        voucher.serieVoucher = 50;
                        List<VoucherDetail> listVoucher = new List<VoucherDetail>();

                        VoucherDTO voucherDTO =_voucher.sendAll(voucher, makeListVoucher());
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
        public List<VoucherDetail> makeListVoucher()
        {
            List<VoucherDetail> listVoucher = new List<VoucherDetail>();
            VoucherDetail voucher1 = new VoucherDetail();
            //voucher1.
            //listVoucher.Add()
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
                        note.typeNote = 1;
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
                                //Get number lote by article

                                string sqlGetNroLote = "select top 1 nroLote from tblDetails where idArticle = "+detail.idArticle+" ORDER BY nroLote desc ";
                                int nroLote= sqlConnection.ExecuteScalar<int>(sqlGetNroLote, commandType: System.Data.CommandType.Text,transaction:transaction)+1;

                                //insert Lote
                                detail.nroLote = nroLote;
                                detail.idNote = idNote;
                                 string sqlInsertLote = "insert into tblLotes (idArticle,nroLote,idNote,dateEntry,dueDate,quantityLote,price,stock) values (@IdArticle,@nroLote,@idNote,@dateEntry,@dueDate,@quantityLote,@price,@stock)";
                                 sqlConnection.Execute(sqlInsertLote,detail, transaction: transaction);
                                //lote.idNote = Convert.ToInt32(idNoteInserted);
                            }
                            detailDTO.details= details;
                        }
                        transaction.Commit();
                        detailDTO.details = details;
                        detailDTO.response = new Response { Done =true,Message="Creado exitosamente",Value=0};
                        return detailDTO;
                    }catch(Exception e)
                    {
                        transaction.Rollback();
                         detailDTO.response = new Response { Done =false,Message="Error",Value=0};
                        return detailDTO;
                    }
                }
            }


        }

       public NoteDTO getEditDataNote(int idNote)
       {

            using (var sqlConnection = new SqlConnection(conexion))
            {

              NoteDTO noteDTO = new NoteDTO();
                string sqlGetVoucher = "select * from tblNotes where idNote =" + idNote;
              noteDTO.note= sqlConnection.Query<Note>(sqlGetVoucher, commandType: System.Data.CommandType.Text).FirstOrDefault();

                string sqlGetVoucherDetail = "select tl.idArticle,tl.idNote,tl.nroLote,tl.dateEntry,tl.dueDate,tl.quantityLote,tl.price,tl.stock,ta.nameArticle as article,(tl.quantityLote*tl.price) as subTotal " +
                    " from tblLotes tl,tblArticles ta " +
                    " where tl.idArticle = ta.idArticle and tl.idNote = " + idNote;
              noteDTO.lotes= sqlConnection.Query<Lote>(sqlGetVoucherDetail, commandType: System.Data.CommandType.Text).ToList();
              noteDTO.response = new Response { Done = true, Message = "Get successfully", Value = 1 };
              return noteDTO;
            }

       }
       public Response deleteNote(int idNote, List<Lote> lotes)
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
                    foreach(var lote in lotes)
                    {
                        string sqlDeleteLote = "update tblLotes set statusLote=2 where idNote= "+idNote+" and nroLote = "+lote.nroLote+" and idArticle = "+lote.idArticle;
                        sqlConnection.Execute(sqlDeleteLote,transaction:transaction);
                    }

                        transaction.Commit();
                     return new Response { Done = true, Message = "Anulado Exitosamente", Value = 1 };
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