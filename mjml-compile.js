/* eslint-disable @typescript-eslint/no-var-requires */
const mjml2html = require('mjml');
const fs = require('fs');
const path = require('path');

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter);
    } else if (filter.test(filename)) {
      console.log(`compile ${filename} to directory ${path.dirname(filename)}`);
      const mjml = fs.readFileSync(filename).toString();
      const compiledString = mjml2html(mjml);
      const compiledFileName = filename.replace(/\.mjml$/, '.hbs');
      fs.writeFileSync(compiledFileName, compiledString.html);
    }
  }
}

fromDir(__dirname, /\.mjml$/);
