using Microsoft.EntityFrameworkCore;
using VidracariaDoMarcinho.Models;

namespace VidracariaDoMarcinho.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Cliente> Clientes { get; set; }
        //public DbSet<Pedidos> Pedidos { get; set; }
        public DbSet<Material> Materiais { get; set; }
    }
}
