using System.Data;

namespace TelHai.FullStackWEB.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int Role { get; set; } // 0 = Teacher ; 1 = Student
        public User()
        {
            Name = string.Empty;
            UserId = Guid.NewGuid().ToString();
            UserName = string.Empty;
            Password = string.Empty;
            Role = 0;
        }
        public User(string name, string user, string pass, int role)
        {
            Name = name;
            UserId = Guid.NewGuid().ToString();
            UserName = user;
            Password = pass;
            Role = role;
        }
    }
}
