using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnManagement
    {

        private clsManagement clsManagement = new clsManagement();

        public List<Management> getManagements(int idCompany)
        {
            return clsManagement.getManagements(idCompany);
        }
        public Response updateManagement(Management management)
        {
            return clsManagement.updateManagement(management);
        }


        public Response insertManagement(Management management)
        {
            return clsManagement.insertManagement(management);
        }
        public Response deleteManagement(int idManagement)
        {
            return clsManagement.deleteManagement(idManagement);
        }


    }
}