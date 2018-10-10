const mm = require('musicmetadata');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Sound = require('../lib/models/sounds');
const mongoose = require("mongoose");
const config = require('../config.js');

mongoose.connect(config.db);

//Script to add the duration property to sounds.

void async function () {
  const filesPath = path.join(os.homedir(), 'files');
  let files = fs.readdirSync(filesPath);
  let fileUpdatePromises = []
  let unknownFiles = 0;

  await Sound.update({__v: 0}, {duration: 0}, {multi: true});

  for (let i = 0; i < files.length; i++) {
    let rs = fs.createReadStream(path.join(filesPath, files[i]));

    fileUpdatePromises.push(new Promise((resolve, reject) =>
      mm(rs, { duration: true }, async (err, meta) => {
        if (!err) {
          try {
            let result = await Sound.findOneAndUpdate({ filename: files[i] }, { duration: meta.duration });
            if (!result)
              unknownFiles++;
            return resolve();
          }
          catch (err) {
            reject(err);
          }
        } else {
          return resolve();
        }
      })));
  }
  return Promise.all(fileUpdatePromises).then((results) => console.log(`Updated ${results.length - unknownFiles} sounds`));
}();
