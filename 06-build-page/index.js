const fs = require('fs');
const path = require('path');
const templateFile = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const folderNameNew = path.join(__dirname, 'project-dist');
const rs = fs.createReadStream(templateFile, 'utf-8');
const fsPromises = fs.promises;
fsPromises.mkdir(folderNameNew, {recursive: true});
rs.on('readable', () => {
	let str = rs.read();
	if (str) {
    let pos = 0;
    const fileNames = [];
    while (true) {
      let foundPos = str.indexOf('{{', pos);
      if (foundPos == -1) break;
      const endPos = str.indexOf('}}', foundPos);
      fileNames.push(str.slice(foundPos + 2, endPos));
      pos = foundPos + 3;
    }

    fileNames.map(item => {
      const currentFileReadStream = fs.createReadStream(path.join(__dirname, 'components', item + '.html'), 'utf-8');
      currentFileReadStream.on('readable', () => {
        const htmlCode = currentFileReadStream.read();
        if (htmlCode) {
          str = str.replace('{{' + item + '}}', htmlCode);
        } else {
          const ws = fs.createWriteStream(path.join(folderNameNew, 'index.html'), 'utf-8');
          ws.write(str);
        }
      })
    })
  }
})

const stylesFolder = path.join(__dirname, 'styles');
fs.readdir(stylesFolder, {encoding: 'utf8', withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  let arr = files.filter (item => item.name.split('.')[1] == 'css');
  const ws = fs.createWriteStream(path.join(folderNameNew, 'style.css'), 'utf-8');
  arr.map(item => {
    fs.stat(path.join(stylesFolder, item.name), (err, stats) => {
      if (err) console.log(err);
      const rs = fs.createReadStream(path.join(stylesFolder, item.name), 'utf-8');
      rs.on('readable', () => {
        const text = rs.read();
        if (text) {
          ws.write(text + '\r\n');
        }
      })
    })
    
  });
});

const assetsFolder = path.join(__dirname, 'assets');
const newAssetsFolder = path.join(folderNameNew, 'assets');
function copyFolder(folder = assetsFolder, newFolder = newAssetsFolder) {
  fs.readdir(folder, {encoding: 'utf8', withFileTypes: true}, (err, files) => {
    if (err) console.log(err);
    files.map(item => {
      if (item.isFile()) {
        fs.copyFile(path.join(folder, item.name), path.join(newFolder, item.name), (err) => {
          if (err) console.log(err);
        });
      } else {
        fsPromises.mkdir(path.join(newFolder, item.name), {recursive: true}).then( (p) => {
          copyFolder(path.join(folder, item.name), path.join(newFolder, item.name))
        });
      }
    });
  })
}
copyFolder();