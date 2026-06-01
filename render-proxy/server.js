const http = require('http')
const { createProxyServer } = require('http-proxy')

const target = process.env.VM_API_UPSTREAM || 'http://34.132.122.87:8000'
const port = Number(process.env.PORT || 8080)
const proxy = createProxyServer({ changeOrigin: true, xfwd: true })

http
  .createServer((req, res) => {
    proxy.web(req, res, { target }, () => {
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('API no disponible: revisa que la VM este encendida y el puerto 8000 abierto.')
    })
  })
  .listen(port, () => {
    console.log(`Proxy HTTPS Render -> ${target} (puerto ${port})`)
  })
