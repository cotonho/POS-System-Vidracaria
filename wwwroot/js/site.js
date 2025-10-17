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
    const area = (altura * largura) / 1000000;

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




    function adicionarVidro() {
        //e.preventDefault(); // Previne o comportamento padrão do botão

        let row = $(this).closest("tr");
        let materialId = $("#VidroId").val(); // pega o valor do select


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
    };


    $(document).on("click", ".btn-add-vidro", async function (e) {
        e.preventDefault();

        adicionarVidro();

        let temp = document.getElementById("TipoVidro").value;

        if (temp == "Ploter") {
            let idVidro = document.getElementById("VidroId").value;

            document.getElementById("VidroId").value = "31";
            atualizarCampos();
            atualizarPrecoVidro();
            adicionarVidro();

            document.getElementById("VidroId").value = idVidro;
            atualizarCampos();
            atualizarPrecoVidro();
        }

        if (temp == "Janela 4F") {
            let idVidro = document.getElementById("VidroId").value;

            // pega os valores em metros e converte para mm
            let alturaVidro = document.getElementById("altura-input").value;
            let larguraVidro = document.getElementById("largura-input").value;
            let corMaterial = document.getElementById("CorVidro").value;

            // substitui vírgula por ponto e converte para número
            alturaVidro = parseFloat(alturaVidro.replace(",", "."));
            larguraVidro = parseFloat(larguraVidro.replace(",", "."));

            try {
                const resp = await fetch('/Orcamento/GetMateriais');
                if (!resp.ok) throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);

                const materiais = await resp.json();

                if (!Array.isArray(materiais)) {
                    console.error("Resposta de materiais não é um array:", materiais);
                    return;
                }

                // certifica-se que m.altura e m.largura são números antes de comparar
                const KitsJanela = materiais.filter(m => {
                    const nomeOk =
                        String(m.Nome || "").toLowerCase().includes("aluminio engenharia 4f".toLowerCase()) &&
                        String(m.Cor || "").toLowerCase().includes(corMaterial.toLowerCase());
                    const altura = Number(m.altura);
                    const largura = Number(m.largura);
                    const alturaOk = !Number.isNaN(altura) && altura >= alturaVidro;
                    const larguraOk = !Number.isNaN(largura) && largura > larguraVidro;
                    return nomeOk && alturaOk && larguraOk;
                });

                // Encontra o kit com menor altura e desempate por menor largura
                const kitSelecionado = KitsJanela.reduce((menor, atual) => {
                    if (!menor) return atual;
                    const aAlt = Number(atual.altura), mAlt = Number(menor.altura);
                    const aLar = Number(atual.largura), mLar = Number(menor.largura);
                    if (aAlt < mAlt) return atual;
                    if (aAlt === mAlt && aLar < mLar) return atual;
                    return menor;
                }, null);

                adicionarItem(21);
                adicionarItem(23);

                if (kitSelecionado && kitSelecionado.Id != null) {
                    adicionarItem(kitSelecionado.Id);
                } else {
                    console.warn("Nenhum kit compatível encontrado para as dimensões informadas.");
                }

            } catch (err) {
                console.error("Erro ao buscar materiais:", err);
            }
        }
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

        // coleta os itens da tabela
        $("#tabelaSelecionados tbody tr").each(function () {
            let materialId = $(this).data("id");
            let quantidade = parseInt($(this).find(".qtde").val() || 0);
            let precoText = $(this).find(".preco-item").text().trim();
            let precoUnitario = parseFloat(precoText.replace(",", "."));

            if (materialId && quantidade > 0 && !isNaN(precoUnitario)) {
                itens.push({
                    MaterialId: materialId,
                    Quantidade: quantidade,
                    PrecoUnitario: precoUnitario
                });
            }
        });

        // coleta os vidros da tabela
        $("#tabelaVidrosAdicionados tbody tr").each(function () {
            let altura = parseFloat($(this).find("td:eq(0)").text().trim()) || 0;
            let largura = parseFloat($(this).find("td:eq(1)").text().trim()) || 0;
            let tipoVidro = $(this).find("td:eq(2)").text().trim();
            let cor = $(this).find("td:eq(3)").text().trim();
            let observacoes = $(this).find("td:eq(4)").text().trim();
            let quantidade = parseInt($(this).find(".qtde").val() || 0);
            let precoText = $(this).find(".preco-item").text().trim();
            let preco = parseFloat(precoText.replace(",", ".")) || 0;
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
            Gasolina: 0,
            Silicone: 0,
            Box: 0,
            ValorParcelas: parseFloat($("#valor-total-parcela").text()) || 0,
            Parcelas: parseInt($("#parcelas-input").val()) || 0,
            ParcelasPagas: 0,
            PorcentagemLucro: parseFloat($("#porcentagem-lucro-input").val()) || 0,
            PorcentagemParcela: parseFloat($("#porcentagem-parcela-input").val()) || 0,
            PorcentagemDesconto: parseFloat($("#porcentagem-desconto-input").val()) || 0,
            MaoDeObra: parseFloat($("#MaoDeObra").val()) || 0
        };

        // AJAX que envia para o controller do orçamento
        $.ajax({
            type: "POST",
            url: saveUrl,
            data: JSON.stringify(dto),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: res.message,
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        // redireciona para a home depois de salvar
                        window.location.href = '/Home/Index';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ops...',
                        text: res.message,
                        confirmButtonText: 'Ok'
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Ocorreu um erro na requisição.',
                    confirmButtonText: 'Ok'
                });
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

    let porcentagem = document.getElementById("porcentagem-lucro-input").value;
    porcentagem /= 100;
    porcentagem += 1;

    let porcentagemParcelas = document.getElementById("porcentagem-parcela-input").value;
    porcentagemParcelas /= 100;
    porcentagemParcelas += 1;


    total30pct += parseFloat(document.getElementById("MaoDeObra").value) || 0;



    $("#tabelaSelecionados tbody tr").each(function () {
        let precoText = $(this).find(".preco-item").text().trim();
        let preco = parseFloat(precoText.replace(",", ".")) || 0;
        let qtde = parseInt($(this).find(".qtde").val() || 0);
        total += preco * qtde;
    });

    total30pct += total * porcentagem;

    total30pct -= (total30pct * (parseFloat(document.getElementById("porcentagem-desconto-input").value) || 0)) / 100;

    if (parcelas > 1) {
        total30pct *= porcentagemParcelas;
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
    let total = parseFloat(document.getElementById("total-input").value) || 0;
    let parcelas = parseInt(document.getElementById("parcelas-input").value) || 0;
    let parcelasPagas = parseInt(document.getElementById("parcelas-pagas-input").value) || 0;
    let valorPago = parseFloat(document.getElementById("valor-pago-input").value) || 0;

    let parcelasAPagar = parcelas - parcelasPagas;
    let valorAPagar = total - valorPago;

    if (valorAPagar < 0) {
        valorAPagar = 0;
    }

    let valor = 0;
    if (parcelasAPagar > 0) {
        valor = valorAPagar / parcelasAPagar;
    }

    if (isNaN(valor) || !isFinite(valor)) {
        valor = 0;
    }

    document.getElementById("valor-parcelas-input").value = valor.toFixed(2);
    if (valor == 0) {
        document.getElementById("Status").value = "Concluído"
    }
}


function reduzTotal() {
    let total = 0;
    let totalFinal = 0;
    let precoParcelas = 0;

    // Soma os valores da tabela (vidros e itens juntos)
    $("#tabelaItens tbody tr").each(function () {
        const $tr = $(this);

        // Quantidade
        const qtde = parseInt($tr.find("td:eq(2)").text().trim()) || 0;

        // Preço - trata R$ e formatação
        const precoText = $tr.find("td:eq(3)").text().trim();
        const preco = parseFloat(precoText.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;

        total += preco * qtde;
    });

    
    // Lucro
    let porcentagem = parseFloat(document.getElementById("porcentagem-lucro-input").value) || 0;
    porcentagem = (porcentagem / 100) + 1;
    total *= porcentagem;

    // Desconto
    let desconto = parseFloat(document.getElementById("porcentagem-desconto-input").value) || 0;
    total -= (total * desconto) / 100;

    // Parcelas
    let parcelas = parseFloat(document.getElementById("parcelas-input").value) || 1;
    let porcentagemParcelas = parseFloat(document.getElementById("porcentagem-parcela-input").value) || 0;
    porcentagemParcelas = (porcentagemParcelas / 100) + 1;

    if (parcelas > 1) {
        total *= porcentagemParcelas;
    }

    precoParcelas = total / parcelas;

    // Impede valores negativos
    if (total < 0) total = 0;
    if (precoParcelas < 0) precoParcelas = 0;


    // Adiciona mão de obra
    total += parseFloat(document.getElementById("MaoDeObra").value) || 0;

    // Atualiza os campos de saída (você pode adaptar os IDs conforme sua interface)
    document.getElementById("total-input").value = total.toFixed(2);



    // Se quiser exibir outros valores como na outra função:
    $("#valorTotal").text((total).toFixed(2)); // valor base antes dos acréscimos
    $("#valor-total-pct").text(total.toFixed(2)); // total com lucro e parcelas
    $("#valor-total-parcela").text(precoParcelas.toFixed(2)); // valor por parcela

    // Se ainda precisar, pode manter:
    calculaValorParcela();
}



function somarValor(parcela) {
    const valorPagoInput = document.getElementById("valor-pago-input");
    const adicionarValorInput = document.getElementById("adicionar-valor");
    const parcelasPagasInput = document.getElementById("parcelas-pagas-input");

    let valorPago = parseFloat(valorPagoInput.value.replace(",", ".")) || 0;
    let adicionar = 0;

    if (parcela === 1) {
        // pega o valor da parcela diretamente
        const valorParcelas = document.getElementById("valor-parcelas-input");
        adicionar = parseFloat(valorParcelas.value.replace(",", ".")) || 0;

        // aumenta a quantidade de parcelas pagas em 1
        let parcelasPagas = parseInt(parcelasPagasInput.value) || 0;
        parcelasPagasInput.value = parcelasPagas + 1;
    } else {
        // pega o valor digitado no campo "adicionar valor"
        adicionar = parseFloat(adicionarValorInput.value.replace(",", ".")) || 0;
    }

    // soma os valores
    let novoValor = valorPago + adicionar;

    // atualiza o input de valor pago
    valorPagoInput.value = novoValor.toFixed(2);

    // limpa o campo adicionar
    adicionarValorInput.value = "0";

    // recalcula parcelas
    calculaValorParcela();
}



//botao salvar do visualizar clientes do clientes
$(document).ready(function () {
    $("#form-crud-usuario").on("submit", function (e) {
        e.preventDefault(); // impede o form de recarregar a página

        $.ajax({
            url: '/Clientes/CrudUsuario',
            type: 'POST',
            data: $(this).serialize(), // pega todos os inputs do form
            success: function (res) {
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: res.message
                    }).then(() => {
                        // redireciona para a página de clientes
                        window.location.href = '/Clientes/Index';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: res.message
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Ocorreu um erro na requisição.'
                });
            }
        });
    });
});


//botao remover do index de clientes
$(".btn-remover-cliente").on("click", function (e) {
    e.preventDefault();
    let cpf = $(this).data("cpf");
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá desfazer essa ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/Clientes/DeleteUsuario',
                type: 'POST',
                data: { CPF: cpf },
                success: function (res) {
                    if (res.success) location.reload();
                    else Swal.fire('Erro!', res.message, 'error');
                },
                error: function () { Swal.fire('Erro!', 'Não foi possível remover o cliente.', 'error'); }
            });
        }
    });
});



//sweetalertt para o botão de remover do visualizar pediddo
$(".btn-remover-item, .btn-remover-vidro").on("click", function (e) {
    e.preventDefault();
    let id = $(this).data("id");
    let tipo = $(this).data("tipo");
    let url = tipo === "vidro" ? '/Pedidos/DeleteVidro' : '/Pedidos/DeleteItem';

    Swal.fire({
        title: 'Tem certeza?',
        text: "Esse registro será removido!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: url,
                type: 'POST',
                data: { Id: id },
                success: function (res) {
                    if (res.success) location.reload();
                    else Swal.fire('Erro!', res.message, 'error');
                },
                error: function () { Swal.fire('Erro!', 'Não foi possível remover o registro.', 'error'); }
            });
        }
    });
});


$(".btn-remover-material").on("click", function (e) {
    e.preventDefault();

    let id = $(this).data("id");

    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá desfazer essa ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/Materiais/DeleteMaterial',
                type: 'POST',
                data: { Id: id },
                success: function (res) {
                    if (res.success) location.reload();
                    else Swal.fire('Erro!', res.message, 'error');
                },
                error: function () {
                    Swal.fire('Erro!', 'Não foi possível remover o material.', 'error');
                }
            });
        }
    });
});


$(document).ready(function () {
    $("#form-crud-material").on("submit", function (e) {
        e.preventDefault(); // evita o reload da página

        $.ajax({
            url: '/Materiais/CrudMaterial',
            type: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: res.message,
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        // redireciona para a página de materiais
                        window.location.href = '/Materiais/Index';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: res.message
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Ocorreu um erro ao salvar o material.'
                });
            }
        });
    });
});


$(document).ready(function () {
    $("#form-crud-pedido").on("submit", function (e) {
        e.preventDefault(); // bloqueia envio imediato

        Swal.fire({
            title: 'Deseja salvar este pedido?',
            text: "As alterações serão registradas.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, salvar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // envia de verdade
                $.ajax({
                    url: '/Pedidos/CrudPedido',
                    type: 'POST',
                    data: $(this).serialize(),
                    success: function (res) {
                        if (res.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Sucesso!',
                                text: res.message,
                                confirmButtonText: 'Ok'
                            }).then(() => {
                                window.location.href = '/Pedidos/Index';
                            });
                        } else {
                            Swal.fire('Erro!', res.message, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Erro!', 'Não foi possível salvar o pedido.', 'error');
                    }
                });
            }
        });
    });
});

function formatarValor(el) {
    if (el.value) {
        // garante que vírgula seja tratada como ponto
        let valor = el.value.replace(',', '.');

        // converte para float e força 2 casas
        valor = parseFloat(valor).toFixed(2);

        // agora coloca de volta no input (com ponto, porque é number)
        el.value = valor;
    }
}








// formata CPF enquanto o usuário digita e valida a máscara 000.000.000-00
window.verificaCPF = function () {
    const input = document.getElementById("cpf") || document.getElementById("CPF");
    const erro = document.getElementById("erroCPF");
    if (!input) return false;

    // valor atual e posição do cursor
    const rawValue = input.value || "";
    const selectionStart = input.selectionStart || 0;

    // quantos dígitos havia antes do cursor (usado para recomputar caret)
    const digitsBeforeCursor = (rawValue.slice(0, selectionStart).match(/\d/g) || []).length;

    // pega apenas os dígitos e limita a 11 (CPF)
    const digits = rawValue.replace(/\D/g, "").slice(0, 11);

    // monta a string formatada progressivamente
    let formatted = "";
    if (digits.length > 0) {
        // 3 primeiros
        formatted += digits.substring(0, Math.min(3, digits.length));
        // ponto e próximos 3
        if (digits.length > 3) {
            formatted += "." + digits.substring(3, Math.min(6, digits.length));
        }
        // segundo ponto e próximos 3
        if (digits.length > 6) {
            formatted += "." + digits.substring(6, Math.min(9, digits.length));
        }
        // traço e últimos 2
        if (digits.length > 9) {
            formatted += "-" + digits.substring(9, Math.min(11, digits.length));
        }
    }

    // calcula nova posição do cursor a partir de quantos dígitos estavam antes
    let newCaret = 0;
    if (digitsBeforeCursor === 0) {
        newCaret = 0;
    } else {
        let counted = 0;
        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) counted++;
            newCaret++;
            if (counted >= digitsBeforeCursor) break;
        }
        // se contei menos (ex: digitou pro final), posiciona no final
        if (counted < digitsBeforeCursor) newCaret = formatted.length;
    }

    // atualiza o valor e a posição do cursor
    input.value = formatted;
    try { input.setSelectionRange(newCaret, newCaret); } catch (e) { /* alguns browsers podem falhar se não focado */ }

    // validação simples da máscara completa
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (!erro) {
        // sem elemento de erro: apenas retorna booleano
        return regex.test(formatted);
    }

    // comportamento UX:
    if (formatted === "") {
        erro.textContent = "";
        input.classList.remove("is-valid", "is-invalid");
        return false;
    }

    if (regex.test(formatted)) {
        erro.textContent = "";
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        return true;
    } else {
        // se já tiver 11 dígitos mas algo deu errado (improvável), mostra erro.
        erro.textContent = "Formato inválido, use o formato 000.000.000-00.";
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
};


// formata telefone enquanto digita e valida máscara com DDD
window.verificaTelefone = function () {
    const input = document.getElementById("telefone") || document.getElementById("Telefone");
    const erro = document.getElementById("erroTelefone"); // opcional, crie um span com esse id
    if (!input) return false;

    const raw = input.value || "";
    const selStart = input.selectionStart || 0;
    const digitsBeforeCursor = (raw.slice(0, selStart).match(/\d/g) || []).length;

    // mantem só dígitos e limita a 11
    const digits = raw.replace(/\D/g, "").slice(0, 11);

    // monta formatação
    let formatted = "";
    if (digits.length > 0) {
        // DDD (2 dígitos) sempre
        if (digits.length <= 2) {
            formatted = "(" + digits;
        } else {
            formatted = "(" + digits.slice(0, 2) + ") ";

            const rest = digits.slice(2);
            if (rest.length <= 4) {
                formatted += rest;
            } else if (rest.length <= 8) {
                // formato com 4 dígitos no final (fixo)
                formatted += rest.slice(0, 4) + "-" + rest.slice(4);
            } else {
                // quando o rest tem 9 dígitos -> celular 5+4
                formatted += rest.slice(0, 5) + "-" + rest.slice(5, 9);
            }
        }
    }

    // calcula caret new position baseado em quantos dígitos existiam antes do cursor
    let newCaret = 0;
    if (digitsBeforeCursor === 0) {
        newCaret = 0;
    } else {
        let counted = 0;
        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) counted++;
            newCaret++;
            if (counted >= digitsBeforeCursor) break;
        }
        if (counted < digitsBeforeCursor) newCaret = formatted.length;
    }

    input.value = formatted;
    try { input.setSelectionRange(newCaret, newCaret); } catch (e) { /* ignora */ }

    // validação de máscara: (##) ####-#### ou (##) #####-####
    const regex10 = /^\(\d{2}\)\s\d{4}-\d{4}$/;
    const regex11 = /^\(\d{2}\)\s\d{5}-\d{4}$/;

    if (!erro) {
        return regex10.test(formatted) || regex11.test(formatted);
    }

    if (formatted === "") {
        erro.textContent = "";
        input.classList.remove("is-valid", "is-invalid");
        return false;
    }

    if (regex10.test(formatted) || regex11.test(formatted)) {
        erro.textContent = "";
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        return true;
    } else {
        erro.textContent = "Telefone inválido. Use (00) 0000-0000 ou (00) 00000-0000.";
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
};


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-crud-usuario");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        // 1) validação nativa (required, pattern, etc.)
        if (!form.checkValidity()) {
            event.preventDefault();
            // mostra mensagens nativas do navegador
            form.reportValidity();
            const primeiroInvalido = form.querySelector(":invalid");
            if (primeiroInvalido) {
                primeiroInvalido.scrollIntoView({ behavior: "smooth", block: "center" });
                primeiroInvalido.focus();
            }
            return;
        }

        // 2) validações custom (chama as suas funções, que devem retornar true/false)
        // - usa fallback true caso a função não exista (para não bloquear o envio)
        const cpfOK = (typeof window.verificaCPF === "function") ? window.verificaCPF() : true;
        const telOK = (typeof window.verificaTelefone === "function") ? window.verificaTelefone() : true;

        if (!(cpfOK && telOK)) {
            // impede envio e foca no primeiro elemento com erro
            event.preventDefault();
            const primeiroErro = form.querySelector(".is-invalid") || form.querySelector(":invalid");
            if (primeiroErro) {
                primeiroErro.scrollIntoView({ behavior: "smooth", block: "center" });
                // tenta focar (alguns elementos podem não aceitar focus)
                try { primeiroErro.focus(); } catch (e) { /* ignore */ }
            }
            return;
        }
    });
});

//event listener pra ajustar o valor dos campos das porcentagens


document.addEventListener("DOMContentLoaded", function () {
    const desconto = document.getElementById("porcentagem-desconto-input");
    if (!desconto) {
        console.warn("Elemento #meuCampo não encontrado");
        return;
    }

    desconto.addEventListener("blur", () => {
        let valor = desconto.value;
        valor = valor.trim();
        if (valor === "") {
            desconto.value = "0.00";
            return;
        }

        // Substituir vírgula por ponto para parse
        valor = valor.replace(",", ".");
        let num = parseFloat(valor);
        if (isNaN(num)) {
            desconto.value = "0.00";
        } else {
            desconto.value = num.toFixed(2);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const desconto = document.getElementById("porcentagem-lucro-input");
    if (!desconto) {
        console.warn("Elemento #meuCampo não encontrado");
        return;
    }

    desconto.addEventListener("blur", () => {
        let valor = desconto.value;
        valor = valor.trim();
        if (valor === "") {
            desconto.value = "0.00";
            return;
        }

        // Substituir vírgula por ponto para parse
        valor = valor.replace(",", ".");
        let num = parseFloat(valor);
        if (isNaN(num)) {
            desconto.value = "0.00";
        } else {
            desconto.value = num.toFixed(2);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const desconto = document.getElementById("porcentagem-parcela-input");
    if (!desconto) {
        console.warn("Elemento #meuCampo não encontrado");
        return;
    }

    desconto.addEventListener("blur", () => {
        let valor = desconto.value;
        valor = valor.trim();
        if (valor === "") {
            desconto.value = "0.00";
            return;
        }

        // Substituir vírgula por ponto para parse
        valor = valor.replace(",", ".");
        let num = parseFloat(valor);
        if (isNaN(num)) {
            desconto.value = "0.00";
        } else {
            desconto.value = num.toFixed(2);
        }
    });
});


async function devolveJsonMateriais() {
    const response = await fetch('/Orcamento/GetMateriais');
    const materiais = await response.json();
    return materiais;
}

//orcamento
async function atualizarTabelaMateriais() {
    const response = await fetch('/Orcamento/GetMateriais');
    const materiais = await response.json();

    const tbody = document.querySelector('#tabelaMateriais tbody');
    tbody.innerHTML = ''; // limpa linhas antigas

    materiais.forEach(m => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', m.Id);
        tr.setAttribute('data-nome', m.Nome);
        tr.setAttribute('data-cor', m.Cor);
        tr.setAttribute('data-preco', m.Preco);

        tr.innerHTML = `
            <td>${m.Nome}</td>
            <td>${m.Cor}</td>
            <td>${m.Preco}</td>
            <td><button class="btn-add">Adicionar</button></td>
        `;

        tbody.appendChild(tr);
    });
}


async function atualizarDropdownVidro() {

    let val = document.getElementById("VidroId").value;

    const response = await fetch('/Orcamento/GetVidros');
    const vidros = await response.json();

    const select = document.getElementById('VidroId');
    select.innerHTML = ''; // limpa opções antigas
    

    vidros.forEach(v => {
        const option = document.createElement('option');
        option.value = v.Id;
        option.setAttribute('data-tipo', v.Nome);
        option.setAttribute('data-cor', v.Cor);
        option.setAttribute('data-preco', v.Preco);
        option.textContent = `${v.Nome} (${v.Cor})`;

        select.appendChild(option);
    });

    document.getElementById("VidroId").value = val;

    // dispara suas funções de onchange, caso queira atualizar campos automaticamente
    if (select.onchange) select.onchange();
}

async function atualizarDropdownCliente() {
    let val = document.getElementById("clienteCPF").value;

    const response = await fetch('/Orcamento/GetClientes');
    const clientes = await response.json();

    const select = document.getElementById('clienteCPF');
    select.innerHTML = ''; // limpa opções antigas

    // Recria a opção "-----------"
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "-----------";
    select.appendChild(defaultOption);

    // Adiciona os clientes
    clientes.forEach(v => {
        const option = document.createElement('option');
        option.value = v.CPF;
        option.setAttribute('data-nome', v.Nome);
        option.setAttribute('data-CPF', v.CPF);
        option.textContent = `${v.Nome} (${v.CPF})`;

        select.appendChild(option);
    });

    // Restaura valor anterior (caso ainda exista)
    if (val !== "") {
        select.value = val;
    }

    // Dispara evento onchange, se necessário
    if (select.onchange) select.onchange();
}


function adicionarItem(id) {
    $.get("/Orcamento/GetItem", { id: id }, function (data) {
        let existing = $("#tabelaSelecionados tbody tr[data-id='" + data.id + "']");
        if (existing.length) {
            let q = parseInt(existing.find(".qtde").val() || 0) + 1;
            existing.find(".qtde").val(q);
            recalculaTotal();
            return;
        }

        let novaLinha = $("<tr>")
            .attr("data-id", data.id)
            .append($("<td>").text(data.nome))
            .append($("<td>").text(data.cor))
            .append($("<td>").addClass("preco-item").text(data.preco))
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
}
