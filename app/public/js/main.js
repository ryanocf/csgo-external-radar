const socket = io();

// receive settings from server and update settings.obj
socket.on('settings', (data) => {
    if (!data) return false;

    settings.update(data);
    checkbox.update();
});

socket.on('update', (_globals, _entity) => {
    for (const key in _entity) {
        drawing.add(key, _entity[key]);
    }
    globals.update(_globals);

    if (
        _globals.image === '' ||
        typeof _globals.image === 'undefined' ||
        _globals.map.name === '' ||
        typeof _globals.map.name === 'undefined'
    ) {
        map.state('hide', _globals.map.name);
    } else {
        map.state('show', _globals.map.name);
    }

    requestAnimationFrame(() => {
        drawing.draw();
    });
});

utils.check_sizing();
window.addEventListener('resize', function () {
    utils.check_sizing();
});
