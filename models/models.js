const sequelize = require('../db');
const { DataTypes } = require('sequelize'); //Описание типов данных

const Account = sequelize.define('account', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
})

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING },
})

const Role = sequelize.define('role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
})

const Permisson = sequelize.define('permisson', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    dragColumns: { type: DataTypes.BOOLEAN },
    dragCards: { type: DataTypes.BOOLEAN },
    createColumns: { type: DataTypes.BOOLEAN },
    createCards: { type: DataTypes.BOOLEAN },
    updateColumns: { type: DataTypes.BOOLEAN },
    updateCards: { type: DataTypes.BOOLEAN },
    deleteColumns: { type: DataTypes.BOOLEAN },
    deleteCards: { type: DataTypes.BOOLEAN },
    inviteUser: { type: DataTypes.BOOLEAN },
    deleteUser: { type: DataTypes.BOOLEAN },
    assignUser: { type: DataTypes.BOOLEAN },
})

const UserRole = sequelize.define('userRole', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Card = sequelize.define('card', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    data: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
})

const Column = sequelize.define('column', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
})

const Kanban = sequelize.define('kanban', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
})

const Room = sequelize.define('room', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
})

const RoomUser = sequelize.define('roomUser', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})
//  Account
Account.hasMany(User, {onDelete: 'cascade'});
User.belongsTo(Account);
//  User
User.hasMany(Card);
User.belongsTo(Room);
User.belongsToMany(Room, {through:RoomUser});
User.belongsToMany(Role, {through:UserRole});
//  Role
// Role.hasMany(Permisson);
Role.belongsToMany(User, {through: UserRole});
Role.belongsTo(Room);
// Permisson
Permisson.belongsTo(Role);
//  Room
Room.hasMany(Kanban);
Room.hasMany(Role);
Room.belongsToMany(User, {through: RoomUser});
//  Kanban
Kanban.hasMany(Column);
Kanban.belongsTo(Room);
//  Column
Column.hasMany(Card);
Column.belongsTo(Kanban, {onDelete: 'cascade'});
//  Card
Card.belongsTo(Column, {onDelete: 'cascade'});

module.exports={
    Account,
    User,
    Role,
    Permisson,
    UserRole,
    Room,
    RoomUser,
    Kanban,
    Column,
    Card,
}