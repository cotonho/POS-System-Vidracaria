using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using VidracariaDoMarcinho.Data;
using VidracariaDoMarcinho.Models;


namespace VidracariaDoMarcinho.Controllers
{
    public class PedidosController : Controller
    {
        private readonly AppDbContext _context;

        public PedidosController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var orcamentos = await _context.Orcamentos
                .Include(o => o.Cliente)
                .Include(o => o.Itens)
                .ThenInclude(i => i.Material)
                .ToListAsync();

            ViewBag.Clientes = await _context.Clientes.ToListAsync();
            ViewBag.Material = await _context.Materiais.ToListAsync();

            //opção pra ler os valores no js
            ViewBag.MateriaisJson = JsonConvert.SerializeObject(await _context.Materiais.ToListAsync());

            return View(orcamentos);
        }

        public ActionResult CrudCliente(string? cpf)
        {
            var cliente = _context.Clientes.FirstOrDefault(cliente => cliente.CPF == cpf);
            return View(cliente); // View que conterá o DataTable
        }

        public ActionResult VisualizaPedido(int id)
        {
            var pedido = _context.Orcamentos
                .Include(o => o.Cliente)
                .FirstOrDefault(p => p.Id == id);

            if (pedido == null)
                return NotFound();

            ViewBag.StatusOptions = new List<SelectListItem>
            {
                new SelectListItem { Text = "Aberto", Value = "Aberto" },
                new SelectListItem { Text = "Concluído", Value = "Concluído" },
                new SelectListItem { Text = "Cancelado", Value = "Cancelado" }
            };

            return View(pedido);
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

    }
}
