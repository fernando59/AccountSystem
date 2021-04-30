using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnPeriod
    {
        private clsPeriod clsPeriod = new clsPeriod();
        

        public List<Period> getPeriods(int idManagement)
        {
            return clsPeriod.getPeriods(idManagement);
        }
         public Response insertPeriod(Period period)
        {
            return clsPeriod.insertPeriod(period);
        }
        public Response deletePeriod(int idPeriod)
        {
            return clsPeriod.deletePeriod(idPeriod);
        }
        public Response updatePeriod(Period period)
        {
            return clsPeriod.updateperiod(period);
        }



    }
}