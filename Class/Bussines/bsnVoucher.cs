using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnVoucher
    {
         private clsVoucher  clsVoucher= new clsVoucher();
        public List<Voucher> getVoucher(int idCompany)
        {
            return clsVoucher.getVoucher(idCompany);
        }
        public Response deleteVoucher(int idVoucher)
        {
            return clsVoucher.deleteVoucher(idVoucher);
        }
        public int getIdNext(int idCompany)
        {
            return clsVoucher.getIdNext(idCompany);
        }
        public decimal getExchange(int idCompany,int idUser)
        {
            return clsVoucher.getExchange(idCompany,idUser);
        }
         public List<Currency> getCurrencyDetailCompany(int idCompany,int idUser)
        {
            return clsVoucher.getCurrencyDetailCompany(idCompany,idUser);
        }
         public List<Account> getAccountList(int idCompany,int idUser)
        {
            return clsVoucher.getAccountList(idCompany,idUser);
        }

        public VoucherDTO sendAll(Voucher voucher,List<VoucherDetail> voucherDetails)
        {
            return clsVoucher.sendAll(voucher,voucherDetails);
        }

        public VoucherDTO getEditDataVoucher(int idVoucher)
        {
            return clsVoucher.getEditDataVoucher(idVoucher);
        }




    }
}