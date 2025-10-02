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
                return null;

            var document = new Document();

            // 🔹 Define estilos básicos
            document.Info.Title = "Orçamento";
            var style = document.Styles["Normal"];
            style.Font.Name = "Arial"; // Arial ou Verdana costumam existir
            style.Font.Size = 10;


            BuildDocument(document, pedido);

            var pdfRenderer = new PdfDocumentRenderer(unicode: true)
            {
                Document = document
            };

            pdfRenderer.RenderDocument(); // agora deve funcionar
            return pdfRenderer.PdfDocument;
        }


        private void BuildDocument(Document document, Orcamento pedido)
        {
            Section section = document.AddSection();

            var paragraph = section.AddParagraph();
            paragraph.AddFormattedText("Vidracaria do Marcinho", TextFormat.Bold);
            paragraph.AddLineBreak();
            paragraph.AddText("Telefone: (32) 9836-6705");
            paragraph.Format.SpaceAfter = 20;

            paragraph = section.AddParagraph();
            paragraph.AddFormattedText("Cliente:", TextFormat.Bold);
            paragraph.AddLineBreak();
            paragraph.AddText(pedido.Cliente?.Nome ?? "Cliente não informado");
        }

    }
}
