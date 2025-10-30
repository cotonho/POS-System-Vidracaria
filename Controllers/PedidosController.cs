using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using System.Reflection.Metadata;
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
                .Include(o => o.Itens)
                    .ThenInclude(i => i.Material)
                .Include(o => o.Vidros)
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

        public JsonResult CrudPedido(Orcamento orcamento)
        {
            var pedidoAlterado = _context.Orcamentos.FirstOrDefault(c => c.Id == orcamento.Id);
            if (pedidoAlterado != null)
            {
                pedidoAlterado.Status = orcamento.Status;
                pedidoAlterado.LocalInstalacao = orcamento.LocalInstalacao;
                pedidoAlterado.Observacoes = orcamento.Observacoes;

                pedidoAlterado.Total = (orcamento.Total)/100;
                pedidoAlterado.Gasolina = 0;
                pedidoAlterado.Silicone = 0;
                pedidoAlterado.Box = 0;
                pedidoAlterado.PorcentagemLucro = (orcamento.PorcentagemLucro)/100;
                pedidoAlterado.PorcentagemParcela = (orcamento.PorcentagemParcela)/100;
                pedidoAlterado.PorcentagemDesconto = (orcamento.PorcentagemDesconto)/100;
                pedidoAlterado.ParcelasPagas = orcamento.ParcelasPagas;
                pedidoAlterado.ValorParcelas = (orcamento.ValorParcelas)/100;
                pedidoAlterado.ValorPago = (orcamento.ValorPago)/100;
                pedidoAlterado.MaoDeObra = (orcamento.MaoDeObra)/100;
            }
            else
                _context.Orcamentos.Add(orcamento);

            try
            {
                _context.SaveChanges();
                return Json(new { success = true, message = "Pedido alterado com sucesso!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }


        }

        public ActionResult DeleteVidro(Vidro vidro)
        {
            var materialParaApagar = _context.Vidros?.FirstOrDefault(c => c.Id == vidro.Id);
            if (materialParaApagar != null)
            {

                _context.Vidros.Remove(materialParaApagar);
                _context.SaveChanges();
                return Json(new { success = true, message = "Vidro deletado com sucesso!" });
            }
            else
                return Json(new { success = false, message = "O vidro não foi deletado!" });

        }

        public ActionResult DeleteItem(OrcamentoItem item)
        {
            var materialParaApagar = _context.OrcamentoItens?.FirstOrDefault(c => c.Id == item.Id);
            if (materialParaApagar != null)
            {

                _context.OrcamentoItens.Remove(materialParaApagar);
                _context.SaveChanges();
                return Json(new { success = true, message = "Item deletado com sucesso!" });
            }
            else
                return Json(new { success = false, message = "O item não foi deletado!" });

        }

    }
}
