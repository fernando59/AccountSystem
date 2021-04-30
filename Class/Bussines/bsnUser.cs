using AccountingSystem.Class.Global;
using AccountingSystem.Class.Models;
using AccountingSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Class.Bussines
{
    public class bsnUser
    {
        private clsUsers classUser = new clsUsers();
        public List<User> getUsers()
        {
            return classUser.getUsers();
        }
        public User getUser(int idUser)
        {
            return classUser.getUser(idUser);
        }
        public Response insertUser(User user)
        {
            return classUser.insertUser(user);
        }
        public Response verifyUser(string userAccount,string passwordAccount)
        {
            return classUser.verifyUser(userAccount, passwordAccount);
        }
    }
}