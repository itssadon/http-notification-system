# http-notification-system
Personal Publish-Subscribe System

## Challenge
We'll be creating a HTTP notification system.

A server (or set of servers) will keep track of topics -> subscribers where a topic is a string and a subscriber is an HTTP endpoint.

When a message is published on a topic, it should be forwarded to all subscriber endpoints.

## Usage
### 1. Locally
For when docker is not installed

- Navigate to the root of the project
- Install dependencies by running the below in shell from the root of the project

    `npm install`

- Start redis

    `brew services start redis`

- Navigate to the client directory in the project and start subscriber

    `cd client && npm start`

- Open a new shell window/tab
- Navigate to the server directory in the project and start subscriber

    `./start-server.sh`

### Docker
Make sure docker is installed

- Navigate to root of the project and run

    `./start-server.sh`