const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define(
  'user',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
  }
)

const Room = sequelize.define(
  'room',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
  }
)

const Card = sequelize.define(
  'card',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    content: {type: DataTypes.STRING, allowNull: false },
  }
)

const Column = sequelize.define(
  'column',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  }
)

const RoomUser = sequelize.define(
  'roomUser',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  }
)

User.hasMany(Room, {onUpdate: 'cascade', foreignKey: 'ownerId', as: 'owner'})
User.hasMany(Card, {onUpdate: 'cascade'})

Room.belongsTo(User, { as: 'owner' ,foreignKey: 'ownerId'})
Room.belongsToMany(User, {through: RoomUser})
User.belongsToMany(Room, {through: RoomUser})


Room.hasMany(Column, {onDelete: 'cascade'})
Column.hasMany(Card, {onDelete: 'cascade'})

Column.belongsTo(Room)
Card.belongsTo(Column)
Card.belongsTo(User)


module.exports = {
  User,
  Room,
  Card,
  Column,
  RoomUser
}
