using Microsoft.AspNetCore.Mvc;
using System.IO;
using VidracariaDoMarcinho.Services;

[Route("Services/[controller]")]
public class InvoiceServiceController : Controller
{
    private readonly InvoiceService _invoiceService;

    public InvoiceServiceController(InvoiceService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int id)
    {
        var pdfDoc = _invoiceService.GetInvoice(id);
        if (pdfDoc == null)
            return NotFound();

        // Salva o PdfDocument em um MemoryStream
        var ms = new MemoryStream();
        pdfDoc.Save(ms, false); // PdfSharp.Pdf.PdfDocument.Save(Stream, boolean) — false para não close automático
        ms.Position = 0;

        // Retorna como FileStreamResult. Browser vai abrir inline por padrão.
        return File(ms, "application/pdf", $"pedido_{id}.pdf");
    }
}
