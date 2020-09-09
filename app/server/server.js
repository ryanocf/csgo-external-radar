const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');
const _json = require('./json');
const entity = require('./entity');
const globals = require('./globals');
const vdf = require('@node-steam/vdf');
const net = require('net');
const { execSync } = require('child_process');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '..', 'public')));

fs.mkdir('public', () => {
    fs.mkdir('public/images', () => {});
});

const files = {
    settings: 'settings.json',
};

let PIPE_PATH =
    '\\\\.\\pipe\\23d339ddef636cb0a5b9d0be60a289bc4ae87cc62cfd12b8f322e6310c1eea66';

var process = net.connect(PIPE_PATH, (pipe) => {
    console.log();
    console.log('connected to pipe');

    process.on('data', (pipe) => {
        let data = JSON.parse(pipe);

        if (!data) return false;

        entity.clear();

        for (const key in data) {
            if (key == 'global') {
                // update globals
                globals.obj.directory = data[key].directory;
                globals.obj.map.name = data[key].map;
                globals.obj.team = data[key].team;

                if (data[key].map == '') continue;

                let map_file;
                try {
                    map_file = fs.readFileSync(
                        `${data[key].directory}\\resource\\overviews\\${data[key].map}.txt`
                    );

                    map_file = vdf.parse(map_file.toString());

                    for (const key in map_file) {
                        map_file = map_file[key];
                    }

                    globals.obj.map.x = map_file.pos_x;
                    globals.obj.map.y = map_file.pos_y;
                    globals.obj.map.scale = map_file.scale;
                } catch (err) {
                    console.log(err);
                }

                if (globals.obj.lastmap !== data[key].map) {
                    execSync(
                        `cd dependencies & texconv.exe -ft JPG -l -nologo -y -o ../public/images "${data[key].directory}\\resource\\overviews\\${data[key].map}_radar.dds"`,
                        { windowsHide: true, timeout: 30000 }
                    );
                    globals.obj.lastmap = data[key].map;
                }
            } else {
                // update entities
                entity.add(data[key], key);
            }
        }
    });

    process.on('error', (pipe) => {
        console.log(error);
    });
});

io.on('connection', (socket) => {
    console.log('new connection.');

    // read settings
    let settings = _json.read(files.settings);

    // send settings to client
    socket.emit('settings', settings);

    // write settings to file if triggered by client
    socket.on('settings', (socket) => {
        _json.write(
            files.settings,
            'truncate',
            JSON.stringify(socket, null, 4)
        );
    });

    setInterval(() => {
        socket.emit('update', globals.obj, entity.obj);
    }, 5);

    socket.on('connect_timeout', (socket) => {
        console.log('timeout');
    });

    socket.on('connect_error', (socket) => {
        console.log('error');
    });

    socket.on('disconnect', (socket) => {
        console.log('disconnected');
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
