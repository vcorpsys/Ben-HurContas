var nome = document.getElementById('nome');
var valor = document.getElementById('valor');
var dolar = document.getElementById('dolar');
var linha = document.getElementById('linha');
var total = document.getElementById('total');
var totalR = document.getElementById('totalR');

var eid = document.getElementById('eid');
var enome = document.getElementById('enome');
var evalor = document.getElementById('evalor');

var obrigacao = document.getElementById('obrigacao');

function preparaCadastro() {
	nome.value = retornaData();
	dolar.value = '';
	valor.value = '';
}

function retornaData() {
	var data = new Date();

	var dia = data.getDate();
	var mes = data.getMonth()+1;
	var ano = data.getFullYear();

	var dia_semana = parseInt(data.getDay());
	var nome_dia = 'Dia';
	switch(dia_semana) {
		case 0: nome_dia = 'Dom'; break;
		case 1: nome_dia = 'Seg'; break;
		case 2: nome_dia = 'Ter'; break;
		case 3: nome_dia = 'Qua'; break;
		case 4: nome_dia = 'Qui'; break;
		case 5: nome_dia = 'Sex'; break;
		case 6: nome_dia = 'Sáb'; break;
		default: nome_dia = 'Dia';
	}

	var str_data = dia+'/'+mes+'/'+ano+': '+nome_dia;
	str_data = str_data.toString().trim();
	return str_data;
}

function cadastrar() {
	var Nome = nome.value.toString().trim();
	if(Nome.toString().trim().length <= 0) Nome = 'Sem nome';
	var Valor = valor.value.toString().trim();

	var Dolar = dolar.value.toString().trim();
	if(Dolar.toString().trim().length <= 0) Dolar = '0';
	Dolar = Dolar.replace(',', '.');

	Dolar = Number(Dolar);
	if(Dolar>0) {
		var cotacao = retornaDolar();
		Valor = parseFloat(Dolar * cotacao).toFixed(2);
	}

	if(Valor.toString().trim().length <= 0) Valor = '0';
	Valor = Valor.replace(',', '.');

	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-entradas");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objObrigacoes = {Nome: Nome, Valor: Valor};
	objJSON.push(objObrigacoes);
	localStorage.setItem('ben-hur-contas-entradas', JSON.stringify(objJSON));
	selecionar();
}

function selecionarUm(index=-1) {
	var Nome = document.getElementById('nome_'+index).innerText.toString().trim();
	var Valor = document.getElementById('valor_'+index).innerText.replace('R$ ', '').toString().trim();
	eid.value = parseInt(index);
	enome.value = Nome;
	evalor.value = Valor;
}

function editar() {
	var Id = parseInt(eid.value);
	var Nome = enome.value.toString().trim();
	if(Nome.toString().trim().length <= 0) Nome = 'Sem nome';
	var Valor = evalor.value.toString().trim();
	if(Valor.toString().trim().length <= 0) Valor = '0';
	Valor = Valor.replace(',', '.');

	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-entradas");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objObrigacoes = {Nome: Nome, Valor: Valor};
	objJSON[Id] = objObrigacoes;
	localStorage.setItem('ben-hur-contas-entradas', JSON.stringify(objJSON));
	selecionar();
}

function deletar() {
	localStorage.setItem('ben-hur-contas-entradas', "");
	selecionar();
}

function selecionarDel(index=-1) {
	var Nome = document.getElementById('nome_'+index).innerText.toString().trim();
	did.value = parseInt(index);
	obrigacao.innerText = Nome;
}

function deletarUM() {
	var Id = parseInt(did.value);

	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-entradas");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objJSON.splice(Id, 1);
	localStorage.setItem('ben-hur-contas-entradas', JSON.stringify(objJSON));
	selecionar();	
}

selecionar();
function selecionar() {
	var soma = 0;
	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-entradas");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	var linha = "";
	var i=0;
	objJSON.forEach((item) => {
		if(item.Valor.toString().trim().length <= 0)
			item.Valor = 0;

		soma += parseFloat(item.Valor);
		linha += 
		"<tr>" +
			"<td id='nome_" + i + "' style='word-wrap: break-word; word-break: break-all;'>" + item.Nome + "</td>" +
			"<td id='valor_" + i + "'>R$ " + item.Valor + "</td>" +
			"<td align='right'><button type='button' class='btn btn-primary' onclick='selecionarUm(" + i + ")' data-toggle='modal' data-target='#modalEditar'>e</button>" +
			"<button type='button' class='btn btn-danger' data-toggle='modal' onclick='selecionarDel(" + i + ")' data-target='#modalDeletar'>x</button></td>" +
		"</tr>";
		i++;
	});
	linhas.innerHTML = linha;
	soma = Math.abs(soma);
	soma = soma.toFixed(2);
	total.innerText = 'TOTAL: R$ ' + soma;

	var Restante = parseFloat(retornaObrigacoes())-(parseFloat(soma)-parseFloat(retornaSaidas()));
	Restante = Restante.toFixed(2);
	if(Restante <= 0)
		totalR.innerText = 'OBJETIVO CONCLUÍDO';
	else
		totalR.innerText = 'FALTAM: R$ ' + Math.abs(Restante);

	if(Restante < 0)
		totalR.innerText = 'OBJETIVO CONCLUÍDO - LUCRO: R$ ' + Math.abs(Restante);
}

function retornaSaidas() {
	var soma = 0;
	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-saidas");
	if(banco) {
	  objJSON = JSON.parse(banco.toString());
	}

	objJSON.forEach((item) => {
	  if(item.Valor.toString().trim().length <= 0)
	    item.Valor = 0;
	  soma += parseFloat(item.Valor);
	});
	soma = Math.abs(soma);
	return soma;
}

function retornaObrigacoes() {
	var soma = 0;
	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-obrigacoes");
	if(banco) {
	  objJSON = JSON.parse(banco.toString());
	}

	objJSON.forEach((item) => {
	  if(item.Valor.toString().trim().length <= 0)
	    item.Valor = 0;
	  var marcacao = parseInt(item.Marcado);
	  if(marcacao <= 0) soma += parseFloat(item.Valor);
	});
	soma = Math.abs(soma);
	return soma;
}

cotacaoDolar();
function cotacaoDolar() {
	var real = 3.6440;
	var uri = 'https://economia.awesomeapi.com.br/all/USD-BRL';
	$.ajax({
		url: uri,
		method: "GET",
		dataType: "JSON",
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type':'application/json'
		},
		crossDomain: false,
		complete: function(xml) {
			var text = xml.responseText;
			if(text == undefined) {
				document.getElementById('cotacao').innerText = parseFloat(real).toFixed(2);
			}else {
				var json = JSON.parse(text);
				real = json.USD.low.toString().trim().replace(',', '.');
				real = parseFloat(real).toFixed(2);
				document.getElementById('cotacao').innerText = real;
			}
	 	}
	});
}

function retornaDolar() {
	var cotacao = Number(document.getElementById('cotacao').innerText);
	return cotacao;
}
