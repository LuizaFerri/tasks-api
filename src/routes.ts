import { IncomingMessage, ServerResponse } from 'node:http'
import { randomUUID } from 'node:crypto'
import { Database } from './database/database.js'
import { buildRoutePath } from './utils/url.js'
import { Task, CreateTaskDTO } from './models/task.js'
import { parseCSV } from './utils/parse-csv.js'

const database = new Database()

export interface CustomRequest extends IncomingMessage {
  params?: Record<string, string>
  query?: Record<string, string>
  body?: any
}

export interface Route {
  method: string
  path: RegExp
  handler: (req: CustomRequest, res: ServerResponse) => void
}

export const routes: Route[] = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req: CustomRequest, res: ServerResponse) => {
      const { search } = req.query ?? {}

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : undefined)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req: CustomRequest, res: ServerResponse) => {
      const { title, description } = req.body as CreateTaskDTO

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({ error: 'Title and description are required' })
        )
      }

      const task: Task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req: CustomRequest, res: ServerResponse) => {
      const { id } = req.params ?? {}
      const { title, description } = req.body ?? {}

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({ error: 'Title or description is required' })
        )
      }

      const task = database.update('tasks', id as string, {
        title,
        description,
        updated_at: new Date()
      })

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }))
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req: CustomRequest, res: ServerResponse) => {
      const { id } = req.params ?? {}

      const success = database.delete('tasks', id as string)

      if (!success) {
        return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }))
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req: CustomRequest, res: ServerResponse) => {
      const { id } = req.params ?? {}

      const tasks = database.select('tasks') as Task[]
      const task = tasks.find(task => task.id === id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }))
      }

      const isTaskCompleted = !!task.completed_at
      const completed_at = isTaskCompleted ? null : new Date()

      database.update('tasks', id as string, { completed_at })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks/import'),
    handler: async (req: CustomRequest, res: ServerResponse) => {
      const { file } = req.body

      if (!file) {
        return res.writeHead(400).end(
          JSON.stringify({ error: 'CSV file path is required' })
        )
      }

      try {
        const tasks = await parseCSV(file)
        
        for (const taskData of tasks) {
          const task: Task = {
            id: randomUUID(),
            title: taskData.title,
            description: taskData.description,
            completed_at: null,
            created_at: new Date(),
            updated_at: new Date()
          }

          database.insert('tasks', task)
        }

        return res.writeHead(201).end()
      } catch (error) {
        return res.writeHead(400).end(
          JSON.stringify({ error: 'Error processing CSV file' })
        )
      }
    }
  }
] 