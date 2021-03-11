const express = require('express')
const Redis = require('ioredis')
const {
    curly
} = require('node-libcurl')

const router = express.Router()

router.post('/:topic', async (req, res) => {
    const topic = req.params.topic
    const url = req.body.url

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
        console.error('ERROR:', e.message)
        return res.status(500).json({
            status: false,
            message: err.message
        })
    }
})

module.exports = router