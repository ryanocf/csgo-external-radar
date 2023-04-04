let globals = {
    obj: {
        directory: undefined,
        map: {
            name: undefined,
            scale: undefined,
            x: undefined,
            y: undefined,
        },
        last_map: undefined,
        team: undefined,
        image: undefined,
    },

    update: function (data) {
        if (data.image === 'SAME_MAP') {
            data.image = this.obj.image;
        }

        this.obj = { ...data };
        return true;
    },
};
