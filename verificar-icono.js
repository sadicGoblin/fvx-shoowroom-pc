const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de iconos...\n');

const checks = [
  {
    name: 'Icono SVG',
    path: 'src/assets/icon.svg',
    optional: true
  },
  {
    name: 'Icono ICO (necesario para Windows)',
    path: 'src/assets/icon.ico',
    optional: false
  }
];

let allGood = true;

checks.forEach(check => {
  const fullPath = path.join(__dirname, check.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${check.name}: Encontrado (${stats.size} bytes)`);
  } else {
    if (check.optional) {
      console.log(`ℹ️  ${check.name}: No encontrado (opcional)`);
    } else {
      console.log(`❌ ${check.name}: NO ENCONTRADO (requerido)`);
      allGood = false;
    }
  }
});

console.log('\n📋 Configuración de package.json:');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

if (packageJson.build && packageJson.build.nsis) {
  const nsis = packageJson.build.nsis;
  console.log(`✅ createDesktopShortcut: ${nsis.createDesktopShortcut}`);
  console.log(`✅ createStartMenuShortcut: ${nsis.createStartMenuShortcut}`);
  console.log(`✅ shortcutName: "${nsis.shortcutName}"`);
} else {
  console.log('❌ Configuración NSIS no encontrada');
  allGood = false;
}

console.log('\n' + '='.repeat(60));

if (allGood) {
  console.log('✅ Todo listo para compilar!');
  console.log('\nEjecuta: npm run build-electron');
  console.log('\nEl instalador creará automáticamente:');
  console.log('  • Acceso directo en el Escritorio');
  console.log('  • Acceso directo en el Menú Inicio');
  console.log('  • Icono personalizado en todos los lugares');
} else {
  console.log('⚠️  Faltan archivos necesarios');
  console.log('\n📖 Lee ICONOS_INSTALADOR.md para instrucciones completas');
  console.log('\nPasos siguientes:');
  console.log('  1. Convierte src/assets/icon.svg a icon.ico');
  console.log('  2. Visita: https://convertio.co/es/svg-ico/');
  console.log('  3. Guarda el archivo como src/assets/icon.ico');
  console.log('  4. Ejecuta: npm run build-electron');
}

console.log('='.repeat(60) + '\n');
