import { readFile } from 'node:fs/promises'
import { Injectable } from '@nestjs/common'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

@Injectable()
export class AppService {
  constructor() {}

  async getHello() {
    const template = await readFile('./views/index.html', 'utf-8')
    const app = createSSRApp({
      template,
      setup() {
        return { message: 'Hello, World!' }
      },
    })
    const html = await renderToString(app)
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `
  }
}
