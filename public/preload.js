const { contextBridge, ipcRenderer } = require('electron')


const mhlPreProcess = {
  script1: (args) => ipcRenderer.invoke("mhlPreProcess:script1", args),
  executePython: (args, callback) => {
    const { port1, port2 } = new MessageChannel()
    
    ipcRenderer.postMessage(
      "mhlPreProcess:py", 
      args,
      [port2]
    );

    port1.onmessage = (event) => { callback(event.data) }
    port1.onclose = () => { console.log("stream ended") }
  },
  executeJS: (args, callback) => {
    const { port1, port2 } = new MessageChannel()
    
    ipcRenderer.postMessage(
      "mhlPreProcess:js", 
      args,
      [port2]
    );

    port1.onmessage = (event) => { callback(event.data) }
    port1.onclose = () => { console.log("stream ended") }
  },
}

const mhlProcess = {
  script1: (args) => ipcRenderer.invoke("mhlProcess:script1", args),
}

const libraries = { mhlPreProcess, mhlProcess }

Object.keys(libraries).map( lib => {
  contextBridge.exposeInMainWorld(lib, libraries[lib])
})

// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron, 
//   ping: () => ipcRenderer.invoke("ping"),
//   test: () => console.log("whaaaat")
//   // we can also expose variables, not just functions
// })