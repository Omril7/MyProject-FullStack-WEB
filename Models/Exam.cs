using System.Text;

namespace TelHai.FullStackWEB.Models
{
    public class Exam
    {
        private double? totalTime;

        public int Id { get; set; }
        public string Name { get; set; }
        public string ExamId { get; set; }
        public DateTime ExamDate { get; set; }
        public string? TeacherName { get; set; }
        public double? TotalTime
        {
            get { return totalTime; }
            set
            {
                if (value < 0)
                    totalTime = 1;
                else
                    totalTime = value;
            }
        }
        public bool? IsOrderRandom { get; set; }
        public List<Question> Questions { get; set; }

        public Exam() : this("Exam from API", "", 1, false, new List<Question>()) { }
        public Exam(string name, string teacherName, double totalTime, bool isOrderRandom, List<Question> questions)
        {
            Name = name;
            ExamId = string.Empty;
            TeacherName = teacherName;
            TotalTime = totalTime;
            IsOrderRandom = isOrderRandom;
            Questions = questions;
            ExamDate = DateTime.Now;
        }
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder(Name);
            sb.Append(ExamDate.ToString());
            return sb.ToString();
        }

        public void Update(Exam exam)
        {
            Name = exam.Name;
            ExamId = exam.ExamId;
            ExamDate = exam.ExamDate;
            TeacherName = exam.TeacherName;
            TotalTime = exam.TotalTime;
            IsOrderRandom = exam.IsOrderRandom;
        }   
    }
}
