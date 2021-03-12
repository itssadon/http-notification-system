# http-notification-system
Personal Publish-Subscribe System

## Challenge
We'll be creating a HTTP notification system.

A server (or set of servers) will keep track of topics -> subscribers where a topic is a string and a subscriber is an HTTP endpoint.

When a message is published on a topic, it should be forwarded to all subscriber endpoints.

## Usage
### 1. Locally
- Install dependencies from the root of the project

    `npm install`

- Navigate to the server directory and start publisher server in one terminal window/tab

    `cd server && npm start`