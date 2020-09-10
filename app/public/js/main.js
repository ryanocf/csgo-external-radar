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

    if (_globals.map.name === '' || typeof _globals.map.name === 'undefined') {
        map.state('hide', _globals.map.name);
    } else if (
        _globals.map.name !== '' &&
        typeof _globals.map.name !== 'undefined'
    ) {
        map.state('show', _globals.map.name);
    }

    requestAnimationFrame(() => {
        drawing.draw();
    });
});

if (this.innerWidth < this.innerHeight) {
    let resize = document.getElementsByClassName('resize');
    let n = resize.length;
    for (let i = 0; i < n; i++) {
        resize[i].style.height = this.innerWidth + 'px';
        resize[i].style.width = this.innerWidth + 'px';
    }
} else {
    let resize = document.getElementsByClassName('resize');
    let n = resize.length;
    for (let i = 0; i < n; i++) {
        resize[i].style.height = this.innerHeight + 'px';
        resize[i].style.width = this.innerHeight + 'px';
    }
}

window.addEventListener('resize', function () {
    if (this.innerWidth < this.innerHeight) {
        let resize = document.getElementsByClassName('resize');
        let n = resize.length;
        for (let i = 0; i < n; i++) {
            resize[i].style.height = this.innerWidth + 'px';
            resize[i].style.width = this.innerWidth + 'px';
        }
    } else {
        let resize = document.getElementsByClassName('resize');
        let n = resize.length;
        for (let i = 0; i < n; i++) {
            resize[i].style.height = this.innerHeight + 'px';
            resize[i].style.width = this.innerHeight + 'px';
        }
    }
});
