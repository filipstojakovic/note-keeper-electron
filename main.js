const electron = require('electron');
const path = require('path');
var AutoLaunch = require('auto-launch');
const { app, BrowserWindow, Menu, Tray } = electron;

let mainwindow;

var autoLauncher = new AutoLaunch({
  name: "note-keeper"
});
// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) return;
   autoLauncher.enable();
}).catch(function (err) {
  throw err;
});

//listen for app to be ready
app.on('ready', function () {

  const display = electron.screen.getPrimaryDisplay();
  const width = display.bounds.width;

  mainwindow = new BrowserWindow({
    frame:false,
    width: 400, 
    height: 400,
    skipTaskbar: true,
    icon:'./icon.png',
    x: width - 400,
    y:0

 });

 tray = new Tray(path.join(__dirname, 'icon.png'));
 tray.setContextMenu(Menu.buildFromTemplate([
  {
    label: 'Show App', click: function () {
      mainwindow.show();
    }
  },
  {
    label: 'Minimize', click: function () {
      mainwindow.hide();
    }
  },
  {
    label: 'Quit', click: function () {
      isQuiting = true;
      app.quit();
    }
  }
]));


tray.on('click',()=>
{
  mainwindow.isMinimized() ? mainwindow.show(): mainwindow.hide();
  mainwindow.setAlwaysOnTop(!mainwindow.isAlwaysOnTop());
})

  mainwindow.setMenuBarVisibility(false);
  //load html
  mainwindow.loadURL("https://keep.google.com/u/0/");
  mainwindow.webContents.on('did-finish-load', () => {
    let code = `
    document.getElementById("ognwrapper").style.display = 'none';
    var elements = document.getElementsByClassName("PvRhvb PvRhvb-qAWA2");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = 'none';
    }
    `;
    mainwindow.webContents.executeJavaScript(code);
    //mainwindow.openDevTools();
  });

  mainwindow.on('minimize', function (event) {
    event.preventDefault();
    isMinimized=true;
    mainwindow.hide();
  });

});

const gotTheLock = app.requestSingleInstanceLock()
    
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainwindow) {
      if (mainwindow.isMinimized()) mainwindow.restore()
      mainwindow.focus()
    }
  })
}
