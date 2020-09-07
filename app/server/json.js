const fs = require('fs');

// read file from path
function read(path) {
    let file;
    let data;
    try {
        file = fs.readFileSync(path);
        data = JSON.parse(file);
    } catch (err) {
        return false;
    }
    return data;
}

// write file to path
function write(path, mode, data) {
    switch (mode) {
        case 'truncate':
            fs.writeFile(path, data, (err) => {
                if (err) console.log(err);
            });
            break;

        case 'append':
            fs.appendFile(path, data, (err) => {
                if (err) console.log(err);
            });
            break;

        default:
            return false;
    }
    return true;
}

// watch path
function watch(path, callback) {
    fs.watch(path, (eventType, filename) => {
        callback(path, eventType, filename);
    });

    return true;
}

// unwatch path
function unwatch(path) {
    fs.unwatchFile(path);
    return true;
}

module.exports = {
    read,
    write,
    watch,
    unwatch,
};
