function verificarMaisResultados(){
    if (proximapagina){
        $("#botaoMaisResultados").removeClass("d-none");
    }
    else{
        $("#botaoMaisResultados").addClass("d-none");
    }
}


// Função de Listar personagens, "appending" na região dos resultados, apartir da lista de resultados.
//  pode aceitar como segunda argumento a letra "s", para substituir o resultado ja existente
function ListarPersonagens(resultados,f){
    var parte1html = `<button type="button" data-bs-toggle="modal" data-bs-target="#perfilModal" onclick='carregarPerfil("`;
    var parte2html = `")'><div class='list-group-item d-flex align-items-center'><div class='col-9'><h4 class='mb-0 fw-bolder'>`;
    var parte3html = "</h4><p class='mb-0'>Status: ";
    var parte4html = "</p><p class='mb-0 fst-italic'>Gênero: ";
    var parte5html = "</p></div><div class='col-3'><img class='img-fluid perfil' src=";
    var parte6html = "></div></div></button>";
    if (f == "s"){
        $("#resultados").html("")
    }
    for (var i =0; i < resultados.length; i++){
        switch (resultados[i].status){
            case "Alive":
                parte3html = "</h4><p class='mb-0 alive'>Status: ";
                break;
            case "Dead":
                parte3html = "</h4><p class='mb-0 dead'>Status: ";
                break;
            case "unknown":
                parte3html = "</h4><p class='mb-0 unknown'>Status: ";
        }
        resultados[i].name =resultados[i].name.replace("'", "’");
        $("#resultados").append(parte1html + resultados[i].id + parte2html + resultados[i].name + parte3html + resultados[i].status + parte4html + resultados[i].gender + parte5html + resultados[i].image + parte6html);
    }
    verificarMaisResultados();
}

// Função para exibir a listagem de personagens inicialmente ao abrir a página principal
$(document).ready(function(){
    $.getJSON('https://rickandmortyapi.com/api/character', function(json){
        proximapagina = json.info.next; //Definição de variavel global para uso do carregar mais resultados
        ListarPersonagens(json.results)
    });
});


function carregarMaisResultados(){
    $.getJSON(proximapagina, function(json){
        proximapagina = json.info.next;
        ListarPersonagens(json.results)
    });
}


// Função de pesquisar de acordo com as informações colocadas no formulário
function pesquisar(){
    // Definição de variaveis a serem utilizadas pelas funções
    var status = false;
    var genero = false;
    var nome = false;
    url = "https://rickandmortyapi.com/api/character/?";

    // Validação dos valores a serem pegos do documento HTML
    if (document.querySelector("input[name='status']:checked")){
        status = document.querySelector("input[name='status']:checked").value;
    }

    if (document.querySelector("input[name='genero']:checked")){
        genero = document.querySelector("input[name='genero']:checked").value;
    }

    if (document.querySelector("#nomePesquisa")){
        nome = document.querySelector("#nomePesquisa").value;
    }

    // Condições para a existência das variaveis, e modificadores do url a ser utilizado pelo getJSON
    if (nome){
        url = url + "name=" + nome + "&";
    }
    if (genero){
        url = url + "gender=" + genero + "&";
    }
    if (status){
        url = url + "status=" + status + "&";
    }
    $.getJSON(url, function(json){
        proximapagina = json.info.next;
        ListarPersonagens(json.results, "s");
    })
    // Em caso de falha ao filtrar a resposta mostra um alerta
    .fail(function(){
        proximapagina = null;
        $("#botaoMaisResultados").addClass("d-none");
        return $("#resultados").html('<div class="list-group-item m-2"><h1 class="display-3" style="font-family: Rick and Morty Font;">Nenhum resultado encontrado</h1></div>')}); // TODO
}


function carregarPerfil(idPerfil){
    $("#perfilContainer").addClass("spinner-border");
    $("#perfilRow").addClass("visually-hidden");
    $.getJSON("https://rickandmortyapi.com/api/character/" + idPerfil, function(json){
        //Gerar o modal do perfil
        var objeto = json;
        var parte1html = '<div class="modal-dialog"><div class="modal-content text-center"><div class="modal-header"><h2 class="modal-title" id="exampleModalLabel">';
        var parte2html = '</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div id="perfilContainer" class="container-fluid"><div id="perfilRow" class="row justify-content-center"><div class="col-10"><img class="perfil img-fluid" src="';
        var parte3html = '"><h4>';
        var parte4html = '</h4></div><div class="col-10" id="detalhes"><p class="fw-bold d-inline">Espécie: </p><p class="d-inline">';
        var parte5html = '</p><br><p class="fst-italic fw-bold d-inline">Gênero: </p><p class="d-inline fst-italic">';
        var parte6html = '</p><br><p class="fw-bold d-inline">Origem: </p><p class="d-inline">';
        var parte7html = '</p><br><p class="fw-bold d-inline">Visto pela ultima vez em: </p><p class="d-inline">';
        var parte8html = '</p></div><div class="col-6"><table class="table table-hover"><thead><tr><th>Lista de Episodios (Total:';
        var parte9html = ')</th></tr></thead><tbody id="episodios"></tbody></table></div></div></div></div></div></div>';
        switch (objeto.status){
            case "Alive":
                parte3html = '"><h4 class="alive m-1">';
                break;
            case "Dead":
                parte3html = '"><h4 class="dead m-1">';
                break;
            case "unknown":
                parte3html = '"><h4 class="unknown m-1">';
        }
        var paginaPerfil = parte1html + objeto.name + parte2html + objeto.image + parte3html + objeto.status + parte4html + objeto.species + parte5html + objeto.gender + parte6html + objeto.origin.name + parte7html + objeto.location.name + parte8html + objeto.episode.length + parte9html;
        $("#perfilModal").html(paginaPerfil);
        for (var j = 0; j < objeto.episode.length; j++){
            if(objeto.episode[j]){
                var ep = objeto.episode[j].slice(40);
                $("#episodios").append('<tr><td class="p-1">Episódio ' + ep +'</td></tr>');
            }
        }
    });
}