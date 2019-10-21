import { ipcRenderer } from 'electron';
import { Constants } from '../models/Constants';

const testBtn : HTMLElement | null = document.getElementById(Constants.HtmlIds.TestButtonId);
if (testBtn)
{
    testBtn.addEventListener('click', () =>
    {
        ipcRenderer.send(Constants.Messages.TestButtonClicked, "Hi");
    });
}

ipcRenderer.on(Constants.Messages.ButtonClickReply, (_event : Electron.IpcRendererEvent, ...args: any[]) =>
{
    if (args[0])
    {
        console.log(args[0]);
    }
});

