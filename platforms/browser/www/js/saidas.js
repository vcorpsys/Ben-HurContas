var nome = document.getElementById('nome');
var valor = document.getElementById('valor');
var linha = document.getElementById('linha');
var total = document.getElementById('total');

var eid = document.getElementById('eid');
var enome = document.getElementById('enome');
var evalor = document.getElementById('evalor');

var bnome = document.getElementById('bnome');
var bvalor = document.getElementById('bvalor');

var obrigacao = document.getElementById('obrigacao');
var valorAntigo = '0';
var nomeDel = '';
var valorDel = 0;

function preparaBaixa() {
	preencheObrigacoes();
	bnome.value = '';
	bvalor.value = '';	
}

function deletarBaixa() {
	darBaixa(nomeDel, '0', valorDel);
}

function limparBaixa() {
	var recJSON = [];
	var bancoRec = localStorage.getItem("shehur-contas-obrigacoes-backup");
	if(bancoRec) {
		recJSON = JSON.parse(bancoRec.toString());
	}	

	var objJSON = [];
	var banco = localStorage.getItem("shehur-contas-obrigacoes");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	localStorage.setItem('shehur-contas-obrigacoes', JSON.stringify(recJSON));
	selecionar();
}

function darBaixa(_Nome='', _Valor='', valorAntigo='') {
	if(_Nome.toString().trim().length <= 0) var Nome2 = bnome.value.toString().trim();
	else var Nome2 = _Nome.toString().trim();
	if(Nome2.toString().trim().length <= 0) Nome2 = 'Sem nome';

	if(_Valor.toString().trim().length <= 0) var Valor2 = parseFloat(bvalor.value.toString().trim().replace(',', '.'));
	else var Valor2 = parseFloat(_Valor.toString().trim());
	if(Valor2 <= 0) Valor2 = 0;

    var objJSON = [];
    var banco = localStorage.getItem("shehur-contas-obrigacoes");
    if(banco) {
      objJSON = JSON.parse(banco.toString());
    }

    vet_temp = [];
    objJSON.forEach((item) => {
      var Nome1 = item.Nome.toString().trim();
      var Valor1 = parseFloat(item.Valor);

      var marcacao = parseInt(item.Marcado);

      if(marcacao <= 0) {
      	if(Nome1 == Nome2) {
      		if(valorAntigo.toString().trim().length <= 0) {
      			var Valor = Valor1 - Valor2;
      		}else {
      			valorAntigo = parseFloat(valorAntigo.toString().trim().replace(',', '.'));
      			var Valor = (Valor1 + valorAntigo) - Valor2;
      		}

      		vet_temp.push({Nome: Nome1, Valor: Valor, Marcado: marcacao});
      	}else {
      		vet_temp.push({Nome: Nome1, Valor: Valor1, Marcado: marcacao});
      	}
      }else {
      	vet_temp.push({Nome: Nome1, Valor: Valor1, Marcado: marcacao});
      }
    });

	var objJSON = vet_temp;
	localStorage.setItem('shehur-contas-obrigacoes', JSON.stringify(objJSON));

	// cadastra a saída
	if((_Nome.toString().trim().length <= 0)&&(_Valor.toString().trim().length <= 0)) {
		var Nome = Nome2;
		if(Nome.toString().trim().length <= 0) Nome = 'Sem nome';
		var Valor = Valor2;
		if(Valor.toString().trim().length <= 0) Valor = '0';
		Valor = Valor.toString().trim().replace(',', '.');

		var objJSON = [];
		var banco = localStorage.getItem("shehur-contas-saidas");
		if(banco) {
			objJSON = JSON.parse(banco.toString());
		}

		if(Valor.toString().trim() == 'NaN') Valor = '0';
		objObrigacoes = {Nome: Nome, Valor: Valor};
		objJSON.push(objObrigacoes);
		localStorage.setItem('shehur-contas-saidas', JSON.stringify(objJSON));
		selecionar();
	}
}

function preencheObrigacoes() {
    var objJSON = [];
    var banco = localStorage.getItem("shehur-contas-obrigacoes");
    if(banco) {
      objJSON = JSON.parse(banco.toString());
    }

    var opcoes = '';
    objJSON.forEach((item) => {
      if(item.Nome.toString().trim().length <= 0)
        item.Nome = 'Sem nome';
      var Nome = item.Nome.toString().trim();

      var marcacao = parseInt(item.Marcado);
      if(marcacao <= 0) {
      	opcoes += "<option value='" + Nome + "'>" + Nome + "</option>";
      }
    });
	bnome.innerHTML = opcoes;
}

function preparaCadastro() {
	nome.value = retornaData();
	valor.value = '';
}

function retornaData() {
	var data = new Date();

	var dia = data.getDate();
	var mes = data.getMonth()+1;
	var ano = data.getFullYear();

	var dia_semana = parseInt(data.getDay());
	console.log('dia: ', dia_semana);
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
	if(Valor.toString().trim().length <= 0) Valor = '0';
	Valor = Valor.replace(',', '.');

	var objJSON = [];
	var banco = localStorage.getItem("shehur-contas-saidas");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objObrigacoes = {Nome: Nome, Valor: Valor};
	objJSON.push(objObrigacoes);
	localStorage.setItem('shehur-contas-saidas', JSON.stringify(objJSON));
	selecionar();
	darBaixa(Nome, Valor);
}

function selecionarUm(index=-1) {
	var Nome = document.getElementById('nome_'+index).innerText.toString().trim();
	var Valor = document.getElementById('valor_'+index).innerText.replace('R$ ', '').toString().trim();
	eid.value = parseInt(index);
	enome.value = Nome;
	valorAntigo = Valor;
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
	var banco = localStorage.getItem("shehur-contas-saidas");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objObrigacoes = {Nome: Nome, Valor: Valor};
	objJSON[Id] = objObrigacoes;
	localStorage.setItem('shehur-contas-saidas', JSON.stringify(objJSON));
	selecionar();
	darBaixa(Nome, Valor, valorAntigo);
}

function deletar() {
	localStorage.setItem('shehur-contas-saidas', "");
	selecionar();
	limparBaixa();
}

function selecionarDel(index=-1) {
	var Nome = document.getElementById('nome_'+index).innerText.toString().trim();
	did.value = parseInt(index);
	nomeDel = Nome;
	valorDel = document.getElementById('valor_'+index).innerText.replace('R$ ', '').toString().trim();
	valorDel = parseFloat(valorDel.replace(',', '.'));
	obrigacao.innerText = Nome;
}

function deletarUM() {
	var Id = parseInt(did.value);

	var objJSON = [];
	var banco = localStorage.getItem("shehur-contas-saidas");
	if(banco) {
		objJSON = JSON.parse(banco.toString());
	}

	objJSON.splice(Id, 1);
	localStorage.setItem('shehur-contas-saidas', JSON.stringify(objJSON));
	selecionar();
	deletarBaixa();
}

selecionar();
function selecionar() {
	var soma = 0;
	var objJSON = [];
	var banco = localStorage.getItem("shehur-contas-saidas");
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
}
