const { app, BrowserWindow, globalShortcut, screen } = require('electron')
const { Menu, MenuItem } = require('electron')
const { ipcMain } = require('electron')

let win;
let dropdownWin;
const menu = new Menu()


menu.append(new MenuItem({
  label: '',
  accelerator: 'Enter',
  click: () => {
    win.hide();
    dropdownWin.hide();
  }
}))

// ON APP LAUNCH
app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const w = (width / 100) * 50;
  const h = Math.round((height / 100) * 8);

  createDropdown(w, h)
  createWindow(w, h)
  
  globalShortcut.register('Alt+A', () => {
    win.isVisible() ? win.hide() : win.show();
    dropdownWin.isVisible() ? dropdownWin.hide() : dropdownWin.show();
    win.focus();
  })
})

Menu.setApplicationMenu(menu)


function createWindow (w, h) {
   
  win = new BrowserWindow({
    width: w,
    height: h,
    x: w / 2,
    y: 24,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    resizable: false
  })

  win.loadFile('index.html')

  // win.focusOnWebView();
  // win.focus();
  // win.webContents.openDevTools()
}

function createDropdown(w, searchBarHeight) {
  const y = 26 + searchBarHeight;

  dropdownWin = new BrowserWindow({
    width: w,
    height: 0,
    x: w / 2,
    y: y,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    resizable: false
  })

  dropdownWin.loadFile('dropdown.html')

  // dropdownWin.openDevTools();
}

ipcMain.on('request-update-dropdown-data', (event, arg) => {
  const dropdownWinHeight = 65 * arg.length;
  const [ winWidth ] = win.getSize(); 
  
  dropdownWin.webContents.send('action-update-dropdown-data', arg);
  dropdownWin.setResizable(true);
  dropdownWin.setSize(winWidth, dropdownWinHeight);
  dropdownWin.setResizable(false);
});

ipcMain.on('request-change-list-item-highlighted', (event, arg) => {
  dropdownWin.webContents.send('action-change-list-item-highlighted', arg);
});
