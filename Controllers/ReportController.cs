using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccountingSystem.Controllers
{
    public class ReportController : Controller
    {
        // GET: Report
        public ActionResult Index()
        {
            return View();
        }



        public ActionResult CompanyReport()
        {
            ReportViewer reportViewer = new ReportViewer();
            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"Reports\CompanyReport.rdlc";
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("DataSetReport", "algo"));
            ViewBag.ReportViewer = reportViewer;
            return View();
        }
        public ActionResult ManagementReport()
        {
            return View();
        }

        public ActionResult PeriodReport()
        {
            return View();
        }
        public ActionResult AccountReport()
        {
            return View();
        }
    }
}