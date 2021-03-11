const express = require('express')
const cluster = require('cluster')
const cors = require('cors')
const Redis = require('ioredis')

if (cluster.isMaster) {
    cluster.fork()

    cluster.on('exit', (worker, code, signal) => {
        cluster.fork()
    })
} else if (cluster.isWorker) {
    const app = express()
    const redis = new Redis()

    redis.on('message', (topic, object) => {
        console.log(`Received the following from ${topic}: ${object}`)

        return {
            topic: topic,
            data: object
        }
    })

    // Port Number
    const port = process.env.PORT || 9000

    // CORS Middleware
    app.use(cors());

    // Body Parser Middleware
    app.use(express.json())
    app.use(express.urlencoded({
        extended: false
    }))

    app.post('/:serverName', async (req, res) => {
        const serverName = req.params.serverName
        const {
            topic
        } = req.body

        await redis.subscribe(topic, (error, count) => {
            if (error) {
                console.log(`Error Subscribing to the ${topic} topic.`)
                return res.status(500).json({
                    status: false,
                    topic: topic
                })
            }
            console.log(`Subscribed to ${count} topic. ${serverName} is listening for updates on the ${topic} topic.`)
            return res.status(200).json({
                status: true,
                topic: topic
            })
        })
    })

    // Start Server
    app.listen(port, () => {
        console.log('Subscriber started on port ' + port)
    })

    // Uncaught error catching
    process.on('uncaughtException', (err) => {
        console.error('uncaughtException: ' + err)
        process.exit(1)
    })
}