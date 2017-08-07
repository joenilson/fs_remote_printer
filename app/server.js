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
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    var server_url = $('#servidor').val();
    var data = req;
    var request = require('request');
    var printer = require('printer');
    request(server_url+'/api.php?v=2&f=remote_printer&terminal='+data.query.terminal, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            printer.printDirect({
                data: body, 
                printer: config_data.nombre_impresora,
                type: 'RAW', // type: RAW, TEXT, PDF, JPEG, .. depends on platform
                success:function(jobID){
                    console.log("Impresión con ID: "+jobID);
                },
                error:function(err){
                    console.log(err);
                }
            });
        }else{
            console.log('Error: '+error);
        }
    });
});

var server = app.listen(10080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Servidor activo en http://%s:%s", host, port);
});
