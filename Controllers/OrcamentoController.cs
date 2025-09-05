using Microsoft.AspNetCore.Mvc;
using VidracariaDoMarcinho.Data;
using VidracariaDoMarcinho.Models;

namespace VidracariaDoMarcinho.Controllers
{
    public class OrcamentoController : Controller
    {
        private readonly AppDbContext _context;

        //public OrcamentoController(AppDbContext)
        //{
        //    _context = context;
        //}

        public ActionResult Index()
        {
            return View();
        }
    }
}
