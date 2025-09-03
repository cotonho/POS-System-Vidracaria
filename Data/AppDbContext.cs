using Microsoft.EntityFrameworkCore;
using VidracariaDoMarcinho.Models;

namespace VidracariaDoMarcinho.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }
        //public DbSet<pedido> pedidos { get; set; }
        //public DbSet<material> materiais { get; set; }
    }
}
