import { spawn } from 'child_process'
import readline from 'readline'
import { Observable, fromEvent } from 'rxjs'
import { takeUntil } from "rxjs/operators"

const createReadlineInterface = stream => readline.createInterface({
  input: stream
})

export default ({ id, path, cmd, args, sender }) => {
  const newProcess = spawn(cmd, args, { cwd: path })

  let isOutputFinished
  let isErrorFinished

  const rlStdout = createReadlineInterface(newProcess.stdout)
  const rlStderr = createReadlineInterface(newProcess.stderr)

  const observable = Observable.create(observer => {
    rlStdout.on('line', line => observer.next(line))
    rlStderr.on('line', error => observer.error(error))
    
    rlStdout.on('close', () => {
      isOutputFinished = true
    })
    rlStderr.on('close', () => {
      isErrorFinished = true
    })

    if (isOutputFinished && isErrorFinished) {
      observer.complete()
    }
  })

  observable.subscribe(
    output => sender.send(`${id}-data`, output.toString('utf-8')),
    error => sender.send(`${id}-error`, error.toString('utf-8')),
    () => sender.send(`${id}-complete`, 'complete')
  )
}
