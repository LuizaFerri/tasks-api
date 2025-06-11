import { IncomingMessage, ServerResponse } from 'node:http'

export async function json(req: IncomingMessage, res: ServerResponse) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(Buffer.from(chunk))
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.setHeader('Content-type', 'application/json')
} 