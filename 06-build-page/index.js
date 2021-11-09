/*
Импорт всех требуемых модулей
Прочтение и сохранение в переменной файла-шаблона
  Заменяет шаблонные теги в файле template.html с названиями файлов из папки components (пример:{{section}}) на содержимое одноимённых компонентов и сохраняет результат в project-dist/index.html.
Нахождение всех имён тегов в файле шаблона
Замена шаблонных тегов содержимым файлов-компонентов
Запись изменённого шаблона в файл index.html в папке project-dist
Использовать скрипт написанный в задании 05-merge-styles для создания файла style.css
Использовать скрипт из задания 04-copy-directory для переноса папки assets в папку project-dist
*/
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
    const ws = fs.createWriteStream(path.join(folderNameNew, 'index.html'), 'utf-8');
    fileNames.map(item => {
      const currentFileReadStream = fs.createReadStream(path.join(__dirname, 'components', item + '.html'), 'utf-8');
      currentFileReadStream.on('readable', () => {
        const htmlCode = currentFileReadStream.read();
        if (htmlCode) {
          str = str.replace('{{' + item + '}}', htmlCode);
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