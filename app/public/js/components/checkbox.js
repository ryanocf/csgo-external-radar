let checkbox = {
    // check checkbox by id
    check: function (state, id) {
        let element = document.getElementById(id);
        let exist = element.classList.contains('_checkbox_active');

        if (state && !exist) element.classList.add('_checkbox_active');
        else if (!state && exist) element.classList.remove('_checkbox_active');

        // toggle feature
        const setting = id.split('_');
        settings.set(
            setting[1],
            setting[2],
            element.classList.contains('_checkbox_active')
        );
    },
    // update checkbox state based on settings.obj
    update: function () {
        for (const key in settings.obj) {
            for (const _key in settings.obj[key]) {
                this.check(settings.obj[key][_key], `setting_${key}_${_key}`);
            }
        }
    },
};

let boxes = document.getElementsByClassName('_box');
for (var i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function () {
        checkbox.check(!this.classList.contains('_checkbox_active'), this.id);
    });
}
