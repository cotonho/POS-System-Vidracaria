using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VidracariaDoMarcinho.Data;
using VidracariaDoMarcinho.Models;
using System.Linq;
using System.Threading.Tasks;
using System;
using Newtonsoft.Json;

namespace VidracariaDoMarcinho.Controllers
{
    public class OrcamentoController : Controller
    {
        private readonly AppDbContext _context;
        public OrcamentoController(AppDbContext context) => _context = context;

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

        public async Task<IActionResult> CrudOrcamento()
        {
            ViewBag.Material = await _context.Materiais.ToListAsync();


            //opção pra ler os valores no js
            ViewBag.MateriaisJson = JsonConvert.SerializeObject(await _context.Materiais.ToListAsync());

            return View();
        }

        public IActionResult Create()
        {

            ViewBag.Clientes = _context.Clientes.ToList();
            ViewBag.Materiais = _context.Materiais.ToList();

            var materiais = _context.Materiais.ToList();
            ViewBag.MateriaisJson = JsonConvert.SerializeObject(materiais);

            return View();
        }

        [HttpPost]
        public async Task<JsonResult> Salvar([FromBody] OrcamentoDto dto)
        {
            try
            {
                Console.WriteLine($"Recebendo orçamento para CPF: {dto?.ClienteCPF}");

                if (dto == null ||
                    ((dto.Itens == null || !dto.Itens.Any()) &&
                    (dto.Vidros == null || !dto.Vidros.Any())))
                {
                    return Json(new { success = false, message = "Nenhum item ou vidro enviado." });
                }

                // VERIFICAÇÃO DO CLIENTE
                var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.CPF == dto.ClienteCPF);
                if (cliente == null)
                {
                    Console.WriteLine($"Cliente com CPF {dto.ClienteCPF} não encontrado!");
                    return Json(new { success = false, message = "Cliente não encontrado. CPF: " + dto.ClienteCPF });
                }
                Console.WriteLine($"Cliente encontrado: {cliente.Nome}");

                // VERIFICAÇÃO DOS MATERIAIS
                foreach (var item in dto.Itens)
                {
                    var material = await _context.Materiais.FindAsync(item.MaterialId);
                    if (material == null)
                    {
                        Console.WriteLine($"Material ID {item.MaterialId} não encontrado!");
                        return Json(new { success = false, message = $"Material ID {item.MaterialId} não encontrado." });
                    }
                    Console.WriteLine($"Material encontrado: {material.Nome} - Preço: {material.Preco}");
                }

                var orc = new Orcamento
                {
                    ClienteCPF = dto.ClienteCPF,
                    Data = DateTime.Now,
                    Itens = dto.Itens.Select(i => new OrcamentoItem
                    {
                        MaterialId = i.MaterialId,
                        Quantidade = i.Quantidade,
                        PrecoUnitario = i.PrecoUnitario
                    }).ToList()
                };

                _context.Orcamentos.Add(orc);
                await _context.SaveChangesAsync(); // salva o orçamento e gera o ID

                // 🔹 Agora salvar os vidros
                if (dto.Vidros != null && dto.Vidros.Any())
                {
                    foreach (var v in dto.Vidros)
                    {
                        var vidro = new Vidro
                        {
                            OrcamentoId = orc.Id,   // vínculo
                            MaterialId = v.MaterialId,
                            Altura = v.Altura,
                            Largura = v.Largura,
                            TipoVidro = v.TipoVidro,
                            Cor = v.Cor,
                            Observacoes = v.Observacoes,
                            Quantidade = v.Quantidade,
                            Preco = v.Preco
                        };
                        _context.Vidros.Add(vidro);
                    }
                    await _context.SaveChangesAsync();
                }

                Console.WriteLine($"Orçamento salvo com ID: {orc.Id}");
                return Json(new { success = true, id = orc.Id });
            }
            catch (DbUpdateException dbEx)
            {
                // Erro específico do banco de dados
                Console.WriteLine($"Erro DB: {dbEx.Message}");
                if (dbEx.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {dbEx.InnerException.Message}");
                }
                return Json(new { success = false, message = "Erro no banco de dados: " + dbEx.InnerException?.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro geral: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return Json(new { success = false, message = $"Erro interno: {ex.Message}" });
            }
        }

        public async Task<IActionResult> Details(int id)
        {
            var orc = await _context.Orcamentos
                .Include(o => o.Cliente)
                .Include(o => o.Itens).ThenInclude(i => i.Material)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (orc == null) return NotFound();
            return View(orc);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var orc = await _context.Orcamentos.Include(o => o.Itens).FirstOrDefaultAsync(o => o.Id == id);
            if (orc == null) return NotFound();

            _context.Orcamentos.Remove(orc);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Index));
        }
    }
}
