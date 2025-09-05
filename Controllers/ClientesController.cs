using Microsoft.AspNetCore.Mvc;
using VidracariaDoMarcinho.Data;
using VidracariaDoMarcinho.Models;
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
        public ActionResult CrudCliente(string? cpf)
        {
            var cliente = _context.Clientes.FirstOrDefault(cliente => cliente.CPF == cpf);
            return View(cliente); // View que conterá o DataTable
        }

        public ActionResult VisualizarCliente(string cpf)
        {
            var cliente = _context.Clientes?.FirstOrDefault(cliente => cliente.CPF == cpf) ?? new Cliente();

            return View(cliente);
        }

        //lembrar de adicionar o Sweetalert no fim do projeto para deixar o site mais responsivo
        public JsonResult CrudUsuario(Cliente cliente)
        {
            var clienteAlterado = _context.Clientes.FirstOrDefault(c => c.CPF == cliente.CPF);
            if (clienteAlterado != null)
            {
                clienteAlterado.Nome = cliente.Nome;
                clienteAlterado.Telefone = cliente.Telefone;
                clienteAlterado.Rua = cliente.Rua;
                clienteAlterado.Numero = cliente.Numero;
                clienteAlterado.Cidade = cliente.Cidade;
                clienteAlterado.Bairro = cliente.Bairro;
                clienteAlterado.CEP = cliente.CEP;
            }
            else
                _context.Clientes.Add(cliente);

            _context.SaveChanges();
            return Json(new { success = true, message = "Cliente salvo com sucesso!" });

        }

        //lembrar de adicionar o Sweetalert no fim do projeto para deixar o site mais responsivo
        public JsonResult DeleteUsuario(Cliente cliente)
        {
            var clienteParaApagar = _context.Clientes?.FirstOrDefault(c => c.CPF == cliente.CPF);
            if (clienteParaApagar != null)
            {
                _context.Clientes.Remove(clienteParaApagar);
                _context.SaveChanges();
                return Json(new { success = true, message = "Cliente deletado com sucesso!" });
            }
            else
                return Json(new { success = false, message = "O cliente não foi deletado!" });

        }

    }
}
