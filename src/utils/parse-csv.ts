import { createReadStream } from 'node:fs'
import { parse } from 'node:path'

export function parseCSV(path: string): Promise<Array<{ title: string, description: string }>> {
  const tasks: Array<{ title: string, description: string }> = []
  
  return new Promise((resolve, reject) => {
    const stream = createReadStream(path)
    let headers: string[] = []
    let buffer = ''

    stream.on('data', (chunk) => {
      buffer += chunk.toString()
      
      const lines = buffer.split('\n')
      
      if (!headers.length && lines.length > 0) {
        headers = lines[0].split(',').map(header => header.trim())
        lines.shift()
      }
      
      while (lines.length > 1) {
        const line = lines.shift() as string
        const values = line.split(',').map(value => value.trim())
        
        const task = {
          title: values[headers.indexOf('title')],
          description: values[headers.indexOf('description')]
        }
        
        if (task.title && task.description) {
          tasks.push(task)
        }
      }
      
      buffer = lines[0] || ''
    })

    stream.on('end', () => {
      if (buffer) {
        const values = buffer.split(',').map(value => value.trim())
        const task = {
          title: values[headers.indexOf('title')],
          description: values[headers.indexOf('description')]
        }
        
        if (task.title && task.description) {
          tasks.push(task)
        }
      }
      
      resolve(tasks)
    })

    stream.on('error', reject)
  })
} 