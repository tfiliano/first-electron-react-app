const async = require("async");
const { spawn } = require("child_process");


class ChildProcessHandler {
    constructor({ ipcMain, maxConcurrent = 1 }) {
        this.childProcessList = new Map();
        this.ipcMain = ipcMain;
        this.processQueue = async.queue(this.executeProcess.bind(this), maxConcurrent)
    }

    enqueue(params) {
        console.log(params)
        this.processQueue.push(params);
        this.childProcessList.set(params.id, true);
    }

    executeProcess(task, callback) {
        const { cmd, file, args, id, onData, onFinish } = task;

        const child = spawn(cmd, [file, ...args]);
        let dataBuffer;

        child.on("exit", (code, signal) => {
            console.log("process exited: ", { code, signal });
            callback();
        })
        child.on("close", (code, signal) => {
            console.log("process closed! ", { code, signal });
            
            if (onFinish && typeof onFinish == "function") onFinish(dataBuffer);
        })
        child.on("error", (error) => {
            console.log("process errored! ", { error });
        })

        child.stdout.on("data", async (data) => {
            dataBuffer += data.toString();

            if (onData && typeof onData == "function") onData(data.toString());
            console.log("send data to UI: ", data.toString());
        })
        child.stdout.on("error", async (data) => {
            console.log("send error to UI: ", data);
        })
    }

    killProcess(id) {
        this.processQueue.remove( task => task.id === id);
        const child = this.childProcessList.get(id);
        if (child) {
            child.kill();
            this.childProcessList.delete(id);
        }
    }

}

module.exports = ChildProcessHandler;