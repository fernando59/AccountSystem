using AccountingSystem.Class.Bussines;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
//using Microsoft.Reporting.WebForms;
namespace AccountingSystem.Controllers
{
    public class CompanyController : Controller
    {
        private bsnCompany bsnCompany = new bsnCompany();
        // GET: Company
        public ActionResult Index()
        {
            //Session["company"] = null;

           var user = Session["user"];
            var h = Session["h"]; 
            return View();
        }
        public JsonResult insertCompany(Company company)
        {
           var user = (User)Session["user"];
            company.idUser = 1;//user.idUser;
            var companyResponse = bsnCompany.insertCompany(company);
            company.idCompany = companyResponse.idCompany;
                Session["company"] = company;

            return Json(new { data = companyResponse }, JsonRequestBehavior.AllowGet);



        }
        public JsonResult updateCompany(Company company)
        {
            var companyResponse = bsnCompany.updateCompany(company);
            return Json(new { data = companyResponse }, JsonRequestBehavior.AllowGet);

        }
        public JsonResult getCompanies()
        {
            var listCompanies = bsnCompany.getCompanies();
            return Json(new { data = listCompanies }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult deleteCompany(int idCompany)
        {
            var companyResponse = bsnCompany.deleteCompany(idCompany);
            return Json(new { data = companyResponse }, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult goToManagement(Company company)
        {
                Session["company"] = company;
            Session["as"] = "as";
            if (Session["company"] != null)
            {

                return Json(new { data = true },JsonRequestBehavior.AllowGet);
            }
            else
            {

                return Json(new { data = false},JsonRequestBehavior.AllowGet);
            }
        }

        //public ActionResult Report(/*int idCompany*/)
        //{
        //    string id = "pdf";
        //    LocalReport localReport = new LocalReport();
        //    string path = Path.Combine(Server.MapPath("~/Reports"), "Report1.rdlc");
        //    var datos = bsnCompany.getCompanies();
        //    ReportDataSource report1 = new ReportDataSource("DataSet1", datos);

        //    localReport.ReportPath = path;
        //    localReport.DataSources.Add(report1);
        //    localReport.EnableExternalImages = true;

        //    string reportType = id;
        //    string mimeType;
        //    string encoding;
        //    string fileNameExtension;
        //    string deviceInfo =
        //    "<DeviceInfo>" +
        //    " <OutputFormat>" + id + "</OutputFormat>" +
        //    " <PageWidth>8.27in</PageWidth>" +
        //    " <PageHeight>11in</PageHeight>" +
        //    " <MarginTop>0in</MarginTop>" +
        //    " <MarginLeft>0in</MarginLeft>" +
        //    " <MarginRight>0in</MarginRight>" +
        //    " <MarginBottom>0in</MarginBottom>" +
        //    "</DeviceInfo>";
        //    Warning[] warnings;
        //    string[] streams;
        //    byte[] renderedBytes = localReport.Render(
        //    reportType,
        //    deviceInfo,
        //    out mimeType,
        //    out encoding,
        //    out fileNameExtension,
        //    out streams,
        //    out warnings);

        //    var filePath = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Content/Reports/Company"), ("Company#.pdf"));
        //    System.IO.File.WriteAllBytes(filePath, renderedBytes);
        //    return File(renderedBytes, mimeType);
        //}
    }
}