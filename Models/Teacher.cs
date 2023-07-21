namespace TelHai.FullStackWEB.Models
{
    public class Teacher : User
    {
        public List<Exam> Exams { get; set; }
        public Teacher() : base()
        {
            Exams = new List<Exam>();
        }
        public Teacher(string name, string user, string pass, int role) : base(name, user, pass, role)
        {
            Exams = new List<Exam>();
        }
    }
}
