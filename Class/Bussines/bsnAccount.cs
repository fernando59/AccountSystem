using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnAccount
    {

     private clsAccount classAccount = new clsAccount();
    public List<Account> getAccounts(int idUser,int idCompany)
    {
       return classAccount.getAccounts(idUser,idCompany);
    }
    public Account insertAccount(Account account)
    {
       return classAccount.inserAccount(account);
    }
    public Response updateAccount(Account account)
        {
            return classAccount.updateAccount(account);
        }

     public Response deleteAccount(int idAccount)
    {
      return classAccount.deleteAccount(idAccount);
    }




    }
}