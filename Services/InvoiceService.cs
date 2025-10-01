using MigraDoc.Rendering;
using MigraDoc.DocumentObjectModel;
using PdfSharp.Pdf;
using Microsoft.EntityFrameworkCore;
using VidracariaDoMarcinho.Models;
using VidracariaDoMarcinho.Data;

namespace VidracariaDoMarcinho.Services
{
    public class InvoiceService
    {
        private readonly AppDbContext _context;

        public InvoiceService(AppDbContext context)
        {
            _context = context;
        }

        public PdfDocument GetInvoice(int id)
        {
            var pedido = _context.Orcamentos
                .Include(o => o.Cliente)
                .Include(o => o.Itens)
                .Include(o => o.Vidros)
                .FirstOrDefault(o => o.Id == id);

            if (pedido == null)
                return null; // ou lance uma exceção, conforme sua necessidade

            var document = new Document();
            BuildDocument(document, pedido);

            var pdfRenderer = new PdfDocumentRenderer();
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();

            return pdfRenderer.PdfDocument;
        }

        private void BuildDocument(Document document, Orcamento pedido)
        {
            Section section = document.AddSection();

            var paragraph = section.AddParagraph();
            paragraph.AddText("Vidracaria do Marcinho");
            paragraph.AddLineBreak();
            paragraph.AddText("Telefone: (32) 9836-6705");
            paragraph.Format.SpaceAfter = 20;

            paragraph = section.AddParagraph();
            paragraph.AddText("Cliente: ");
            paragraph.AddLineBreak();
            paragraph.AddText($"{pedido.Cliente.Nome}");
            // Adicione outros dados do pedido conforme necessário
        }
    }
}
