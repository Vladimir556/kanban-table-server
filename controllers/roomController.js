const { Room, User, RoomUser } = require('../models/models');

const ApiError = require('../error/ApiError');
const status_code = require('../error/ErrorMessages');

class RoomController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) {
                return next(ApiError.badRequest(status_code[474]));
            }
            const ownerId = req.user.id;
            const room = await Room.create({ name, ownerId });
            const roomId = room.id;
            const user = await User.create({ username:'admin', ownerId });
            const userId = user.id;
            const roomUser = await RoomUser.create({userId, roomId});
            return res.json(roomUser);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async addUser(req, res, next) {
        try {
            const {id, newAccountId} = req.body;
            if (!newAccountId){
                return next(ApiError.badRequest(status_code[473]));
            }
            const ownerId = req.user.id;
            const room = await Room.findOne({where: {id}})
            if  (ownerId != room.ownerId){
                return next(ApiError.badRequest(status_code[472]));
            }
            const newUser = await User.create({username:'', newAccountId})
            const newUserId = newUser.id;
            const roomId = room.id;
            const roomUser = await RoomUser.create({newUserId, roomId});
            return res.json(roomUser);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async delete(req, res, next) {
        try {
            let { id } = req.params;
            const delRoom = await Room.findOne({where: { id } })
            if (!delRoom){
                return next(ApiError.badRequest(status_code[475]));
            }
            const ownerId = req.user.id;
            if (delRoom.ownerId != ownerId){
                return next(ApiError.badRequest(status_code[472]));
            }
            let room = await Room.destroy({ where: { id }});
            return res.json(`Комната ${delRoom.name} удалена`);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async update(req, res, next) {
        try {
            const { id, name, newOwnerID } = req.body;
            if (!id) {
                return next(ApiError.badRequest(status_code[490]));
            }
            if (!newOwnerID){
                return next(ApiError.badRequest(status_code[473]));
            }
            const checkOwner = await User.findOne({where: { id:newOwnerID }});
            if (!checkOwner){
                return next(ApiError.badRequest(status_code[473]));
            }
            const checkRoom = await Room.findOne({where: { id }});
            if (!checkRoom){
                return next(ApiError.badRequest(status_code[475]));
            }

            let room = await Room.update(
                {
                    name: name,
                    ownerId: newOwnerID
                },
                {
                    where: {id}
                }
            );

            room = await Room.findOne({where: { id }});
            
            return res.json(room);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res, next){
        try {
            const userId = req.user.id;
            if (!userId){
                return next(ApiError.badRequest(status_code[492]));
            }


        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getOne(req, res, next){
        try {
            const { id } = req.params;
            const room = await Room.findOne({where: { id }});
            return res.json(room)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}
module.exports = new RoomController();