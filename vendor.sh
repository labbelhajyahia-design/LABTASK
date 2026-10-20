#!/bin/sh
# Copie les bibliothèques nécessaires dans www/vendor (appli 100 % hors ligne)
set -e
mkdir -p www/vendor www/fonts
cp node_modules/@capacitor/core/dist/capacitor.js www/vendor/capacitor.js
cp node_modules/@capacitor/local-notifications/dist/plugin.js www/vendor/local-notifications.js
cp node_modules/@capacitor/filesystem/dist/plugin.js www/vendor/filesystem.js
cp node_modules/@capacitor/share/dist/plugin.js www/vendor/share.js
cp node_modules/@capacitor-community/speech-recognition/dist/plugin.js www/vendor/speech-recognition.js
cp node_modules/@capacitor/app/dist/plugin.js www/vendor/app.js
cp node_modules/@zxing/library/umd/index.min.js www/vendor/zxing.min.js
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2 www/fonts/atkinson-400.woff2
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2 www/fonts/atkinson-700.woff2
