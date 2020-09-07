let globals = {
    obj: {
        directory: undefined,
        map: {
            name: undefined,
            x: undefined,
            y: undefined,
            scale: undefined,
        },
        team: undefined,
        lastmap: undefined,
    },

    update: function (data) {
        this.obj = { ...data };
        return true;
    },
};
