import { createServer } from 'node:http'
import { json } from './middlewares/json.js'
import { routes, CustomRequest, Route } from './routes.js'
import { extractQueryParams } from './utils/url.js'

const server = createServer(async (req, res) => {
  const { method, url } = req

  await json(req as CustomRequest, res)

  const route = routes.find((route: Route) => {
    return route.method === method && route.path.test(url as string)
  })

  if (route) {
    const routeParams = url?.match(route.path)

    const { query, ...params } = routeParams?.groups ?? {}

    const request = req as CustomRequest
    request.params = params
    request.query = query ? extractQueryParams(query) : {}

    return route.handler(request, res)
  }

  return res.writeHead(404).end(JSON.stringify({ error: 'Not found' }))
})

server.listen(3333, () => {
  console.log('🚀 Server running on port 3333')
})
