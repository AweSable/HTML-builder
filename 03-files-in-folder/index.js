const fs = require('fs');
const path = require('path');
const folderName = path.join(__dirname, 'secret-folder');
fs.readdir(folderName, {encoding: 'utf8', withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  let arr = files.filter (item => item.isFile());
  arr = arr.map(item => {
    fs.stat(path.join(folderName, item.name), (err, stats) => {
      if (err) console.log(err);
      console.log(item.name.split('.')[0] + ' - ' + item.name.split('.')[1] + ' - ' + (stats.size / 1024).toFixed(3)  + 'kb');
    })
  });
})