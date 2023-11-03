import { FS } from './FS.js'

const fs = FS('./data')
fs.store('filename1', 'a very long string1')
fs.store('filename2', 'a very long string1')
fs.store('filename3', 'a very long string3')
fs.store('filename4', 'a very long string1')
fs.store('filename5', 'a very long string1')
fs.store('filename6', 'a very long string3')

console.log(fs.get('filename1')) // gets 'a very long string1'
fs.store('filename1', 'something else')
console.log(fs.get('filename2')) // gets 'a very long string1'
console.log(fs.get('filename3')) // gets 'a very long string3'
console.log(fs.get('filename4')) // gets 'a very long string1'
console.log(fs.get('filename5')) // gets 'a very long string1'
console.log(fs.get('filename6')) // gets 'a very long string3'
console.log(fs.get('filename1')) // something else'
