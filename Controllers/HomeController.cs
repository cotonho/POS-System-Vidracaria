using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using VidracariaDoMarcinho.Models;
using System.Data;
using Microsoft.AspNetCore.Mvc;

namespace VidracariaDoMarcinho.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            var Table_Clientes = new DataTable();
            Table_Clientes.Columns.Add("CPF", typeof(string));
            Table_Clientes.Columns.Add("Nome", typeof(string));
            Table_Clientes.Columns.Add("Telefone", typeof(string));

            Table_Clientes.Rows.Add("12345", "João", "(32)984000000");
            Table_Clientes.Rows.Add("67890", "Bão", "(32)098765432");
            Table_Clientes.Rows.Add("10112", "Leão", "(32)123455789");

            //filtro
            //DataRow[] results = Table_Clientes.Select("CPF > 10112");
            //Table_Clientes = results.CopyToDataTable();

            Table_Clientes.DefaultView.Sort = "Nome DESC";

            Table_Clientes = Table_Clientes.DefaultView.ToTable();
            return View(Table_Clientes);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
