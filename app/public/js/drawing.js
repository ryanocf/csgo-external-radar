let drawing = {
    obj: {
        entity: {
            t: [],
            ct: [],
        },
    },

    add: function (team, entity) {
        this.obj.entity[team] = entity;
        return true;
    },

    // creates new entity on map
    create: function (entity, status) {
        let range = document.createRange();
        let players = document.getElementById('players');
        range.selectNode(players);

        players.appendChild(
            range.createContextualFragment(`
            <div class="entity" data-id="${entity.id}">
                <div class="dot ${status}"></div>
                <div class="health"></div>
                <div class="name"></div>
                <div class="weapon"></div>
            </div>
        `)
        );
    },

    clear: function () {
        let entities = document.getElementsByClassName('entity');

        let n = entities.length;
        for (let i = 0; i < n; i++) {
            entities[i].remove();
        }

        return true;
    },

    // deletes entity on map
    delete: function (id) {
        let entities = document.getElementsByClassName('entity');

        let n = entities.length;
        for (let i = 0; i < n; i++) {
            if (entities[i].getAttribute('data-id') == id) {
                entities[i].remove();
                return true;
            }
        }

        return false;
    },

    draw: function () {
        if (
            typeof globals.obj.map.name === 'undefined' ||
            globals.obj.map.name === '' ||
            typeof globals.obj.team === 'undefined'
        ) {
            if (document.getElementsByClassName('entity').length > 0)
                this.clear();

            return false;
        }

        // get local entity
        let local;
        for (const key in this.obj.entity) {
            if (typeof local === 'undefined') {
                local = this.obj.entity[key].find((x) => {
                    return x.local == true;
                });
            }
        }

        // enemy_team = opposite of local.team
        // friend_team = local.team
        let enemy_team;
        let friend_team;
        if (globals.obj.team == 2) {
            enemy_team = 'ct';
            friend_team = 't';
        } else if (globals.obj.team == 3) {
            enemy_team = 't';
            friend_team = 'ct';
        }

        // get all entities on map
        let entities = document.getElementsByClassName('entity');

        let n = entities.length;

        // get already drawn entities data-id which equals entity's userid
        let drawn_entities = [];
        for (let i = 0; i < n; i++) {
            drawn_entities.push(entities[i].getAttribute('data-id'));
        }

        let d = drawn_entities.length;

        // check if an id from drawn entities is not in this.obj.entitiy and if so delete the associated entity on map
        for (let i = 0; i < d; i++) {
            if (
                typeof this.obj.entity.ct.find((x) => {
                    return x.id == drawn_entities[i.toString()];
                }) === 'undefined' &&
                typeof this.obj.entity.t.find((x) => {
                    return x.id == drawn_entities[i.toString()];
                }) === 'undefined'
            )
                this.delete(drawn_entities[i.toString()]);
        }

        if (settings.obj.enemy.active) {
            for (const key in this.obj.entity[enemy_team]) {
                let exist = drawn_entities.find((x) => {
                    return x == this.obj.entity[enemy_team][key].id;
                });

                if (typeof exist === 'undefined')
                    this.create(this.obj.entity[enemy_team][key], 'enemy');

                let entity = {
                    element: undefined,
                    position: undefined,
                    children: {
                        dot: undefined,
                        health: undefined,
                        name: undefined,
                        weapon: undefined,
                    },
                };

                entity.element = document.querySelector(
                    `[data-id="${this.obj.entity[enemy_team][key].id}"]`
                );
                entity.position = entity.element.getBoundingClientRect();

                let n = Object.keys(entity.children);
                for (let i = 0; i < n.length; i++) {
                    entity.children[n[i]] = entity.element.children[i];
                }

                let position = this.scale(
                    this.obj.entity[enemy_team][key].position[0],
                    this.obj.entity[enemy_team][key].position[1]
                );

                if (entity.position.x !== position.x - 5)
                    entity.element.style.left = position.x - 5 + 'px';

                if (entity.position.y !== position.y - 5)
                    entity.element.style.top = position.y - 5 + 'px';

                this.feature.dot(entity.children.dot);

                if (settings.obj.enemy.health) {
                    this.feature.health(
                        entity.children.health,
                        this.obj.entity[enemy_team][key].health
                    );
                } else {
                    if (entity.children.health.style.display !== 'none')
                        entity.children.health.style.display = 'none';
                }

                if (settings.obj.enemy.name) {
                    this.feature.name(
                        entity.children.name,
                        this.obj.entity[enemy_team][key].name
                    );
                } else {
                    if (entity.children.name.style.display !== 'none')
                        entity.children.name.style.display = 'none';
                }

                if (settings.obj.enemy.weapon) {
                    this.feature.weapon(
                        entity.children.weapon,
                        this.obj.entity[enemy_team][key].weapon
                    );
                } else {
                    if (entity.children.weapon.style.display !== 'none')
                        entity.children.weapon.style.display = 'none';
                }
            }
        } else {
            let n = drawn_entities.length;
            for (let i = 0; i < n; i++) {
                if (
                    typeof this.obj.entity[enemy_team].find((x) => {
                        return x.id == drawn_entities[i.toString()];
                    }) !== 'undefined'
                )
                    this.delete(drawn_entities[i.toString()]);
            }
        }

        if (settings.obj.team.active) {
            for (const key in this.obj.entity[friend_team]) {
                if (this.obj.entity[friend_team][key].local == true) continue;

                let exist = drawn_entities.find((x) => {
                    return x == this.obj.entity[friend_team][key].id;
                });

                if (typeof exist === 'undefined')
                    this.create(this.obj.entity[friend_team][key], 'team');

                let entity = {
                    element: undefined,
                    position: undefined,
                    children: {
                        dot: undefined,
                        health: undefined,
                        name: undefined,
                        weapon: undefined,
                    },
                };

                entity.element = document.querySelector(
                    `[data-id="${this.obj.entity[friend_team][key].id}"]`
                );
                entity.position = entity.element.getBoundingClientRect();

                let n = Object.keys(entity.children);
                for (let i = 0; i < n.length; i++) {
                    entity.children[n[i]] = entity.element.children[i];
                }

                let position = this.scale(
                    this.obj.entity[friend_team][key].position[0],
                    this.obj.entity[friend_team][key].position[1]
                );

                if (entity.position.x !== position.x - 5)
                    entity.element.style.left = position.x - 5 + 'px';

                if (entity.position.y !== position.y - 5)
                    entity.element.style.top = position.y - 5 + 'px';

                this.feature.dot(entity.children.dot);

                if (settings.obj.team.health) {
                    this.feature.health(
                        entity.children.health,
                        this.obj.entity[friend_team][key].health
                    );
                } else {
                    if (entity.children.health.style.display !== 'none')
                        entity.children.health.style.display = 'none';
                }

                if (settings.obj.team.name) {
                    this.feature.name(
                        entity.children.name,
                        this.obj.entity[friend_team][key].name
                    );
                } else {
                    if (entity.children.name.style.display !== 'none')
                        entity.children.name.style.display = 'none';
                }

                if (settings.obj.team.weapon) {
                    this.feature.weapon(
                        entity.children.weapon,
                        this.obj.entity[friend_team][key].weapon
                    );
                } else {
                    if (entity.children.weapon.style.display !== 'none')
                        entity.children.weapon.style.display = 'none';
                }
            }
        } else {
            let n = drawn_entities.length;
            for (let i = 0; i < n; i++) {
                if (drawn_entities[i] == local.id) continue;

                if (
                    typeof this.obj.entity[friend_team].find((x) => {
                        return x.id == drawn_entities[i.toString()];
                    }) !== 'undefined'
                )
                    this.delete(drawn_entities[i.toString()]);
            }
        }

        if (settings.obj.local.active) {
            if (typeof local !== 'undefined') {
                let exist = drawn_entities.find((x) => {
                    return x == local.id;
                });

                if (typeof exist === 'undefined') {
                    this.create(local, 'local');
                }

                let entity = {
                    element: undefined,
                    position: undefined,
                    children: {
                        dot: undefined,
                    },
                };

                entity.element = document.querySelector(
                    `[data-id="${local.id}"]`
                );
                entity.position = entity.element.getBoundingClientRect();

                entity.children.dot = entity.element.children[0];

                let position = this.scale(
                    this.obj.entity[friend_team][local.id].position[0],
                    this.obj.entity[friend_team][local.id].position[1]
                );

                if (entity.position.x !== position.x - 5)
                    entity.element.style.left = position.x - 5 + 'px';

                if (entity.position.y !== position.y - 5)
                    entity.element.style.top = position.y - 5 + 'px';

                this.feature.dot(entity.children.dot);
            }
        } else {
            if (typeof drawn_entities[local.id.toString()] !== 'undefined')
                this.delete(local.id.toString());
        }
    },

    feature: {
        dot: function (entity) {
            if (
                typeof entity.style.display === 'undefinied' ||
                entity.style.display !== 'block'
            )
                entity.style.display = 'block';

            return true;
        },

        health: function (entity, health) {
            if (entity.innerText !== health) entity.innerText = health;

            if (entity.style.display !== 'block')
                Object.assign(entity.style, {
                    display: 'block',
                    left: 15 + 'px',
                    top: -7 + 'px',
                });

            return true;
        },

        name: function (entity, name) {
            let text_width;
            if (entity.innerText !== name) {
                entity.innerText = name;
                text_width = utils.calc_text_width(
                    entity.innerText,
                    '16px Staatliches'
                );
                entity.style.left = -(text_width / 2) + 5 / 2;
            }

            if (entity.style.display !== 'block')
                Object.assign(entity.style, {
                    display: 'block',
                    left: -(text_width / 2) + 5 / 2 + 'px',
                    top: -23 + 'px',
                });

            return true;
        },

        weapon: function (entity, weapon) {
            let text_width;
            if (entity.innerText !== weapon) {
                entity.innerText = weapon;
                text_width = utils.calc_text_width(
                    entity.innerText,
                    '16px Staatliches'
                );
                entity.style.left = -(text_width / 2) + 5 / 2;
            }

            if (entity.style.display !== 'block')
                Object.assign(entity.style, {
                    display: 'block',
                    left: -(text_width / 2) + 5 / 2 + 'px',
                    top: 10 + 'px',
                });

            return true;
        },
    },

    scale: function (x, y) {
        x -= globals.obj.map.x;
        y -= globals.obj.map.y;

        x /= globals.obj.map.scale;
        y /= globals.obj.map.scale;
        x /= 1024.0;
        y /= 1024.0;

        y *= -1.0;

        // the map is a square so don't even bother with dynamic width and shit (not working on mobile atm)
        x *= window.innerHeight;
        y *= window.innerHeight;

        return { x: x, y: y };
    },
};
