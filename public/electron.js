const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path")
const isDev = require("electron-is-dev")

const createWindow = () =>{
    const win = new BrowserWindow({
        width: 1280,
        height: 920,
        webPreferences: {
            nodeIntegration: true, 
            preload: path.join(__dirname, "preload.js")
        }
    })

    const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`
    win.loadURL(startUrl)
}

app.whenReady().then( ()=> {
    ipcMain.handle("ping", ()=>"pong");

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})