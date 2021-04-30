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
        public class bsnAccount
        {

            private clsCompanyCurrency classAccount = new clsCompanyCurrency();
            //public List<CompanyAccount> getAccounts(int idUser,int idCompany)
            //{
            //   return classAccount.getAccounts(idUser,idCompany);
            //}
            public CompanyCurrency insertAccount(CompanyCurrency companyCurrency)
            {
                return classAccount.insertCompanyCurrency(companyCurrency);
            }

        }
    }
}