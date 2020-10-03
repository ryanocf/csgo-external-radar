let utils = {
    calc_text_width: function (text, font) {
        let canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        let context = canvas.getContext('2d');
        context.font = font;
        let metrics = context.measureText(text);
        return Math.ceil(metrics.width);
    },

    check_sizing: function () {
        if (window.innerWidth < window.innerHeight) {
            let resize = document.getElementsByClassName('resize');
            let n = resize.length;
            for (let i = 0; i < n; i++) {
                resize[i].style.height = window.innerWidth + 'px';
                resize[i].style.width = window.innerWidth + 'px';
            }
        } else {
            let resize = document.getElementsByClassName('resize');
            let n = resize.length;
            for (let i = 0; i < n; i++) {
                resize[i].style.height = window.innerHeight + 'px';
                resize[i].style.width = window.innerHeight + 'px';
            }
        }
    },
};
