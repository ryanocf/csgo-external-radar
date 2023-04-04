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
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

const server = http.createServer(app);
const io = socketio(server);
const _process = require('process');

fs.mkdir('public', () => {
    fs.mkdir('public/images', () => {});
});

const files = {
    settings: 'settings.json',
};

const connections = {};

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

                if (globals.obj.last_map !== data[key].map) {
                    execSync(
                        `cd dependencies & texconv.exe -ft JPG -l -nologo -y -o ../public/images "${data[key].directory}\\resource\\overviews\\${data[key].map}_radar.dds"`,
                        { windowsHide: true, timeout: 30000 }
                    );
                    globals.obj.image = `data:image/jpg;base64,${fs.readFileSync(
                        path.join(
                            _process.cwd(),
                            'public',
                            'images',
                            `${data[key].map}_radar.jpg`
                        ),
                        'base64'
                    )}`;
                    globals.obj.last_map = data[key].map;
                    console.log('triggered new map');

                    Object.keys(connections).forEach((id) => {
                        connections[id].sentImage = false;
                    });
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

    const mainInterval = setInterval(() => {
        if (connections[socket.id] && socket.disconnected) {
            clearInterval(connections[socket.id].interval);
            delete connections[socket.id];
            return;
        }

        let obj = { ...globals.obj };

        if (connections[socket.id].sentImage) {
            obj.image = 'SAME_MAP';
        }

        socket.emit('update', obj, entity.obj);
        connections[socket.id].sentImage = true;
    }, 5);

    connections[socket.id] = {
        interval: mainInterval,
        sentImage: false,
    };

    socket.on('connect_timeout', (socket) => {
        console.log('timeout');
    });

    socket.on('connect_error', (socket) => {
        console.log('error');
    });

    socket.on('disconnect', (reason, details) => {
        console.log('disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile('public/index.html');
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
