// Script para verificar que todo esté listo antes de hacer el build
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración antes del build...\n');

let errors = 0;
let warnings = 0;

// 1. Verificar package.json
console.log('1. Verificando package.json...');
try {
  const pkg = require('./package.json');
  
  if (!pkg.dependencies['electron-store']) {
    console.error('   ❌ ERROR: electron-store no está en dependencies');
    errors++;
  } else {
    console.log('   ✅ electron-store está en dependencies');
  }
  
  if (pkg.devDependencies['electron-store']) {
    console.error('   ⚠️  ADVERTENCIA: electron-store también está en devDependencies (debería solo estar en dependencies)');
    warnings++;
  }
} catch (e) {
  console.error('   ❌ ERROR leyendo package.json:', e.message);
  errors++;
}

// 2. Verificar que exista dist/ (opcional durante prebuild)
console.log('\n2. Verificando build de Angular...');
if (!fs.existsSync('dist')) {
  console.log('   ℹ️  Carpeta dist/ no existe aún (se creará durante el build)');
} else {
  console.log('   ✅ Carpeta dist/ existe');
  
  // Verificar dist/fvx-showroom-web/
  if (!fs.existsSync('dist/fvx-showroom-web')) {
    console.log('   ℹ️  Carpeta dist/fvx-showroom-web/ no existe (se creará durante el build)');
  } else {
    console.log('   ✅ Carpeta dist/fvx-showroom-web/ existe');
    
    // Verificar index.html
    if (!fs.existsSync('dist/fvx-showroom-web/index.html')) {
      console.log('   ℹ️  index.html no existe aún (se creará durante el build)');
    } else {
      console.log('   ✅ index.html existe');
      
      // Verificar que index.html use rutas relativas
      const indexContent = fs.readFileSync('dist/fvx-showroom-web/index.html', 'utf8');
      if (indexContent.includes('href="/"') || indexContent.includes('src="/"')) {
        console.error('   ❌ ERROR: index.html contiene rutas absolutas. Asegúrate de usar --base-href=./');
        errors++;
      } else {
        console.log('   ✅ index.html usa rutas relativas');
      }
    }
  }
}

// 3. Verificar archivos principales
console.log('\n3. Verificando archivos de Electron...');
if (!fs.existsSync('main.js')) {
  console.error('   ❌ ERROR: No existe main.js');
  errors++;
} else {
  console.log('   ✅ main.js existe');
  
  // Verificar que main.js tenga import dinámico de electron-store
  const mainContent = fs.readFileSync('main.js', 'utf8');
  if (!mainContent.includes('await import(\'electron-store\')')) {
    console.error('   ❌ ERROR: main.js no usa import dinámico para electron-store');
    errors++;
  } else {
    console.log('   ✅ main.js usa import dinámico correcto');
  }
}

if (!fs.existsSync('preload.js')) {
  console.error('   ❌ ERROR: No existe preload.js');
  errors++;
} else {
  console.log('   ✅ preload.js existe');
}

// 4. Verificar node_modules
console.log('\n4. Verificando node_modules...');
if (!fs.existsSync('node_modules')) {
  console.error('   ❌ ERROR: No existe node_modules/. Ejecuta: npm install');
  errors++;
} else {
  console.log('   ✅ node_modules/ existe');
  
  if (!fs.existsSync('node_modules/electron-store')) {
    console.error('   ❌ ERROR: electron-store no está instalado');
    errors++;
  } else {
    console.log('   ✅ electron-store instalado');
  }
  
  if (!fs.existsSync('node_modules/electron')) {
    console.error('   ❌ ERROR: electron no está instalado');
    errors++;
  } else {
    console.log('   ✅ electron instalado');
  }
  
  if (!fs.existsSync('node_modules/electron-builder')) {
    console.error('   ❌ ERROR: electron-builder no está instalado');
    errors++;
  } else {
    console.log('   ✅ electron-builder instalado');
  }
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN:');
console.log('='.repeat(50));

if (errors > 0) {
  console.error(`\n❌ ${errors} error(es) encontrado(s)`);
  console.error('⚠️  NO ejecutes el build hasta corregir los errores\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log(`\n⚠️  ${warnings} advertencia(s) encontrada(s)`);
  console.log('✅ Puedes continuar con el build, pero revisa las advertencias\n');
} else {
  console.log('\n✅ ¡Todo está listo para el build!');
  console.log('\n📦 Ejecuta: npm run build-electron\n');
}
