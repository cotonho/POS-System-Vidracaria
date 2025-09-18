// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.


function atualizarCampos() {
    const select = document.getElementById("VidroId");
    if (!select) return; // se não existe, sai da função

    const option = select.options[select.selectedIndex];
    if (!option) return;

    document.getElementById("tipo-input").value = option.getAttribute("data-tipo");
    document.getElementById("cor-vidro-input").value = option.getAttribute("data-cor");
}




// já preencher ao carregar a página (primeiro item)


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

$(document).ready(function () {
    // Inicializa DataTables
    $('.table').DataTable();

    // adicionar item
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
        let materialId = $("#VidroId").val(); // pega o valor do select


        // se já existe, só aumenta quantidade
        let existing = $("#tabelaVidrosAdicionados tbody tr[data-id='" + materialId + "']");
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

        let novaLinhaVidros = $("<tr>")
            .attr("data-id", materialId)
            .append($("<td>").text(Altura))
            .append($("<td>").text(Largura))
            .append($("<td>").text(TipoVidro))
            .append($("<td>").text(Cor))
            .append($("<td>").text(Observacoes))

            .append($("<td>").append($("<input>", {
                type: "number",
                value: 1,
                min: 1,
                class: "qtde"
            })))

            .append($("<td>").addClass("preco-item").text(Preco))

            .append($("<td>").append($("<button>", {
                type: "button",
                class: "btn-remover-vidro"
            }).text("Remover")));

        $("#tabelaVidrosAdicionados tbody").append(novaLinhaVidros);
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
        let vidros = [];

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
                return true; // continue
            }

            if (materialId && quantidade > 0 && !isNaN(precoUnitario)) {
                itens.push({
                    MaterialId: materialId,
                    Quantidade: quantidade,
                    PrecoUnitario: precoUnitario
                });
            }
        });

        $("#tabelaVidrosAdicionados tbody tr").each(function () {
            let altura = parseFloat($(this).find("td:eq(0)").text().trim()) || 0;
            let largura = parseFloat($(this).find("td:eq(1)").text().trim()) || 0;
            let tipoVidro = $(this).find("td:eq(2)").text().trim();
            let cor = $(this).find("td:eq(3)").text().trim();
            let observacoes = $(this).find("td:eq(4)").text().trim();
            let quantidade = parseInt($(this).find(".qtde").val() || 0);
            let precoText = $(this).find(".preco-item").text().trim();
            let preco = parseFloat(precoText.replace(",", ".")) || 0;

            // pega o id do material associado ao vidro (você guardou no tr com data-id)
            let materialId = $(this).data("id");

            if (materialId && quantidade > 0 && preco > 0) {
                vidros.push({
                    MaterialId: materialId,
                    Altura: altura,
                    Largura: largura,
                    TipoVidro: tipoVidro,
                    Cor: cor,
                    Observacoes: observacoes,
                    Quantidade: quantidade,
                    Preco: preco
                });
            }
        });

        if (itens.length === 0 && vidros.length === 0) {
            alert("Adicione pelo menos um item ou vidro ao orçamento!");
            return;
        }

        let dto = {
            ClienteCPF: clienteCPF,
            Itens: itens,
            Vidros: vidros,

            LocalInstalacao: $("#instalacao-input").val(),
            Observacoes: $("#obs-orcamento-input").val(),

            Custo: parseFloat($("#valorTotal").text()) || 0,
            Total: parseFloat($("#valor-total-pct").text()) || 0,
            Gasolina: parseFloat($("#gasolina-input").val()) || 0,
            Silicone: parseFloat($("#silicone-input").val()) || 0,
            Box: parseFloat($("#box-input").val()) || 0,
            ValorParcelas: parseFloat($("#valor-total-parcela").text()) || 0,
            Parcelas: parseInt($("#parcelas-input").val()) || 0,
            ParcelasPagas: 0
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

    let total = 0,
        total30pct = 0,
        parcelas = document.getElementById("parcelas-input").value,
        precoParcelas = 0;

    $("#tabelaVidrosAdicionados tbody tr").each(function () {
        let precoText = $(this).find(".preco-item").text().trim();
        let preco = parseFloat(precoText.replace(",", ".")) || 0;
        let qtde = parseInt($(this).find(".qtde").val() || 0);
        total += preco * qtde;
    });

    total += parseFloat(document.getElementById("box-input").value) || 0;
    total += parseFloat(document.getElementById("silicone-input").value) || 0;
    total += parseFloat(document.getElementById("gasolina-input").value) || 0;

    total30pct = total * 1.3;


    $("#tabelaSelecionados tbody tr").each(function () {
        let precoText = $(this).find(".preco-item").text().trim();
        let preco = parseFloat(precoText.replace(",", ".")) || 0;
        let qtde = parseInt($(this).find(".qtde").val() || 0);
        total += preco * qtde;
        total30pct += preco * qtde;
    });

    

    if (parcelas > 1) {
        total30pct *= 1.1
        precoParcelas = (total30pct) / parcelas;
    } else {
        precoParcelas = total30pct;
    }

    if (precoParcelas < 0) {
        precoParcelas = 0;
    }

    $("#valorTotal").text(total.toFixed(2));
    $("#valor-total-pct").text(total30pct.toFixed(2));
    $("#valor-total-parcela").text(precoParcelas.toFixed(2));
}



function calculaValorParcela() {
    let total = document.getElementById("total-input").value,
        parcelas = document.getElementById("parcelas-input").value,
        parcelasPagas = document.getElementById("parcelas-pagas-input").value,
        valorPago = document.getElementById("valor-pago-input").value || 0

    let parcelasAPagar = parcelas - parcelasPagas,
        valorAPagar = total - valorPago;

    if (valorAPagar < 0) {
        valorAPagar = 0;
    }
    let valor = (valorAPagar / parcelasAPagar).toFixed(2)

    if (valor.isNaN || valor.IsInfinity) {
        valor = 0;
    }

    document.getElementById("valor-parcelas-input").value = valor;
}

function reduzTotal() {
    let totalVidros = 0;
    let totalItens = 0;

    // Itera sobre todas as linhas da tabela
    $("#tabelaItens tbody tr").each(function () {
        const $tr = $(this);

        // Quantidade (coluna 2)
        const qtde = parseInt($tr.find("td:eq(2)").text().trim()) || 0;

        // Preço (coluna 3) - remove R$, pontos e transforma vírgula em ponto
        const precoText = $tr.find("td:eq(3)").text().trim();
        const preco = parseFloat(precoText.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;

        // Altura e Largura (colunas 4 e 5) - para identificar vidros
        const altura = $tr.find("td:eq(4)").text().trim();
        const largura = $tr.find("td:eq(5)").text().trim();

        if (altura && largura) {
            // É vidro
            totalVidros += preco * qtde;
        } else {
            // É item
            totalItens += preco * qtde;
        }
    });

    // Base = total de vidros
    let total = totalVidros;

    // Soma extras: Gasolina, Silicone, Box
    total += parseFloat(document.getElementById("Gasolina").value) || 0;
    total += parseFloat(document.getElementById("Silicone").value) || 0;
    total += parseFloat(document.getElementById("Box").value) || 0;

    // Multiplicadores aplicam apenas em vidros + extras
    const parcelas = parseFloat(document.getElementById("parcelas-input")?.value) || 0;
    const parcelasPagas = parseFloat(document.getElementById("parcelas-pagas-input")?.value) || 0;
    const faltam = parcelas - parcelasPagas;

    total *= 1.3

    // Adiciona total de itens (sem multiplicador)
    total += totalItens;

    if (faltam === 1) {
        total = total;
    } else {
        total = total * 1.1;
    }

    if (total < 0) { total = 0 };
    // Atualiza input do total
    document.getElementById("total-input").value = total.toFixed(2);
}


function somarValor() {
    const valorPagoInput = document.getElementById("valor-pago-input");
    const adicionarValorInput = document.getElementById("adicionar-valor");

    let valorPago = parseFloat(valorPagoInput.value.replace(",", ".")) || 0;
    let adicionar = parseFloat(adicionarValorInput.value.replace(",", ".")) || 0;

    let novoValor = valorPago + adicionar;

    valorPagoInput.value = novoValor.toFixed(2);

    // limpa o campo adicionar
    adicionarValorInput.value = "0";
    calculaValorParcela()
}