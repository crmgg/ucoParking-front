const http = require('http')
const { createProxyServer } = require('http-proxy')

const target = process.env.VM_API_UPSTREAM || 'http://34.132.122.87:8000'
const port = Number(process.env.PORT || 8080)
const proxy = createProxyServer({
  changeOrigin: true,
  xfwd: true,
  proxyTimeout: 0,
  timeout: 0
})

const isStreamRequest = (url) => url && url.includes('/students/stream')

proxy.on('proxyRes', (proxyRes, req, res) => {
  if (!isStreamRequest(req.url)) return
  res.setHeader('X-Accel-Buffering', 'no')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
})

http
  .createServer((req, res) => {
    if (isStreamRequest(req.url)) {
      req.headers.connection = 'keep-alive'
      res.setHeader('X-Accel-Buffering', 'no')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
    }

    proxy.web(req, res, { target, selfHandleResponse: false }, (error) => {
      if (res.headersSent) return
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end(`API no disponible: ${error?.message || 'revisa VM y puerto 8000'}`)
    })
  })
  .listen(port, () => {
    console.log(`Proxy HTTPS Render -> ${target} (puerto ${port})`)
  })
