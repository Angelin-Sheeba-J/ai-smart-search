
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace aisearch.DataContext
{
    public class AisearchDbContext :DbContext
    {
        public AisearchDbContext(DbContextOptions<AisearchDbContext> options ):base(options)
        {

        }
        public DbSet<Role> role { get; set; }
        public DbSet<User> user { get; set; }
        public DbSet<Rule> rule { get; set; }
        public DbSet<Chatbot> chatbot { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>().HasData(new Role { Id = 1, Name = "Admin" },
                                                  new Role { Id = 2, Name = "Privileged User" },
                                                  new Role { Id = 3, Name = "Report Viewer" }
   );
        }
    }
}
