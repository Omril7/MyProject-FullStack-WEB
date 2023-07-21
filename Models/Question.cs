namespace TelHai.FullStackWEB.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsRand { get; set; }
        public List<Answer> Answers { get; set; }

        public Question()
        {
            Answers = new List<Answer>();
            IsRand = false;
        }

        public override string ToString()
        {
            return Text;
        }
    }
}
