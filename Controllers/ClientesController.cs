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

        public ActionResult Index()
        {
            var clientes = _context.Clientes.ToList();
            return View(clientes); // View que conterá o DataTable
        }
        public ActionResult CrudCliente(string cpf)
        {
            var cliente = _context.Clientes.FirstOrDefault(cliente => cliente.CPF == cpf);
            return View(cliente); // View que conterá o DataTable
        }

        public ActionResult VisualizarCliente(string cpf)
        {
            var cliente = _context.Clientes.FirstOrDefault(cliente => cliente.CPF == cpf);

            return View(cliente);
        }

    }
}
