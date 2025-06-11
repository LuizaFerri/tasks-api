import { IncomingMessage } from 'node:http'

declare module 'node:http' {
  interface IncomingMessage {
    body?: any
  }
} 