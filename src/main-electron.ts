import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import { Constants } from './models/Constants';
import url from 'url';
import path from 'path';
import fs from 'fs';

let mainWindow : Electron.BrowserWindow | null;

function registerModuleProtocol(): void
{
    // Register custom protocal to allow Electron Renderers
    // to load javascript modules transpiled from typescript.
    protocol.registerBufferProtocol("module", (request, callback) =>
    {
        const url: string = request.url.substr(9);
        const filePath: string = path.normalize(`${__dirname}/${url}`);
        const fileData: Buffer = fs.readFileSync(filePath);

        let reply: any = null;

        const ext: string = path.extname(filePath);
        if (ext !== '.map')
        {
            const header: Buffer = Buffer.from("let exports = {};");
            const repliedData: Buffer = Buffer.concat([header, fileData], header.length + fileData.length);

            reply =
                {
                    data: repliedData,
                    mimeType: 'text/javascript'
                };
        }
        else
        {
            reply =
                {
                    data: fileData,
                    mimeType: 'application/json'
                };
        }

        callback(reply);
    });
}

app.on('ready', () =>
{
    registerModuleProtocol();

    const mainWindowPath : string = path.join(__dirname, '../src/views/MainWindow.html');
    let mainWindowUrl : url.URL = new url.URL(mainWindowPath);
    mainWindowUrl.protocol = 'file:';
    const mainWindowUrlStr : string = url.format(mainWindowUrl);

    const windowOptions : Electron.BrowserWindowConstructorOptions = 
    {
        width: 1920, 
        height: 1080,
        webPreferences: { nodeIntegration: true }
    };
    
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(mainWindowUrlStr);

    const winHdlBuffer: Buffer = mainWindow.getNativeWindowHandle();
    const winHdl: bigint = winHdlBuffer.readBigUInt64LE(0);
    
    console.log(winHdl);
});

app.on('quit', () =>
{
    mainWindow = null;
});

ipcMain.on(Constants.Messages.TestButtonClicked, (event: Electron.IpcMainEvent, ..._args: any[]) => 
{
    event.sender.send(Constants.Messages.ButtonClickReply, "Hello");
});

