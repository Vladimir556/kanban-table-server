const express = require('express')

const sequelize = require('./db')
const models = require('./models/models');

const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const PORT = process.env.PORT || 5000
const cors = require('cors')

let users = [
    {username: 'admin@gmail.com', pass: 'test123456'},
    {username: 'test@test.ru', pass: '132231'},

]
let kanbanData = {}
app.use(cors())
app.use(express.json())


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

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({alter: true})

    /*
      В случае изменения модели {alter: true} вносит изменения в существующие таблицы
      {force: true} - пересоздаёт таблицы заново
      sequelize.sync() - создаёт таблицы, если они не существуют
		*/

    app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))
  } catch (error) {
    console.error(error)
  }
}

start()
