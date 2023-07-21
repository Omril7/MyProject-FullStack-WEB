namespace TelHai.FullStackWEB.Models
{
    public class Submit
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ExamId { get; set; }
        public int Grade { get; set; }
        public List<Error> Errors { get; set; }
        public Submit()
        {
            Errors = new List<Error>();
        }
    }
}
