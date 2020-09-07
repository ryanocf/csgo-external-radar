let settings = {
    obj: {
        // category
        enemy: {
            // feature: value
            active: false,
            name: false,
            health: false,
            weapon: false,
        },

        local: {
            active: false,
        },

        team: {
            active: false,
            name: false,
            health: false,
            weapon: false,
        },
    },

    // manipulate settings.obj and send new settings to server
    set: function (category, feature, value) {
        this.obj[category][feature] = value;
        socket.emit('settings', this.obj);
    },

    // parse json from settings.json and update settings.obj
    update: function (data) {
        this.obj = { ...data };
        return true;
    },
};
