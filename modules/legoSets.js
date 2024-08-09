const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectModule: require('pg'),
    port: 5432,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

const Theme = sequelize.define('Theme', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING
}, {
    timestamps: false
});

const Set = sequelize.define('Set', {
    set_num: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING
}, {
    timestamps: false
});

Set.belongsTo(Theme, { foreignKey: 'theme_id' });

function initialize() {
    return sequelize.sync();
}

function getAllSets() {
    return Set.findAll({ include: [Theme] });
}

function getSetByNum(setNum) {
    return Set.findOne({
        where: { set_num: setNum },
        include: [Theme]
    }).then(set => {
        if (set) {
            return set;
        } else {
            throw new Error("Set not found");
        }
    });
}

function getSetsByTheme(theme) {
    return Set.findAll({
        include: [Theme],
        where: {
            '$Theme.name$': {
                [Sequelize.Op.iLike]: `%${theme}%`
            }
        }
    }).then(sets => {
        if (sets.length > 0) {
            return sets;
        } else {
            throw new Error("No sets found for the given theme");
        }
    });
}

function addSet(setData) {
    return Set.create({
        set_num: setData.set_num,
        name: setData.name,
        year: setData.year,
        num_parts: setData.num_parts,
        img_url: setData.img_url,
        theme_id: setData.theme_id
    }).then(() => {
    }).catch((err) => {
        const errorMessage = err.errors ? err.errors[0].message : "Unknown error occurred";
        throw new Error(errorMessage);
    });
}

function editSet(set_num, setData) {
    return Set.update(setData, {
        where: { set_num: set_num }
    }).then(() => {
    }).catch((err) => {
        const errorMessage = err.errors ? err.errors[0].message : "Unknown error occurred";
        throw new Error(errorMessage);
    });
}

function deleteSet(set_num) {
    return Set.destroy({
        where: { set_num: set_num }
    }).then(() => {
    }).catch((err) => {
        const errorMessage = err.errors ? err.errors[0].message : "Unknown error occurred";
        throw new Error(errorMessage);
    });
}

function getAllThemes() {
    return Theme.findAll().then(themes => {
        return themes;
    });
}

module.exports = {
    initialize,
    getAllSets,
    getSetByNum,
    getSetsByTheme,
    addSet,
    editSet,
    deleteSet,
    getAllThemes
};
