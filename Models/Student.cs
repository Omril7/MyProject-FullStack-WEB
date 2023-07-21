namespace TelHai.FullStackWEB.Models
{
    public class Student : User
    {
        public List<Submit> Submissions { get; set; }
        public Student() : base()
        {
            Submissions = new List<Submit>();
        }
        public Student(string name, string user, string pass, int role) : base(name, user, pass, role)
        {
            Submissions = new List<Submit>();
        }
    }
}
