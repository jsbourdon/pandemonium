import { app, BrowserWindow, ipcMain } from 'electron';
import url from 'url';
import path from 'path';
import { Constants } from './models/Constants';

let mainWindow : Electron.BrowserWindow | null;

app.on('ready', () =>
{
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

