namespace TelHai.FullStackWEB.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }

        public Answer(string text, bool isCorrect)
        {
            Text = text;
            IsCorrect = isCorrect;
        }

        public override string ToString()
        {
            return Text;
        }
    }
}
