const express = require('express')
const cluster = require('cluster')
const cors = require('cors')

if (cluster.isMaster) {
    cluster.fork()

    cluster.on('exit', (worker, code, signal) => {
        cluster.fork()
    })
} else if (cluster.isWorker) {
    const app = express()

    // Endpoints/Routes
    const subscribeRoute = require('./routes/subscribe')
    const publishRoute = require('./routes/publish')

    // Port Number
    const port = process.env.PORT || 8000;

    // CORS Middleware
    app.use(cors());

    // Body Parser Middleware
    app.use(express.json());
    app.use(express.urlencoded({
        extended: false
    }));

    // Endpoints/Routes
    app.use('/subscribe', subscribeRoute);
    app.use('/publish', publishRoute);

    // Start Server
    app.listen(port, () => {
        console.log('Publisher started on port ' + port)
    })

    process.on('unhandledRejection', (err) => {
        console.error('unhandledRejection: ' + err)
    })

    // Uncaught error catching
    process.on('uncaughtException', (err) => {
        console.error('uncaughtException: ' + err)
        process.exit(1)
    })
}