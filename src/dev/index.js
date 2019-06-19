// Modules to control application life and create native browser window
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX } from 'electron-devtools-installer'
import { install as installDevtron } from 'devtron'

export default () => {
  installDevtron()

  installExtension(REACT_DEVELOPER_TOOLS, REDUX)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err))
}
