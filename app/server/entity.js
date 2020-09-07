let obj = {
    t: [],
    ct: [],
};

let add = function (entity, id) {
    let team = undefined;
    if (entity.team == 2) team = 't';
    else if (entity.team == 3) team = 'ct';

    if (typeof team === 'undefined') return false;

    obj[team][obj[team].length] = {
        health: entity.health,
        id: id,
        local: entity.local,
        name: entity.name,
        position: entity.position,
        team: entity.team,
        weapon: entity.weapon,
    };

    return true;
};

let clear = function () {
    obj.t = [];
    obj.ct = [];

    return true;
};

module.exports = {
    obj,
    add,
    clear,
};
