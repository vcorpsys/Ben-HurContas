Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function retornaMinimo() {
  var objJSON = [];
  var banco = localStorage.getItem("shehur-contas-entradas");
  if(banco) {
    objJSON = JSON.parse(banco.toString());
  }

  var vet_temp = [];
  objJSON.forEach((item) => {
    if(item.Valor.toString().trim().length <= 0)
      item.Valor = 0;
    vet_temp.push(parseFloat(item.Valor));
  });

  var minimo = vet_temp.min();
  
  var nome = '';
  objJSON.forEach((item) => {
    if(item.Valor.toString().trim().length <= 0)
      item.Valor = 0;
    
    if(parseFloat(item.Valor) == minimo)
      nome = item.Nome;
  });
  if(nome.toString().trim().length > 0) {
    nome = nome.split('/');
    dia = nome[2].split(': ');
    dia = dia[1];
    nome = nome[0]+'/'+nome[1]+'-'+dia;
  }

  minimo = Math.abs(minimo);
  minimo = minimo.toFixed(0);
  var retorno = minimo;
  if(nome.toString().trim().length > 0)
    retorno = nome+' = R$ '+minimo;
  else
    retorno = 'R$ '+minimo;
  retorno = retorno.replace(': ', '-').trim();

  if((retorno == 'R$ Infinity')||(retorno == 'R$ NaN')) retorno = 'R$ 0';

  return retorno;
}

function retornaMaximo() {
  var objJSON = [];
  var banco = localStorage.getItem("shehur-contas-entradas");
  if(banco) {
    objJSON = JSON.parse(banco.toString());
  }

  var vet_temp = [];
  objJSON.forEach((item) => {
    if(item.Valor.toString().trim().length <= 0)
      item.Valor = 0;
    vet_temp.push(parseFloat(item.Valor));
  });

  var maximo = vet_temp.max();
  
  var nome = '';
  objJSON.forEach((item) => {
    if(item.Valor.toString().trim().length <= 0)
      item.Valor = 0;
    
    if(parseFloat(item.Valor) == maximo)
      nome = item.Nome;
  });
  if(nome.toString().trim().length > 0) {
    nome = nome.split('/');
    dia = nome[2].split(': ');
    dia = dia[1];
    nome = nome[0]+'/'+nome[1]+'-'+dia;
  }

  maximo = Math.abs(maximo);
  maximo = maximo.toFixed(0);
  var retorno = maximo;
  if(nome.toString().trim().length > 0)
    retorno = nome+' = R$ '+maximo;
  else
    retorno = 'R$ '+maximo;
  retorno = retorno.replace(': ', '-').trim();

  if((retorno == 'R$ Infinity')||(retorno == 'R$ NaN')) retorno = 'R$ 0';

  return retorno;
}

function retornaMedia() {
  var objJSON = [];
  var banco = localStorage.getItem("shehur-contas-entradas");
  if(banco) {
    objJSON = JSON.parse(banco.toString());
  }

  var vet_temp = [];
  objJSON.forEach((item) => {
    if(item.Valor.toString().trim().length <= 0)
      item.Valor = 0;
    vet_temp.push(parseFloat(item.Valor));
  });

  var media = 0;
  var soma = 0;
  var count = 0;
  objJSON.forEach((item) => {
    if(item.Valor.toString().trim().length <= 0)
      item.Valor = 0;
    soma += parseFloat(item.Valor);
    count++;
  });
  soma -= retornaSaidas();
  media = Math.round(soma / count);

  media = Math.abs(media);
  media = media.toFixed(0);
  var retorno = media;
  retorno = 'R$ '+media;
  retorno = retorno.trim();

  if((retorno == 'R$ Infinity')||(retorno == 'R$ NaN')) retorno = 'R$ 0';

  return retorno;
}

function retornaSaidas() {
  var soma = 0;
  var objJSON = [];
  var banco = localStorage.getItem("shehur-contas-saidas");
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

function retornaDiasPorSemana() {
  var objJSON = [];
  var banco = localStorage.getItem("shehur-contas-entradas");
  if(banco) {
    objJSON = JSON.parse(banco.toString());
  }

  var seg = 0;
  var ter = 0;
  var qua = 0;
  var qui = 0;
  var sex = 0;
  objJSON.forEach((item) => {
    if(item.Nome.toString().trim().length <= 0)
      item.Nome = '';
    var nome = item.Nome.toString().toLowerCase().trim();

    if((nome.indexOf('seg') >= 0)&&(seg <= 0)) seg++;
    if((nome.indexOf('ter') >= 0)&&(ter <= 0)) ter++;
    if((nome.indexOf('qua') >= 0)&&(qua <= 0)) qua++;
    if((nome.indexOf('qui') >= 0)&&(qui <= 0)) qui++;
    if((nome.indexOf('sex') >= 0)&&(sex <= 0)) sex++;

  });

  var dias = seg+ter+qua+qui+sex;
  if(dias <= 0) dias = 3;
  dias = parseInt(dias);
  dias = Math.abs(dias);
  return dias;  
}

function retornaObrigacoes() {
  var soma = 0;
  var objJSON = [];
  var banco = localStorage.getItem("shehur-contas-obrigacoes");
  if(banco) {
    objJSON = JSON.parse(banco.toString());
  }

  objJSON.forEach((item) => {
    if(item.Valor.toString().trim().length <= 0)
      item.Valor = 0;
    soma += parseFloat(item.Valor);
    //var marcacao = parseInt(item.Marcado);
    //if(marcacao <= 0) soma += parseFloat(item.Valor);
  });

  soma = Math.abs(soma);
  return soma;
}

function retornaMediaDesejada() {
  if(contaEntradas() < 7) {
    return 'em breve';
  }else {
    var obrigacoes = parseFloat(retornaObrigacoes());
    var dias_por_semana = parseFloat(retornaDiasPorSemana())*4;
    var media_desejada = parseFloat(obrigacoes / dias_por_semana);

    media_desejada = Math.abs(media_desejada);
    media_desejada = Math.round(media_desejada);
    media_desejada = media_desejada.toFixed(0);
    media_desejada = 'R$ '+media_desejada;
    return media_desejada;
  }
}

function contaEntradas() {
  var objJSON = [];
  var banco = localStorage.getItem("shehur-contas-entradas");
  if(banco) {
    objJSON = JSON.parse(banco.toString());
  }
  return parseInt(objJSON.length);
}
