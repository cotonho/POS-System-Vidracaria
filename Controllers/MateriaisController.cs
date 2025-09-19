using Microsoft.AspNetCore.Mvc;
using VidracariaDoMarcinho.Data;
using VidracariaDoMarcinho.Models;

namespace VidracariaDoMarcinho.Controllers
{
    public class MateriaisController : Controller
    {

        private readonly AppDbContext _context;

        public MateriaisController(AppDbContext context)
        {
            _context = context;
        }

        public ActionResult Index()
        {
            var materiais = _context.Materiais.ToList();
            return View(materiais); // View que conterá o DataTable
        }

        public ActionResult EditarMaterial(int Id)
        {
            var material = _context.Materiais?.FirstOrDefault(material => material.Id == Id) ?? new Material();

            return View(material);
        }

        public JsonResult CrudMaterial(Material material)
        {
            var materialAlterado = _context.Materiais.FirstOrDefault(c => c.Id == material.Id);
            if (materialAlterado != null)
            {
                materialAlterado.Nome = material.Nome;
                materialAlterado.Cor = material.Cor;
                materialAlterado.Preco = material.Preco;
            }
            else
                _context.Materiais.Add(material);

            _context.SaveChanges();
            return Json(new { success = true, message = "Cliente salvo com sucesso!" });

        }

        [HttpPost]
        public JsonResult DeleteMaterial([FromForm] int Id)
        {
            var materialParaApagar = _context.Materiais.FirstOrDefault(c => c.Id == Id);
            if (materialParaApagar != null)
            {
                _context.Materiais.Remove(materialParaApagar);
                _context.SaveChanges();
                return Json(new { success = true, message = "Material deletado com sucesso!" });
            }
            return Json(new { success = false, message = "O material não foi deletado!" });
        }

    }
}
