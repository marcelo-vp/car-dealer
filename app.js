    (function($) {

    'use strict';

    /*
    Vamos estruturar um pequeno app utilizando módulos.
    Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
    A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
    seguinte forma:
    - No início do arquivo, deverá ter as informações da sua empresa - nome e
    telefone (já vamos ver como isso vai ser feito)
    - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
    um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

    Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
    carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
    aparecer no final da tabela.

    Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
    empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
    Dê um nome para a empresa e um telefone fictício, preechendo essas informações
    no arquivo company.json que já está criado.

    Essas informações devem ser adicionadas no HTML via Ajax.

    Parte técnica:
    Separe o nosso módulo de DOM criado nas últimas aulas em
    um arquivo DOM.js.

    E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
    que será nomeado de "app".
    */

    var app = (function () {

        var $form = $('form');
        var infoList = [
            {
                elem: 'img',
                dataJs: 'image',
            },
            {
                elem: 'span',
                dataJs: 'brandModel',
            },
            {
                elem: 'span',
                dataJs: 'year',
            },
            {
                elem: 'span',
                dataJs: 'plate',
            },
            {
                elem: 'span',
                dataJs: 'color',
            },
        ];

        return {
            init: function init () {
                this.getsCompanyInfo();
                this.getsCarCatalog();
                $form.on('submit', this.addsNewCar);
            },
            assignValuesToElements: function assignValuesToElements(info, elem, value) {
                if (info.elem === 'span') {
                    elem.textContent = value;
                }
                if (info.elem === 'img') {
                    elem.setAttribute('src', value);
                }
            },
            getsCarCatalog: function getsCarCatalog() {
                var ajax = new XMLHttpRequest();
                ajax.open('GET', 'http://localhost:3000/car/');
                ajax.send();
                ajax.addEventListener('readystatechange', function() {
                    if (this.readyState === 4 && this.status === 200) {
                        app.addsCarsFromCatalog(JSON.parse(this.responseText));
                    }
                });
            },
            getsCarAttributes: function getsCarAttributes(car, info, elem) {
                var dataValue = car[info.dataJs];
                this.assignValuesToElements(info, elem, dataValue);
            },
            addsCarsFromCatalog: function addsCarsFromCatalog(carList) {
                $('[data-js="car-list"]').get(0).innerHTML = '';
                carList.forEach(function(car) {
                    var $carRow = document.createElement('tr');
                    infoList.forEach(function(info) {
                        var $carCol = document.createElement('td');
                        var elem = document.createElement(info.elem);
                        elem.setAttribute('data-js', info.dataJs);
                        app.getsCarAttributes(car, info, elem);
                        $carCol.appendChild(elem);
                        $carRow.appendChild($carCol);
                    });
                    app.createsRemoveButton($carRow);
                    $('[data-js="car-list"]').get(0).appendChild($carRow);
                });
            },
            addsCarToCatalog: function addsCarToCatalog(carData) {
                var ajax = new XMLHttpRequest();
                ajax.open('POST', 'http://localhost:3000/car/');
                ajax.setRequestHeader(
                    'Content-Type',
                    'application/x-www-form-urlencoded'
                );
                ajax.send(carData);
            },
            clearsFormInputs: function clearsFormInputs() {
                var inputs = $form.get(0).querySelectorAll('input');
                inputs.forEach(function(input) {
                    if (input.type !== 'submit') {
                        input.value = '';
                    }
                });
            },
            getsInputValues: function getsInputValues(
                info, index, list, elem, carData
            ) {
                var inputVal = $('[data-js="' + info.dataJs + '"]').get(0).value;
                this.assignValuesToElements(info, elem, inputVal);
                carData += info.dataJs + '=' + inputVal;
                if (index < list.length - 1) {
                    carData += '&';
                }
                return carData;
            },
            createsRemoveButton: function($carRow) {
                var $buttonCol = document.createElement('td');
                var $button = document.createElement('button');
                $button.setAttribute('data-js', 'remove-button');
                $button.textContent = 'Remover';
                $buttonCol.appendChild($button);
                $carRow.appendChild($buttonCol);
                $button.addEventListener('click', function() {
                    $('[data-js="car-list"]').get(0).removeChild($carRow);
                });
            },
            addsNewCar: function addsNewCar(e) {
                e.preventDefault();
                var carData = '';
                var $carRow = document.createElement('tr');
                infoList.forEach(function(info, index, list) {
                    var $carCol = document.createElement('td');
                    var elem = document.createElement(info.elem);
                    elem.setAttribute('data-js', info.dataJs);
                    carData = app.getsInputValues(
                        info, index, list, elem, carData
                    );
                    $carCol.appendChild(elem);
                    $carRow.appendChild($carCol);
                });
                app.createsRemoveButton($carRow);
                $('[data-js="car-list"]').get(0).appendChild($carRow);
                app.clearsFormInputs();
                app.addsCarToCatalog(carData);
            },
            handlesStateChange: function handlesStateChange () {
                if (this.readyState === 4 && this.status === 200) {
                    var companyData = JSON.parse(this.responseText);
                    $('[data-js="name"]').get(0).textContent = companyData.name;
                    $('[data-js="phone"]').get(0).textContent = companyData.phone;
                }
            },
            getsCompanyInfo: function getsCompanyInfo() {
                var ajax = new XMLHttpRequest();
                ajax.open('GET', 'company.json');
                ajax.send();
                ajax.addEventListener('readystatechange', this.handlesStateChange);
            }
        };
        
    })();

    app.init();

})(window.DOM);
