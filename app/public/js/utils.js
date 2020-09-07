let utils = {
    calc_text_width: function (text, font) {
        let canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        let context = canvas.getContext('2d');
        context.font = font;
        let metrics = context.measureText(text);
        return Math.ceil(metrics.width);
    },
};
