import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import md5 from 'md5'

export function FS(dirName: string) {
  return new FSClass(dirName)
}

export class FSClass {
  private CONTENT_FILE = '#'
  private ROW_SEPARATOR = '\n'
  private KEY_SEPARATOR = '|'
  private dirPath: string | undefined
  private dirContent: Map<string, string> = new Map()

  constructor(dirName: string) {
    this.dirPath = path.resolve(dirName)
    this.loadContent()
  }

  private loadContent() {
    const fullPath = `${this.dirPath}/${this.CONTENT_FILE}`
    if (!existsSync(fullPath)) {
      return
    }
    const rawContent = readFileSync(fullPath)
      .toString()
      .split(this.ROW_SEPARATOR)
      .map((row): [string, string] => {
        const index = row.indexOf(this.KEY_SEPARATOR)
        if (index > 0) {
          return [row.substring(0, index), row.substring(index)]
        } else {
          return ['', '']
        }
      })
      .filter((item) => item[0])
    this.dirContent = new Map<string, string>(rawContent)
  }

  public get(fileName: string): string | undefined {
    try {
      const actualFileName = this.dirContent.get(fileName) || ''
      return readFileSync(`${this.dirPath}/${actualFileName}`).toString()
      // console.log(data.toString())
    } catch (error) {
      console.error(`Got an error trying to read the file: {error.message}`)
    }
  }

  public store(fileName: string, content: string) {
    try {
      const hash = md5(content)
      if (this.dirContent.get(fileName) === hash) {
        return
      }
      writeFileSync(`${this.dirPath}/${hash}`, content, { flag: 'w' })
      this.dirContent.set(fileName, hash)
      this.writeContent()
    } catch (error) {
      console.error(`Got an error trying to write the file: {error.message}`)
    }
  }

  private writeContent() {
    try {
      writeFileSync(
        `${this.dirPath}/${this.CONTENT_FILE}`,
        [...this.dirContent.entries()]
          .map((entry) => entry[0] + this.KEY_SEPARATOR + entry[1])
          .join(this.ROW_SEPARATOR)
      )
    } catch (error) {
      console.error('Error when trying to write content file.')
    }
  }
}
