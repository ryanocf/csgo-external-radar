let globals = {
    obj: {
        directory: undefined,
        map: {
            name: undefined,
            scale: undefined,
            x: undefined,
            y: undefined,
        },
        lastmap: undefined,
        team: undefined,
    },

    update: function (data) {
        this.obj = { ...data };
        return true;
    },
};
