const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imagens = [
  { src: 'assets/hero-clinica.png',                    dest: 'assets/hero-clinica.webp',                    width: 900 },
  { src: 'fotohero.png',                               dest: 'fotohero.webp',                               width: 800 },
  { src: 'assets/resultado-preenchimento-labial.png',  dest: 'assets/resultado-preenchimento-labial.webp',  width: 600 },
  { src: 'assets/resultado-harmonizacao-facial.png',   dest: 'assets/resultado-harmonizacao-facial.webp',   width: 600 },
  { src: 'assets/resultado-botox.png',                 dest: 'assets/resultado-botox.webp',                 width: 600 },
  { src: 'assets/resultado-lipo-papada.png',           dest: 'assets/resultado-lipo-papada.webp',           width: 600 },
];

async function converter() {
  for (const img of imagens) {
    const srcPath  = path.join(__dirname, img.src);
    const destPath = path.join(__dirname, img.dest);

    if (!fs.existsSync(srcPath)) {
      console.log(`Ignorado (não encontrado): ${img.src}`);
      continue;
    }

    const antesKB = Math.round(fs.statSync(srcPath).size / 1024);

    await sharp(srcPath)
      .resize({ width: img.width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destPath);

    const depoisKB = Math.round(fs.statSync(destPath).size / 1024);
    const reducao  = Math.round((1 - depoisKB / antesKB) * 100);
    console.log(`${img.src.padEnd(45)} ${antesKB} KB → ${depoisKB} KB  (−${reducao}%)`);
  }

  console.log('\nConcluído! Agora atualize o HTML para usar os arquivos .webp');
}

converter().catch(console.error);
