require('dotenv').config();


const express = require('express');
const cors = require('cors');

const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routes/routes');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 5000;

const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

app.use(cors())                     // Нужен, чтобы принимать запросы с браузера
app.use(express.json())             // Необходимо, чтобы приложение могло парсить JSON формат  

app.use('/api', router)             // '/api' - URL, по которому должен обрабатывается router

app.use(errorHandler);              // Обработка ошибок !!!Обязательно идёт последним!!!

//Все операции с БД - асинхронные
const start = async () => {
    try {
        await sequelize.authenticate();         //Установка подключения к БД
        await sequelize.sync({alter: true});    //Сверяем состояние БД со схемой данных

        /* В случае изменения модели {alter: true} вносит изменения в существующие таблицы 
        * {force: true} - пересоздаёт таблицы заново
        * sequelize.sync() - создаёт таблицы, если они не существуют
        */

        app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();














let users = [
    {username: 'admin@gmail.com', pass: 'test123456'},
    {username: 'test@test.ru', pass: '132231'},

]
let kanbanData = {}

app.ws('/', (ws, req) => {
    ws.send("Подключено успешно")
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        
        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                console.log(`user ${msg.username} connected to server`)
                break
            case "kanban":
                console.log(msg)
                kanbanData = msg.kanbanData
                broadcastConnection(ws,msg)
                break
        }
        
    })
    
})

app.post('/registr', (req,res) => {
    try {
        if(isContains(users,req.body)){
            return res.json({message: "User already exist",status: false})
        }
        else{
            users.push({username:req.body.username, pass:req.body.pass})
            return res.status(200).json({message: "User created success",status: true})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

app.post('/login', (req,res) => {
    try {
        if(isContains(users,req.body)){
            return res.status(200).json({message: "User found",status: true})
        }
        else{
            return res.status(200).json({message: "User not found",status: false})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

app.get('/getKanban', (req,res) => {
    try {
        if(kanbanData){
            return res.status(200).json({kanbanData:kanbanData,status:true})
        }
        else{
            return res.status(200).json({kanbanData: {},status:false})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json('error')
    }
})

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id){
            client.send(JSON.stringify(msg))
        }
    })
}

const isContains = (arrObj, obj) => {
    let result = false
    arrObj.map(elem => {
        if(JSON.stringify(elem) == JSON.stringify(obj)){
            result = true
        }
    })
    return result
}