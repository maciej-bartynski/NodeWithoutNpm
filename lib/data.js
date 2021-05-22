const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

const baseDir = path.resolve(__dirname, "..", ".data");

const toolCreateFilePath = (dirName, fileName, extension = "json") => {
  return path.resolve(baseDir, dirName, `${fileName}.${extension}`);
};

const create = (dirName, fileName, fileContent, callback) => {
  fs.open(
    toolCreateFilePath(dirName, fileName),
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        fs.writeFile(fileDescriptor, JSON.stringify(fileContent), (error) => {
          if (!error) {
            fs.close(fileDescriptor, (fail) => {
              if (fail) callback("Error closing file");
              else callback(false);
            });
          } else {
            callback("Error writing to created file");
          }
        });
      } else {
        callback(
          `Error creating new file (it may already exist): ${
            err || "(unknown)"
          }`
        );
      }
    }
  );
};

const update = (dirName, fileName, fileContent, callback) => {
  fs.open(
    toolCreateFilePath(dirName, fileName),
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        fs.ftruncate(fileDescriptor, (errorTruncate) => {
          if (!errorTruncate) {
            fs.writeFile(
              fileDescriptor,
              JSON.stringify(fileContent),
              (errWrite) => {
                if (!errWrite) {
                  fs.close(fileDescriptor, (errClosing) => {
                    if (errClosing)
                      callback("Error closing file: ", errClosing);
                    else callback(false);
                  });
                } else {
                  callback("Error writing file: " + errWrite);
                }
              }
            );
          } else {
            callback("Error truncating file: " + errorTruncate);
          }
        });
      } else {
        callback("Error opening file: " + err || "(unknown)");
      }
    }
  );
};

const remove = (dirName, fileName, callback) => {
  fs.unlink(toolCreateFilePath(dirName, fileName), (err) => {
    callback(err || false);
  });
};

const read = (dirName, fileName, callback) => {
  fs.readFile(toolCreateFilePath(dirName, fileName), "utf8", (err, data) => {
    callback(err, data ? helpers.parseJson(data) : undefined);
  });
};

module.exports = {
  update,
  remove,
  create,
  read,
};
