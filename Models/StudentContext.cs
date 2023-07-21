using Microsoft.EntityFrameworkCore;

namespace TelHai.FullStackWEB.Models
{
    public class StudentContext : DbContext
    {
        public StudentContext(DbContextOptions<StudentContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<Submit> Submissions { get; set; }
        public DbSet<Error> Errors { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>()
                .HasMany(e => e.Submissions)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Submit>()
                .HasMany(g => g.Errors)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
