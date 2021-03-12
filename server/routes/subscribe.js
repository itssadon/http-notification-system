const express = require('express')
const {
    curly
} = require('node-libcurl')
const {
    URL
} = require('url')
const dockerIpTools = require("docker-ip-get");

const router = express.Router()

router.post('/:topic', async (req, res) => {
    const topic = req.params.topic
    let url = ""
    if (dockerIpTools.isInDocker()) {
        const reqUrl = new URL(req.body.url)
        const port = reqUrl.port
        const path = reqUrl.pathname
        const internalHost = '172.17.0.1'
        url = `http://${internalHost}:${port}${path}`
    } else {
        url = req.body.url
    }

    console.log(`Subscribing client to ${topic} topic.`);
    try {
        const {
            data
        } = await curly.post(`${url}`, {
            postFields: JSON.stringify({
                topic: `${topic}`
            }),
            httpHeader: [
                'Content-Type: application/json'
            ],
        })

        console.log('SUCCESS:', data)
        return res.status(200).json({
            url: url,
            topic: data.topic
        })
    } catch (err) {
        console.error('ERROR:', err.message)
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
})

module.exports = router