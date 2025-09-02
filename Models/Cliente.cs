using System.ComponentModel.DataAnnotations;

namespace VidracariaDoMarcinho.Models
{
    public class Cliente
    {
        [Key]
        public string CPF { get; set; }
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public string Rua { get; set; }
        public string Numero { get; set; }
        public string Cidade { get; set; }
        public string Bairro { get; set; }
        public string CEP { get; set; }
    }
}
