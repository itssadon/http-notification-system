const express = require('express')
const Redis = require('ioredis')

const router = express.Router()
const redis = new Redis()

router.post('/:topic', async (req, res) => {
    const topic = req.params.topic
    const data = req.body

    await redis.publish(topic, JSON.stringify(data), () => {
        console.log(`Published message ${topic} listeners.`);
    });

    return res.status(200).json({
        topic: topic,
        data: data,
    });
})

module.exports = router