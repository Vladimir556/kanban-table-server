const { Account } = require('../models/models');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ApiError = require('../error/ApiError');
const status_code = require('../error/ErrorMessages');


const generateJwt = (id, name, email) => {
    return jwt.sign(
        { id, name, email },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
}

class AccountController {
    async registration(req, res, next) {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest(status_code[463]));
        }
        const candidate = await Account.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest(status_code[453]));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const account = await Account.create({ name, email, password: hashPassword });

        const token = generateJwt(account.id, account.name, account.email);
        return res.json({ token })
    }
    async login(req, res, next) {
        const { email, password } = req.body;
        const account = await Account.findOne({ where: { email } });
        if (!account) {
            return next(ApiError.badRequest(status_code[452]));
        }
        let comparePassword = bcrypt.compareSync(password, account.password);
        if (!comparePassword) {
            return next(ApiError.badRequest(status_code[462]));
        }
        const token = generateJwt(account.id, account.name, user.email);
        return res.json({ token });
    }
    async check(req, res) {
        const token = generateJwt(req.account.id, req.account.name, req.account.email);
        return res.json({ token });
    }
    async getAll(req, res) {
        const accounts = await Account.findAll();
        return res.json(accounts);
    }
    async update(req, res, next) {
        try {
            const { id, name, email, password } = req.body;
            if (!id) {
                return next(ApiError.badRequest(status_code[490]));
            }
            if (!email || !password) {
                return next(ApiError.badRequest(status_code[462]));
            }
            const newAccount = await Account.findOne({ where: { id } });
            if (!newAccount) {
                return next(ApiError.badRequest(status_code[452]));
            }
            const hashPassword = await bcrypt.hash(password, 5);

            let account = await Account.update(
                {
                    name: name,
                    email: email,
                    password: hashPassword
                },
                {
                    where: { id },
                }
            );

            account = await Account.findOne(
                {
                    where: { id }
                },
            )

            return res.json(account);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async delOne(req, res, next) {
        try {
            let { id } = req.params;
            const delAccount = await Account.findOne({ where: { id } });
            if (!delAccount) {
                return next(ApiError.badRequest(status_code[452]));
            }
            let account = await Account.destroy({ where: { id } });
            return res.json(`Запись ${id} удалена`);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new AccountController();