const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("node:path")
const isDev = require("electron-is-dev")

const createWindow = () => {
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
    if (isDev) {
        win.webContents.openDevTools()
    }
}

app.whenReady().then(() => {
    ipcMain.handle("ping", () => "pong");

    loadEventHandle()

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


function loadEventHandle() {
    ipcMain.handle("mhlPreProcess:script1", async (event, args) =>{
        console.log("do something here and return the result", args)
        return "processed " + args
    })
    ipcMain.on("mhlPreProcess:streamData", async (event, msg) =>{

        const [replyPort] = event.ports
        for( let i = 0; i < 30; i++ ) {
            replyPort.postMessage(msg)
        }


        replyPort.close()
    })
    ipcMain.handle("mhlProcess:script1", async (event, args) =>{
        console.log("do something here and return the result", args)
        return "processed " +args
    })

}
