using Microsoft.EntityFrameworkCore;

namespace TelHai.FullStackWEB.Models
{
    public class TeacherContext : DbContext
    {
        public TeacherContext(DbContextOptions<TeacherContext> options) : base(options) { }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Teacher>()
                .HasMany(e => e.Exams)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Exam>()
                .HasMany(e => e.Questions)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Question>()
                .HasMany(q => q.Answers)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
