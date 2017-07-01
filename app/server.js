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

app.get('/prueba/:nick', function (req, res) {
    var data = {nombre: 'Joe Nilson', apellidos: 'Zegarra Galvez', nick: req.params.nick};
    console.log(data);
    res.end(JSON.stringify(data));
});

app.get('/', function (req, res) {
    var server_url = $('#servidor').val();
    var data = req;
    console.log(data);
    var request = require('request');
    request(server_url+'/api.php?v=2&f=remote_printer&terminal='+data.query.terminal, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('Respuesta 1: '+JSON.stringify(response));
            console.log('Respuesta 2: '+body);
        }else{
            console.log('Error: '+error);
        }
    });
});

app.get('/imprimir/:filepath', function (req, res) {
    var data = {nombre: 'Joe Nilson', apellidos: 'Zegarra Galvez', nick: req.params.nick};
    console.log(data);
    res.end(JSON.stringify(data));
});

var server = app.listen(10080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Servidor activo en http://%s:%s", host, port);
});
