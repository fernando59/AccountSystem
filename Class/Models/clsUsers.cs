using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dapper;
using System.Configuration;
using AccountingSystem.Models;
using System.Data.SqlClient;
using AccountingSystem.Class.Global;

namespace AccountingSystem.Class.Models
{
    public class clsUsers
    {
        private string conexion;

        public clsUsers()
        {
            conexion = ConfigurationManager.ConnectionStrings["ConexionBD"].ConnectionString;
        }

        public List<User> getUsers()
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var users = sqlConnection.Query<User>("Select * from tblUsers", commandType: System.Data.CommandType.Text).ToList();
                return users ?? new List<User>();

            }
        }
        public User getUser(int idUser)
        {
            using (var sqlConnection = new SqlConnection(conexion))
            {
                var user = sqlConnection.Query<User>("select * from tblUsers where idUser= @idUser", new { idUser = idUser }, commandType: System.Data.CommandType.Text).FirstOrDefault();
                return user ?? new User();
            }
        }
        public Response insertUser(User user)
        {
            string sql = "insert into tblUsers (nameUser,userAccount,passwordAccount,typeAccount) values(@nameUser,@userAccount,@passwordAccount,@typeAccount) ";
            using (var connection = new SqlConnection(conexion))
            {
                user.passwordAccount = PassEncript.Encrypt(user.passwordAccount);
                try
                {
                    int respuesta = connection.Query<int>(sql, user, commandType: System.Data.CommandType.Text).FirstOrDefault();
                    return new Response { Done = true, Message = "Successfully inserted", Value = 1 };
                }
                catch (Exception e)
                {
                    if (e.InnerException != null && e.InnerException.InnerException != null)
                    {
                        return new Response
                        {
                            Done = false,
                            Message = e.Message + " IE " + e.InnerException.Message + " IE " +
                                      e.InnerException.InnerException.Message
                        };
                    }
                    else
                    {
                        return new Response { Done = false, Message = e.Message, Value = 0 };
                    }
                }
            }
        }
        public Response verifyUser(string userAccount, string password)
        {
            var response = new Response();
            using (var sqlConnection = new SqlConnection(conexion))
            {

                var user = sqlConnection.Query<User>("select * from tblUsers where userAccount = @userAccount and state = 1", new { userAccount = userAccount }, commandType: System.Data.CommandType.Text).FirstOrDefault();
                if (user != null)
                {
                        if (user.passwordAccount == PassEncript.Encrypt(password))
                        {
                            response.Value = user.idUser;
                            response.Done = true;
                        }
                        else
                        {
                            response.Message = "La contraseña es incorrecta";
                            response.Done = false;
                       }
                    
                }
                else
                {
                    response.Message = "El usuario con el que intentas ingresar no se encuentra registrado";
                    response.Done = false;
                }
                return response;
            }
        }
    }
}