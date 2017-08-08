# fs_remote_printer
Aplicación para impresión remota desde FacturaScripts

# No hay un empaquetado para tu distribución?
Instala npm con tu gestor de paquetes, mira en [la documentación oficial](https://github.com/electron-userland/electron-builder/wiki/Options#LinuxBuildOptions-target) cual se corresponde mejor para añadirlo en *target* dentro de package.json y seguidamente en la raíz de fs_remote_printer ejecuta:

   ```npm install```
   
   ```npm rebuild --runtime=electron --target=1.6.11 --disturl=https://atom.io/download/atom-shell --abi=53 --build-from-source```
   
   ```./node_modules/.bin/electron-builder --linux```
   
   ```npm install```