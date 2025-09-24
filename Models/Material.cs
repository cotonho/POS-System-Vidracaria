using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;



namespace VidracariaDoMarcinho.Models
{
    public class Material
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public string? Cor { get; set; }

    }
}
