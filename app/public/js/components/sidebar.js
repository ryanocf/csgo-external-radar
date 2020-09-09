let sidebar = {
    animate: function (element) {
        if (element.classList.contains('left')) {
            let _sidebar = document.querySelectorAll('.sidebar.left')[0];
            _sidebar.classList.add('animate_left');
        } else if (element.classList.contains('right')) {
            let _sidebar = document.querySelectorAll('.sidebar.right')[0];
            _sidebar.classList.add('animate_right');
        }
    },

    close: function (element) {
        let _sidebar = element.offsetParent;
        if (_sidebar.classList.contains('left')) {
            _sidebar.classList.remove('animate_left');
        } else if (_sidebar.classList.contains('right')) {
            _sidebar.classList.remove('animate_right');
        }
    },
};

let closers = document.getElementsByClassName('sidebar_close');
let togglers = document.getElementsByClassName('sidebar_toggle');
for (var i = 0; i < togglers.length; i++) {
    togglers[i].addEventListener('click', function () {
        sidebar.animate(this);
    });
    closers[i].addEventListener('click', function () {
        sidebar.close(this);
    });
}
