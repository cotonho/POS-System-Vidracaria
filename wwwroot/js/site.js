// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


function atualizarCampos() {
    const select = document.getElementById("VidroId");
    const option = select.options[select.selectedIndex];

    // pega os atributos do option selecionado
    const tipo = option.getAttribute("data-tipo");
    const cor = option.getAttribute("data-cor");

    // joga nos inputs
    document.getElementById("tipo-input").value = tipo;
    document.getElementById("cor-vidro-input").value = cor;
}

// já preencher ao carregar a página (primeiro item)
window.onload = atualizarCampos;

function atualizarPrecoVidro() {
    const select = document.getElementById("VidroId");
    const option = select.options[select.selectedIndex];
    const precoBase = parseFloat(option.getAttribute("data-preco"));

    const altura = parseFloat(document.querySelector("input[name='altura-input']").value) || 0;
    const largura = parseFloat(document.querySelector("input[name='largura-input']").value) || 0;

    // calcula a área
    const area = altura * largura;

    // preço final
    const precoFinal = precoBase * area;

    // mostra no input
    document.getElementById("preco-input").value = precoFinal.toFixed(2); // 2 casas decimais
}

// já preencher ao carregar
window.onload = atualizarCampos;

$(document).ready(function () {
    // Inicializa DataTables
    $('.table').DataTable();

    // adicionar item (delegação)
    $("#tabelaMateriais").on("click", ".btn-add", function (e) {
        e.preventDefault(); // Previne o comportamento padrão do botão

        let row = $(this).closest("tr");
        let id = row.data("id");

        // se já existe, só aumenta quantidade
        let existing = $("#tabelaSelecionados tbody tr[data-id='" + id + "']");
        if (existing.length) {
            let q = parseInt(existing.find(".qtde").val() || 0) + 1;
            existing.find(".qtde").val(q);
            recalculaTotal();
            return;
        }

        let nome = row.data("nome"),
            cor = row.data("cor"),
            preco = row.data("preco");

        let novaLinha = $("<tr>")
            .attr("data-id", id)
            .append($("<td>").text(nome))
            .append($("<td>").text(cor))
            .append($("<td>").addClass("preco-item").text(preco))
            .append($("<td>").append($("<input>", {
                type: "number",
                value: 1,
                min: 1,
                class: "qtde"
            })))
            .append($("<td>").append($("<button>", {
                type: "button",
                class: "btn-remover"
            }).text("Remover")));

        $("#tabelaSelecionados tbody").append(novaLinha);
        recalculaTotal();
    });


    //tabela de vidros
    $(document).on("click", ".btn-add-vidro", function (e) {
        e.preventDefault(); // Previne o comportamento padrão do botão

        let row = $(this).closest("tr");
        let id = row.data("id");

        // se já existe, só aumenta quantidade
        let existing = $("#tabelaVidrosAdicionados tbody tr[data-id='" + id + "']");
        if (existing.length) {
            let q = parseInt(existing.find(".qtde").val() || 0) + 1;
            existing.find(".qtde").val(q);
            recalculaTotal();
            return;
        }

        let Altura = document.getElementById("altura-input").value,
            Largura = document.getElementById("largura-input").value,
            TipoVidro = document.getElementById("tipo-input").value,
            Cor = document.getElementById("cor-vidro-input").value,
            Observacoes = document.getElementById("obs-input").value,
            Preco = document.getElementById("preco-input").value;

        let novaLinha = $("<tr>")
            .attr("data-id", id)
            .append($("<td>").text(Altura))
            .append($("<td>").text(Largura))
            .append($("<td>").text(TipoVidro))
            .append($("<td>").text(Cor))
            .append($("<td>").text(Observações))
            .append($("<td>").addClass("preco-item").text(Preco))
            .append($("<td>").append($("<input>", {
                type: "number",
                value: 1,
                min: 1,
                class: "qtde"
            })))
            .append($("<td>").append($("<button>", {
                type: "button",
                class: "btn-remover-vidro"
            }).text("Remover")));

        $("#tabelaVidrosAdicionados tbody").append(novaLinha);
        recalculaTotal();
    });

    // remover linha
    $("#tabelaSelecionados").on("click", ".btn-remover", function (e) {
        e.preventDefault();
        $(this).closest("tr").remove();
        recalculaTotal();
    });

    $("#tabelaVidrosAdicionados").on("click", ".btn-remover-vidro", function (e) {
        e.preventDefault();
        $(this).closest("tr").remove();
        recalculaTotal();
    });

    // mudança de quantidade
    $("#tabelaSelecionados").on("input change", ".qtde", function () {
        let v = parseInt($(this).val() || 0);
        if (v < 1) $(this).val(1);
        recalculaTotal();
    });

    $("#tabelaVidrosAdicionados").on("input change", ".qtde", function () {
        let v = parseInt($(this).val() || 0);
        if (v < 1) $(this).val(1);
        recalculaTotal();
    });

    // salvar orcamento
    $("#btnSalvar").on("click", function (e) {
        e.preventDefault();

        let saveUrl = $(this).data("save-url");
        let clienteCPF = $("#clienteCPF").val();
        let itens = [];

        // Validações antes de enviar
        if (!clienteCPF) {
            alert("Selecione um cliente!");
            return;
        }

        $("#tabelaSelecionados tbody tr").each(function () {
            let materialId = $(this).data("id");
            let quantidade = parseInt($(this).find(".qtde").val() || 0);
            let precoText = $(this).find(".preco-item").text().trim();
            let precoUnitario = parseFloat(precoText.replace(",", "."));

            if (!materialId) {
                return true; // continue para o próximo item
            }

            // Só adiciona se todos os dados estiverem válidos
            if (materialId && quantidade > 0 && !isNaN(precoUnitario)) {
                itens.push({
                    MaterialId: materialId,
                    Quantidade: quantidade,
                    PrecoUnitario: precoUnitario
                });
            }
        });

        if (itens.length === 0) {
            alert("Adicione pelo menos um item ao orçamento!");
            return;
        }

        let dto = {
            ClienteCPF: clienteCPF,
            Itens: itens
        };

        console.log("Enviando dados:", dto); // Para debug

        $.ajax({
            type: "POST",
            url: saveUrl,
            data: JSON.stringify(dto),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    alert("Orçamento salvo com sucesso! ID: " + res.id);
                    window.location.href = '/Orcamento/Details/' + res.id;
                } else {
                    alert("Erro: " + (res.message || "Erro ao salvar orçamento"));
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro AJAX:", error);
                alert("Erro no servidor: " + error);
            }
        });
    });
});

function recalculaTotal() {
    let total = 0;
    $("#tabelaSelecionados tbody tr").each(function () {
        let precoText = $(this).find(".preco-item").text().trim();
        let preco = parseFloat(precoText.replace(",", ".")) || 0;
        let qtde = parseInt($(this).find(".qtde").val() || 0);
        total += preco * qtde;
    });
    $("#valorTotal").text(total.toFixed(2));
}



