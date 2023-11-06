import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import md5 from 'md5'

export function FS(dirName: string) {
  return new FSClass(dirName)
}

class FSClass {
  private CONTENT_FILE = '#' // the name of the hash map file
  private ROW_SEPARATOR = '\n' // separates the entries of the hash map file
  private KEY_SEPARATOR = '|' //  separates the keys from contents in entries
  private dirPath: string | undefined // the root dir path that the class uses
  private dirContent: Map<string, string> = new Map() // the memory stored hash map

  constructor(dirName: string) {
    this.dirPath = path.resolve(dirName)
    this.loadContent()
  }

  /**
   * loads the hash map file
   * @returns void
   */
  private loadContent() {
    const fullPath = `${this.dirPath}/${this.CONTENT_FILE}`
    try {
      if (!existsSync(fullPath)) {
        return
      }
      const rawContent = readFileSync(fullPath)
        .toString()
        .split(this.ROW_SEPARATOR)
        .map((row): [string, string] => {
          const index = row.indexOf(this.KEY_SEPARATOR)
          if (index > 0) {
            return [row.substring(0, index), row.substring(index + 1)]
          } else {
            return ['', '']
          }
        })
        .filter((item) => item[0])
      this.dirContent = new Map<string, string>(rawContent)
      console.log(this.dirContent)
    } catch (error) {
      console.error(
        `Got an error trying to load the hash map file: ${error.message}`
      )
    }
  }

  /**
   * gets the content of a file by its file name
   * @param fileName
   * @returns string content or undefined
   */
  public get(fileName: string): string | undefined {
    try {
      if (fileName === this.CONTENT_FILE) {
        throw new Error('Invalid file name.')
      }
      const actualFileName = this.dirContent.get(fileName) || ''
      return readFileSync(`${this.dirPath}/${actualFileName}`).toString()
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`)
    }
  }

  /**
   * stores a file
   * @param fileName
   * @param content
   * @returns void
   */
  public store(fileName: string, content: string) {
    if (fileName === this.CONTENT_FILE) {
      throw new Error('Invalid file name.')
    }
    try {
      const hash = md5(content)
      if (this.dirContent.get(fileName) === hash) {
        return
      }
      writeFileSync(`${this.dirPath}/${hash}`, content, { flag: 'w' })
      this.dirContent.set(fileName, hash)
      this.writeContent()
    } catch (error) {
      console.error(`Got an error trying to write the file: ${error.message}`)
    }
  }

  /**
   * writes the actual hash map into the hash map file
   */
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
