const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const folderNameOrigin = path.join(__dirname, 'files');
const folderNameNew = path.join(__dirname, 'files-copy');

fsPromises.mkdir(folderNameNew, {recursive: true});
fs.readdir(folderNameOrigin, {encoding: 'utf8', withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  files.map(item => {
    fs.copyFile(path.join(folderNameOrigin, item.name), path.join(folderNameNew, item.name), (err) => {
      if (err) console.log(err);
    });
  });
})

fs.readdir(folderNameNew, {encoding: 'utf8', withFileTypes: true}, (err, files) => {
  if (err) console.log(err);
  files.map(item => {
    fs.stat(path.join(folderNameOrigin, item.name), function(err, stat) {
      if(err !== null) {
        fs.unlink(path.join(folderNameNew, item.name), (err) => {
          if (err) console.log(err);
        });
      }
    });
  });
});