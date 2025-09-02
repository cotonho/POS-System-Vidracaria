using Microsoft.AspNetCore.Mvc;
using VidracariaDoMarcinho.Data;
using System.Linq;

namespace VidracariaDoMarcinho.Controllers
{
    public class ClientesController : Controller
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var clientes = _context.clientes.ToList();
            return View(); // View que conterá o DataTable
        }

        [HttpGet]
        public IActionResult GetClientes()
        {
            var clientes = _context.clientes.ToList();
            return Json(new { data = clientes }); // formato esperado pelo DataTable
        }
    }
}
