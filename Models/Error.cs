namespace TelHai.FullStackWEB.Models
{
    public class Error
    {
        public int Id { get; set; }
        public string QuestionTitle { get; set; }
        public string ChosenAnswer { get; set; }
        public string CorrectAnswer { get; set; }

        public override string ToString()
        {
            return QuestionTitle;
        }
    }
}
