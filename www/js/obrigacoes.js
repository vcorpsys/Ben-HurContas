var nome = document.getElementById('nome');
var valor = document.getElementById('valor');
var linha = document.getElementById('linha');
var total = document.getElementById('total');

var eid = document.getElementById('eid');
var enome = document.getElementById('enome');
var evalor = document.getElementById('evalor');

var obrigacao = document.getElementById('obrigacao');

function preparaCadastro() {
	nome.value = '';
	valor.value = '';
}

function cadastrar() {
	var Nome = nome.value.toString().trim();
	if(Nome.toString().trim().length <= 0) Nome = 'Sem nome';
	var Valor = valor.value.toString().trim();
	if(Valor.toString().trim().length <= 0) Valor = '0';
	Valor = Valor.replace(',', '.');

	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-obrigacoes");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objObrigacoes = {Nome: Nome, Valor: Valor, Marcado: 0};
	objJSON.push(objObrigacoes);
	localStorage.setItem('ben-hur-contas-obrigacoes', JSON.stringify(objJSON));
	localStorage.setItem('ben-hur-contas-obrigacoes-backup', JSON.stringify(objJSON));
	selecionar();
}

function recuperarDados() {
	var recJSON = [];
	var bancoRec = localStorage.getItem("ben-hur-contas-obrigacoes-backup");
	if(bancoRec) {
		recJSON = JSON.parse(bancoRec.toString());
	}	

	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-obrigacoes");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	localStorage.setItem('ben-hur-contas-obrigacoes', JSON.stringify(recJSON));
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
	var banco = localStorage.getItem("ben-hur-contas-obrigacoes");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objObrigacoes = {Nome: Nome, Valor: Valor, Marcado: 0};
	objJSON[Id] = objObrigacoes;
	localStorage.setItem('ben-hur-contas-obrigacoes', JSON.stringify(objJSON));
	selecionar();
}

function deletar() {
	localStorage.setItem('ben-hur-contas-obrigacoes', "");
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
	var banco = localStorage.getItem("ben-hur-contas-obrigacoes");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objJSON.splice(Id, 1);
	localStorage.setItem('ben-hur-contas-obrigacoes', JSON.stringify(objJSON));
	selecionar();	
}

selecionar();
function selecionar() {
	var soma = 0;
	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-obrigacoes");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	var linha = "";
	var i=0;
	objJSON.forEach((item) => {
		if(item.Valor.toString().trim().length <= 0)
			item.Valor = 0;

		var marcacao = parseInt(item.Marcado);
		var str = '';
		if(marcacao > 0) str = 'checked';
		else soma += parseFloat(item.Valor);

		linha += 
		"<tr>" +
			"<td><label class='switch'><input type='checkbox' id='check_" + i + "' onchange='marcar(" + i + ")' " + str + "><span class='slider round'></span></label></td>" +
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
}

function atualizaSoma() {
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
	soma = soma.toFixed(2);
	total.innerText = 'TOTAL: R$ ' + soma;
}

function marcar(index=-1) {
	var Id = parseInt(index);
	var Nome = document.getElementById('nome_'+index).innerText.toString().trim();
	if(Nome.toString().trim().length <= 0) Nome = 'Sem nome';
	var Valor = document.getElementById('valor_'+index).innerText.replace('R$ ', '').toString().trim();
	if(Valor.toString().trim().length <= 0) Valor = '0';
	Valor = Valor.replace(',', '.');

	var check = document.getElementById('check_'+index);
	var Marcado = 0;
	if(check.checked) Marcado = 1;

	var objJSON = [];
	var banco = localStorage.getItem("ben-hur-contas-obrigacoes");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objObrigacoes = {Nome: Nome, Valor: Valor, Marcado: Marcado};
	objJSON[Id] = objObrigacoes;
	localStorage.setItem('ben-hur-contas-obrigacoes', JSON.stringify(objJSON));
	atualizaSoma();
}
