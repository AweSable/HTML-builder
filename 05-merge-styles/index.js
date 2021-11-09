/*
Импорт всех требуемых модулей
Чтение содержимого папки styles
Проверка является ли объект файлом и имеет ли файл нужное расширение
Чтение файла стилей
Запись прочитанных данных в массив
Запись массива стилей в файл bundle.css
*/

const fs = require('fs');
const path = require('path');
const folderNameOrigin = path.join(__dirname, 'styles');
const folderNameNew = path.join(__dirname, 'project-dist');

fs.readdir(folderNameOrigin, {encoding: 'utf8', withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  let arr = files.filter (item => item.name.split('.')[1] == 'css');
  const ws = fs.createWriteStream(path.join(folderNameNew, 'bundle.css'), 'utf-8');
  arr.map(item => {
    fs.stat(path.join(folderNameOrigin, item.name), (err, stats) => {
      if (err) console.log(err);
      const rs = fs.createReadStream(path.join(folderNameOrigin, item.name), 'utf-8');
      rs.on('readable', () => {
        const text = rs.read();
        if (text) {
          ws.write(text + '\r\n');
        }
      })
    })
    
  });
});