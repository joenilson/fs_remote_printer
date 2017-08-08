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
//cargamos los dialogos de electron
const {dialog} = require('electron').remote;
//Cargamos los settings de la aplicacion
const settings = require('electron-settings');
//Cargamos jquery
let $ = require('jquery');
//Cargamos la variable path
let path = require('path');
//Indicamos cual es el archivo de configuración de la impresora
let configuracion = path.join(__dirname, 'app/config.json');
//Creamos la variable donde guardaremos la configuracion
let config_data = false;
//Llamamos a la versión de la aplicacion
let appVersion = '1.0.0';

var nombre_imp = settings.get('config.nombre_impresora');
var tipo_imp = settings.get('config.tipo_impresora');
var server_url = settings.get('config.servidor_url');

settings.set('app', { appVersion: '0.0.1' });
settings.set('config', { nombre_impresora: nombre_imp, tipo_impresora: tipo_imp, servidor_url: server_url });

const notifier = require('node-notifier');
//Mostramos el aviso que ya cargó la aplicación
notifier.notify({
    title: 'Remote Printer activo',
    message: '¡Remote Printer esta corriendo en el área de notificación!',
    icon: path.join(__dirname, 'assets/images/icon.png'), // Absolute path (doesn't work on balloons)
    sound: false, // Only Notification Center or Windows Toasters
    wait: false // Wait with callback, until user action is taken against notification
});

function cargarImpresoras()
{
    var impresora = settings.get('config.nombre_impresora');
    $("#lista_impresoras ul").empty();
    $("#lista_impresoras ul").append('<li class="list-group-item active">Impresoras disponibles</li>');
    $.each(impresoras, function(index, element){
        var badge = '<button class="btn btn-sm btn-link pull-right" onclick="elegirImpresora(\''+element.name+'\')"><i class="fa fa-star-o"></i></button>';
        var success = '';
        if(element.name === impresora){
            badge = '<button class="btn btn-sm btn-link pull-right" disabled><i class="fa fa-star"></i></button>';
            success = ' list-group-item-success';
        }
        $("#lista_impresoras ul").append('<li class="list-group-item'+success+'">'+element.name+' '+badge+'</li>');
    });
}

function impresionPrueba()
{
    printer.printDirect({
        data: 'Impresión de prueba desde '+server_url+"\n\n hacia la impresora: "+nombre_imp+"\n\n\nFacturaScripts Remote Printer version "+appVersion,
        printer: nombre_imp,
        type: 'TEXT', // type: RAW, TEXT, PDF, JPEG, .. depends on platform
        success:function(jobID){
            notifier.notify({
                title: 'Remote Printer imprimiendo',
                message: 'Se esta imprimiendo el trabajo con id: '+jobID,
                icon: path.join(__dirname, 'assets/images/icon.png'), // Absolute path (doesn't work on balloons)
                sound: false, // Only Notification Center or Windows Toasters
                wait: false // Wait with callback, until user action is taken against notification
            });
            console.log("Impresión con ID: "+jobID);
        },
        error:function(err){
            console.log(err);
        }
    });
}

function verificarUrl(){
    var server_url = $('#servidor').val();
    if(server_url){
        var request = require('request');
        request(server_url+'/api.php?v=2&f=remote_printer', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                settings.set('config.servidor_url', server_url);
                dialog.showMessageBox({ message: '¡Servidor sincronizado correctamente!', buttons: ["OK"] });
            }else{
                dialog.showErrorBox('URL incorrecta', "Ocurrió un error intentando conectar al servidor, compruebe la dirección ingresada.");
            }
        });
    }else{
        dialog.showErrorBox('URL vacia', "Debe colocar la direccion web de su instalación de FacturaScripts.");
    }
}

function mostrarUrl(){
    var server_url = settings.get('config.servidor_url');
    if(server_url){
        $('#servidor').val(server_url);
    }
}

function elegirImpresora(nombre){
    if(nombre.length > 0){
        settings.set('config.nombre_impresora', nombre);
    }
    cargarImpresoras();
}

cargarImpresoras();
mostrarUrl();