using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnCompany
    {
        private clsCompany classCompany = new clsCompany();
        public Company insertCompany(Company company)
        {
            return classCompany.insertCompany(company);
        }
        public Response updateCompany(Company company)
        {
            return classCompany.updateCompany(company);
        }
        public List<Company> getCompanies()
        {
            return classCompany.getCompanies();
        }

        public Response deleteCompany(int idCompany)
        {
            return classCompany.deleteCompany(idCompany);
        }
    }
}