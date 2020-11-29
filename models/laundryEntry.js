module.exports = (sequelize, DataTypes) => {
    const laundryEntry = sequelize.define('LaundryEntry', {
        timeCreated: {
            type: DataTypes.TIME,
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return laundryEntry;
};
