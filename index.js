'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const template = require('./scripts/menu');
const adb = require('./scripts/adb');

// report crashes to the Electron project
electron.crashReporter.start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;
var menu = Menu.buildFromTemplate(template);

function onClosed() {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null;
}

function createMainWindow() {
  const is2nd = process.argv.indexOf('--2nd') >= 0;
  var opts = {
    width: 1200,
    height: 600,
    minHeight: 600,
    acceptFirstMouse: true,
    titleBarStyle: 'hidden'
  };
  if (is2nd) {
    setOptsForDualScreen(opts);
  }

  const win = new BrowserWindow(opts);
  if (process.env.DEV) {
    win.loadURL('http://localhost:8000/dev.html');
    win.openDevTools();
  } else {
    win.loadURL(`file://${__dirname}/index.html`);
  }
  win.on('closed', onClosed);

  if (menu) {
    Menu.setApplicationMenu(menu);
    menu = null;
  }

  return win;
}

function setOptsForDualScreen(opts) {
  var atomScreen = electron.screen;
  var displays = atomScreen.getAllDisplays();
  var d2 = displays.length > 1 ? displays[1] : null;
  if (d2) {
    opts.x = d2.bounds.x + (d2.size.width - opts.width) / 2;
    opts.y = d2.bounds.y + (d2.size.height - opts.height) / 2;
  }
}

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate-with-no-open-windows', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();

  if (process.env.DEV) {
    const watcher = require('./scripts/watcher.js');
    watcher.watch(app, ['./index.js', './scripts']);
  }
});
