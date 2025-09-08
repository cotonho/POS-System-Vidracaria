using System.ComponentModel.DataAnnotations;

namespace VidracariaDoMarcinho.Models
{
    public class Orcamento
    {
        public int Id { get; set; }

        [StringLength(14)]
        public string ClienteCPF { get; set; }

        public DateTime Data { get; set; } = DateTime.Now;

        // Dimensões
        public decimal Altura { get; set; }
        public decimal Largura { get; set; }

        // Especificações
        public string TipoVidro { get; set; }
        public string CorVidro { get; set; }
        public decimal Espessura { get; set; }

        // Status
        public string Status { get; set; } = "Aberto";
        public string LocalInstalacao { get; set; }
        public string Observacoes { get; set; }

        public virtual Cliente Cliente { get; set; }
        public virtual ICollection<OrcamentoItem> Itens { get; set; }
    }

    public class OrcamentoItem
    {
        public int Id { get; set; }
        public int OrcamentoId { get; set; }
        public int MaterialId { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }

        public virtual Material Material { get; set; }
        public virtual Orcamento Orcamento { get; set; }
    }

    public class OrcamentoDto
    {
        public string ClienteCPF { get; set; }

        public decimal Altura { get; set; }
        public decimal Largura { get; set; }

        // Especificações
        public string TipoVidro { get; set; }
        public string CorVidro { get; set; }
        public decimal Espessura { get; set; }

        public string LocalInstalacao { get; set; }
        public string Observacoes { get; set; }

        public List<OrcamentoItemDto> Itens { get; set; }
    }

    public class OrcamentoItemDto
    {
        public int MaterialId { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
    }
}
