using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnCompanyCurrency
    {

            private clsCompanyCurrency classCompanyCurrency = new clsCompanyCurrency();
            public CompanyCurrency insertAccount(CompanyCurrency companyCurrency)
            {
                return classCompanyCurrency.insertCompanyCurrency(companyCurrency);
            }
          public List<CompanyCurrency> getCompanyCurrency(int idCompany,int idUser)
          {
            return classCompanyCurrency.getCompanyCurrency(idCompany,idUser);
          }
          public string getCurrency(int idCompany,int idUser)
          {
            return classCompanyCurrency.getCurrency(idCompany,idUser);
          }
          public Response addCompanyCurrency(CompanyCurrency companyCurrency)
          {
            return classCompanyCurrency.addCompanyCurrency(companyCurrency);
          }



    }
}