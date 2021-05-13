using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class VoucherController : Controller
    {
        // GET: Voucher

        private bsnVoucher bsnVoucher= new bsnVoucher();
        private bsnCompanyCurrency bsnCompanyCurrency= new bsnCompanyCurrency();
        public ActionResult Index()
        {

            return View();
        }

        public ActionResult List()
        {

            return View();
        }
        public JsonResult getVoucher()
        {
            var company = (Company)Session["company"];
            var listVoucher = bsnVoucher.getVoucher(company.idCompany);
            return Json(new { data = listVoucher}, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getMainCurrency()
        {
            var company = (Company)Session["company"];
            var currency = bsnCompanyCurrency.getCurrency(company.idCompany, 1);
            var idVoucherNext = bsnVoucher.getIdNext(company.idCompany);
            //var currencies =  bsnCurrency.getCurrencyForVoucher(company.idCompany,1)
            var exchange = bsnVoucher.getExchange(company.idCompany,1);
            var currencies = bsnVoucher.getCurrencyDetailCompany(company.idCompany, 1);
            var accounts = bsnVoucher.getAccountList(company.idCompany, 1);
            return Json(new { currency,idVoucherNext,exchange,currencies,accounts}, JsonRequestBehavior.AllowGet);
        }
         public JsonResult SendAll(Voucher voucher,List<VoucherDetail> listVoucherDetail)
        {
            VoucherDTO voucherDTO = new VoucherDTO();

            var company = (Company)Session["company"];
            voucher.idCompany = company.idCompany;
            voucher.idUser = 1;
            var res = bsnVoucher.sendAll(voucher,listVoucherDetail);
            return Json(new { data = res}, JsonRequestBehavior.AllowGet);
        }




    }
}