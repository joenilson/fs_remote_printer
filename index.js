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
'use strict';

const electron = require('electron');
const path = require('path');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const iconPath = path.join(__dirname, 'assets/images/icon.png');

let appIcon = null;
let win;

app.on('ready', function () {
    win = new BrowserWindow({show: false, width: 800, height: 600});
    win.loadURL('file://' + __dirname + '/index.html');
    appIcon = new Tray(iconPath);
    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Remote Printer',
            icon: iconPath,
            click: function(){
                win.show();
            }
        },{
            label: 'Modo Debug',
            accelerator: 'Alt+Command+I',
            click: function () {
                win.toggleDevTools();
            }
        },{
            label: 'Cerrar Aplicación',
            accelerator: 'Command+Q',
            selector: 'terminate:',
            click: function(){
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);
    win.on('close', function (event) {
        if(!app.isQuiting){
            event.preventDefault();
            win.hide();
        }
        return false;
    });
    win.on('minimize', function (event) {
        event.preventDefault();
        win.hide();
    });
    win.on('show', function () {
        appIcon.setHighlightMode('always');
    });
});

