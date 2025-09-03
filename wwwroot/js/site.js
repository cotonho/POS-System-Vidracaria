// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const abrir = document.getElementById('botao_clientes');
const fechar = document.getElementById('fechar');
const painel = document.getElementById('painel');

abrir.addEventListener('click', () => {
    painel.classList.add('ativo');
});

fechar.addEventListener('click', () => {
    painel.classList.remove('ativo');
});

$(document).ready(function () {
    $('.table').DataTable();
});