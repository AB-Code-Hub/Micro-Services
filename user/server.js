import http from 'http'
import app from './app.js'

const server = http.createServer(app) 

server.listen(3001, () => {
  console.log('User service is running on http://localhost:3001')
})