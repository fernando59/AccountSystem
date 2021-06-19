using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnConfiguration
    {

          private clsConfiguration classConfiguration = new clsConfiguration();
          public Response insertConfiguration(ConfigurationIntegration configurationIntegration)
          {
            return classConfiguration.insertConfiguration(configurationIntegration);
          }

          public ConfigurationDTO checkIfExist(int idCompany)
          {
            return classConfiguration.checkIfExist(idCompany);
          }

    }
}