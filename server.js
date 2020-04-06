const express = require('express')
const http = require('http')
const io = require('socket.io')
const path = require('path')

const TwitchClient = require('twitch').default
const TwitchStream = require('twitch').HelixStream
const WebhookListener = require('twitch-webhooks').default

const { userId, clientId, secret } = require('./credentials')

const app = express()
const server = http.createServer(app)
const socket = io(server, { origins: '*:*' })
const twitchClient = TwitchClient.withClientCredentials(clientId, secret)

const webhookConfig = {
	hostName: 'c5c8942d.ngrok.io',
	port: 3020,
	reverseProxy: { port: 443, ssl: true },
}

const getWebhookSubscription = async () => {
	const listener = await WebhookListener.create(twitchClient, webhookConfig)
	listener.listen()
	return await listener.subscribeToStreamChanges(
		userId,
		(stream = TwitchStream) => {
			console.log('new data emitted:', stream.title)
			socket.emit('newData', stream.title)
		},
	)
}
const subscription = getWebhookSubscription()

socket.on('connection', () => {
	console.log('websocket connection established with client')
})

app.use(express.static(path.join(__dirname, 'build')))
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

server.listen(3010, () => console.log('listening on 3010'))
