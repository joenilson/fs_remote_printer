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
//Cargamos jquery
let $ = require('jquery');
//Cargamos filesystem para leer el archivo de configuración de la impresora a utilizar
let fs = require('fs');
//Cargamos la variable path
let path = require('path');
//Indicamos cual es el archivo de configuración de la impresora
let configuracion = 'app/config.json';
//Creamos la variable donde guardaremos la configuracion
let config_data = false;
//Llamamos a la versión de la aplicacion
let appVersion = '1.0.0';

const notifier = require('node-notifier');
//Mostramos el aviso que ya cargó la aplicación
notifier.notify({
    title: 'Remote Printer activo',
    message: '¡Remote Printer esta corriendo en el área de notificación!',
    icon: path.join(__dirname, 'assets/images/icon.png'), // Absolute path (doesn't work on balloons)
    sound: false, // Only Notification Center or Windows Toasters
    wait: false // Wait with callback, until user action is taken against notification
});

function escribirConfiguracion(){
    var json = JSON.stringify(config_data);
    fs.writeFile(configuracion, json, (err) => {
        if (err) {
            dialog.showErrorBox('Archivo de Configuración', "Hubo un error intentando crear el archivo de configuración, por favor cierre la aplicación y vuelva a abrirla.");
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
        config_data = {nombre_impresora: '', tipo_impresora: ''};
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

function impresionPrueba()
{
    printer.printDirect({
        data: 'Impresión de prueba desde '+config_data.servidor_url+"\n\n hacia la impresora: "+config_data.nombre_impresora+"\n\n\nFacturaScripts Remote Printer version "+appVersion, 
        printer: config_data.nombre_impresora,
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
                config_data.servidor_url = server_url;
                escribirConfiguracion();
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
    if(config_data.servidor_url){
        $('#servidor').val(config_data.servidor_url);
    }
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
mostrarUrl();