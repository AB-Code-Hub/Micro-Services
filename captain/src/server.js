import http from 'http'
import app from './app.js'

const server = http.createServer(app) 

server.listen(3002, () => {
  console.log('Captain service is running on http://localhost:3002')
})