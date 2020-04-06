import React from 'react'
import socketIOClient from 'socket.io-client'
import './App.css'

const socket = socketIOClient('http://localhost:3010')

const App = () => {
	const [state, setState] = React.useState()

	React.useEffect(() => {
		socket.on('connect', () =>
			console.log('websocket connection established with server'),
		)
		socket.on('newData', (data) => setState(data))
		return () => socket.off('newData')
	})

	return (
		<div className='App'>
			<h1>Simple Socket WebHook Reverse Proxy Example</h1>
			You can find socket data in the console, or below:
			<br />
			<br />
			{state}
		</div>
	)
}

export default App
