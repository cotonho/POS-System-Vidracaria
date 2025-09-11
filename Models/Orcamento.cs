using System.ComponentModel.DataAnnotations;

namespace VidracariaDoMarcinho.Models
{
    public class Orcamento
    {
        public int Id { get; set; }

        [StringLength(14)]
        public string ClienteCPF { get; set; }

        public DateTime Data { get; set; } = DateTime.Now;

        // Status
        public string Status { get; set; } = "Aberto";
        public string? LocalInstalacao { get; set; }
        public string? Observacoes { get; set; }

        public decimal Custo { get; set; }
        public decimal Total { get; set; }
        public decimal Gasolina { get; set; }
        public decimal Silicone { get; set; }
        public decimal Box { get; set; }
        public decimal ValorParcelas { get; set; }
        public int Parcelas { get; set; }
        public int ParcelasPagas { get; set; }


        public virtual Cliente Cliente { get; set; }
        public virtual ICollection<OrcamentoItem> Itens { get; set; }
        public virtual ICollection<Vidro> Vidros { get; set; }

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
        public string? LocalInstalacao { get; set; }
        public string? Observacoes { get; set; }

        public decimal Custo { get; set; }
        public decimal Total { get; set; }
        public decimal Gasolina { get; set; }
        public decimal Silicone { get; set; }
        public decimal Box { get; set; }
        public decimal ValorParcelas { get; set; }
        public int Parcelas { get; set; }
        public int ParcelasPagas { get; set; }

        public List<OrcamentoItemDto> Itens { get; set; }
        public List<VidroDto> Vidros { get; set; }

    }


    public class OrcamentoItemDto
    {
        public int MaterialId { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
    }

    public class Vidro
    {
        public int Id { get; set; }
        public int OrcamentoId { get; set; }
        public int MaterialId { get; set; }
        public decimal Altura { get; set; }
        public decimal Largura { get; set; }
        public string TipoVidro { get; set; }
        public string Cor { get; set; }
        public string Observacoes { get; set; }
        public int Quantidade { get; set; }
        public decimal Preco { get; set; }

        public virtual Orcamento Orcamento { get; set; }
        public virtual Material Material { get; set; }
    }

    public class VidroDto
    {
        public int MaterialId { get; set; }
        public decimal Altura { get; set; }
        public decimal Largura { get; set; }
        public string TipoVidro { get; set; }
        public string Cor { get; set; }
        public string Observacoes { get; set; }
        public int Quantidade { get; set; }
        public decimal Preco { get; set; }
    }

}
