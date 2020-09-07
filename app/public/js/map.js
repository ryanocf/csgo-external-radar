let map = {
    state: function (state, _map) {
        let map = {
            element: undefined,
            children: {
                map_no: undefined,
                map_image: undefined,
            },
        };

        map.element = document.getElementsByClassName('map')[0];

        let n = Object.keys(map.children);
        for (let i = 0; i < n.length; i++) {
            map.children[n[i]] = map.element.children[i];
        }

        switch (state) {
            case 'show':
                map.children.map_no.style.display = 'none';
                map.children.map_image.style.display = 'flex';
                map.children.map_image.src = `images/${_map}_radar.JPG`;
                break;

            case 'hide':
                map.children.map_no.style.display = 'flex';
                map.children.map_image.style.display = 'none';
                break;

            case 'change':
                map.children.map_image.src = `images/${_map}_radar.JPG`;
                break;
        }
    },
};
