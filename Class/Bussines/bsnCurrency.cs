using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnCurrency
    {
        private clsCurrency classCurrency = new clsCurrency();
        public List<Currency> getCurrency()
        {
            return classCurrency.getCurrency();
        }
        public List<Currency> getCurrencyWithOutMain(int idCompany,int idUser)
        {
            return classCurrency.getCurrencyWithOutMain(idCompany,idUser);
        }

        public Response insertCurrency(Currency currency)
        {
            return classCurrency.insertCurrency(currency);
        }
    }
}