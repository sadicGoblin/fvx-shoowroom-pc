#!/usr/bin/env node

/**
 * Script de verificación para asegurar que Electron está correctamente configurado
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Electron...\n');

let errores = 0;
let advertencias = 0;

// Verificar archivos requeridos
const archivosRequeridos = [
  'main.js',
  'preload.js',
  'electron-dev.js',
  'package.json',
  'angular.json'
];

console.log('📁 Verificando archivos...');
archivosRequeridos.forEach(archivo => {
  const existe = fs.existsSync(path.join(__dirname, archivo));
  if (existe) {
    console.log(`  ✅ ${archivo}`);
  } else {
    console.log(`  ❌ ${archivo} - NO ENCONTRADO`);
    errores++;
  }
});

console.log('\n📦 Verificando dependencias en package.json...');
const packageJson = require('./package.json');

const dependenciasRequeridas = {
  'electron': 'devDependencies',
  'electron-builder': 'devDependencies',
  'wait-on': 'devDependencies',
  'concurrently': 'devDependencies'
};

Object.entries(dependenciasRequeridas).forEach(([dep, tipo]) => {
  const deps = packageJson[tipo] || {};
  if (deps[dep]) {
    console.log(`  ✅ ${dep} (${deps[dep]})`);
  } else {
    console.log(`  ❌ ${dep} - NO ENCONTRADO en ${tipo}`);
    errores++;
  }
});

console.log('\n🔧 Verificando scripts...');
const scriptsRequeridos = [
  'electron',
  'electron-dev',
  'electron-build'
];

scriptsRequeridos.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`  ✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`  ❌ ${script} - NO ENCONTRADO`);
    errores++;
  }
});

console.log('\n⚙️  Verificando configuración de angular.json...');
const angularJson = require('./angular.json');
const prodConfig = angularJson.projects['fvx-showroom-web']?.architect?.build?.configurations?.production;

if (prodConfig) {
  if (prodConfig.baseHref === './') {
    console.log(`  ✅ baseHref configurado correctamente: "${prodConfig.baseHref}"`);
  } else {
    console.log(`  ⚠️  baseHref no está configurado como "./" (actual: "${prodConfig.baseHref || 'no definido'}")`);
    advertencias++;
  }
} else {
  console.log('  ❌ No se encontró configuración de producción');
  errores++;
}

console.log('\n🔍 Verificando contenido de main.js...');
const mainJs = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

if (mainJs.includes('NODE_ENV')) {
  console.log('  ✅ Detección de NODE_ENV presente');
} else {
  console.log('  ⚠️  No se detecta verificación de NODE_ENV');
  advertencias++;
}

if (mainJs.includes('localhost:4200')) {
  console.log('  ✅ URL de desarrollo configurada (localhost:4200)');
} else {
  console.log('  ⚠️  No se encuentra URL de desarrollo');
  advertencias++;
}

if (mainJs.includes('ipcMain')) {
  console.log('  ✅ IPC handlers configurados');
} else {
  console.log('  ⚠️  No se encuentran IPC handlers');
  advertencias++;
}

console.log('\n📊 Verificando node_modules...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  const electronPath = path.join(nodeModulesPath, 'electron');
  const waitOnPath = path.join(nodeModulesPath, 'wait-on');
  const concurrentlyPath = path.join(nodeModulesPath, 'concurrently');
  
  if (fs.existsSync(electronPath)) {
    console.log('  ✅ electron instalado');
  } else {
    console.log('  ⚠️  electron no está instalado en node_modules');
    advertencias++;
  }
  
  if (fs.existsSync(waitOnPath)) {
    console.log('  ✅ wait-on instalado');
  } else {
    console.log('  ⚠️  wait-on no está instalado en node_modules');
    advertencias++;
  }
  
  if (fs.existsSync(concurrentlyPath)) {
    console.log('  ✅ concurrently instalado');
  } else {
    console.log('  ⚠️  concurrently no está instalado en node_modules');
    advertencias++;
  }
} else {
  console.log('  ⚠️  Carpeta node_modules no encontrada. Ejecuta: npm install');
  advertencias++;
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📋 RESUMEN');
console.log('='.repeat(50));

if (errores === 0 && advertencias === 0) {
  console.log('✅ Todo está correctamente configurado!');
  console.log('\n🚀 Para ejecutar en modo desarrollo:');
  console.log('   npm run electron-dev');
} else {
  if (errores > 0) {
    console.log(`❌ Se encontraron ${errores} error(es) crítico(s)`);
  }
  if (advertencias > 0) {
    console.log(`⚠️  Se encontraron ${advertencias} advertencia(s)`);
  }
  
  console.log('\n🔧 Pasos sugeridos:');
  if (advertencias > 0 && errores === 0) {
    console.log('   1. Ejecuta: npm install');
    console.log('   2. Luego ejecuta: npm run electron-dev');
  } else {
    console.log('   1. Revisa los archivos faltantes arriba');
    console.log('   2. Ejecuta: npm install');
    console.log('   3. Consulta CAMBIOS_ELECTRON.md para más detalles');
  }
}

console.log('');
process.exit(errores > 0 ? 1 : 0);
