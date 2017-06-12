/*
 * Copyright (C) 2017 Joe Nilson <joenilson at gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
//Cargamos jquery
let $ = require('jquery');
//Cargamos filesystem para leer el archivo de configuración de la impresora a utilizar
let fs = require('fs');
//Indicamos cual es el archivo de configuración de la impresora
let configuracion = 'app/config.json';
//Creamos la variable donde guardaremos la configuracion
let config_data = false;
//Leemos el listado de las impresoras de printer que la cargamos en impresoras.js
var impresoras = printer.getPrinters();


function escribirConfiguracion(){
    var json = JSON.stringify(config_data);
    fs.writeFile(configuracion, json, (err) => {
        if (err) {
            $('#alerta_generica_texto').html();
            $('#alerta_generica_texto').html('Hubo un error intentando crear el archivo de configuración, por favor cierre la aplicación y vuelva a abrirla.');
            $('#alerta_generica').show();
        }
    });
}
function cargarConfiguracion(){
    if(fs.existsSync(configuracion)){
        try {
            config_data = JSON.parse(fs.readFileSync(configuracion, 'utf8'));
        }catch(e){
            $('#alerta_configuracion').show();
        }
    }
    else {
        //Si no existe el archivo lo creamos con valores vacios
        config_data = '{\n"nombre_impresora":"",\n"tipo_impresora":""\n}\n';
        escribirConfiguracion();
    }
}

function cargarImpresoras(){
    $("#lista_impresoras ul").empty();
    $("#lista_impresoras ul").append('<li class="list-group-item active">Impresoras disponibles</li>');
    $.each(impresoras, function(index, element){
        var badge = '<button class="btn btn-sm btn-link pull-right" onclick="elegirImpresora(\''+element.name+'\')"><i class="fa fa-star-o"></i></button>';
        var success = '';
        if(element.name === config_data.nombre_impresora){
            badge = '<button class="btn btn-sm btn-link pull-right" disabled><i class="fa fa-star"></i></button>';
            success = ' list-group-item-success';
        }
        $("#lista_impresoras ul").append('<li class="list-group-item'+success+'">'+element.name+' '+badge+'</li>');
    });
}

function elegirImpresora(nombre){
    if(nombre.length > 0){
        config_data.nombre_impresora = nombre;
        escribirConfiguracion();
    }
    cargarImpresoras();
}
//Cargamos la configuracion del archivo json si existe, si no existe lo creamos
cargarConfiguracion();
//Cargamos el listado de impresoras
cargarImpresoras();