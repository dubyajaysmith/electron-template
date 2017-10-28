"use strict()"; /*esversion: 6*/

const electron = require('electron');
const app = electron.app;
const ipc = require('electron').ipcMain;
const fs = require('fs');
const Store = require('electron-store');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1200,
		height: 1000,
		icon: __dirname + '/img/CC1024.png',
		frame: true
	});

	//win.webContents.openDevTools()

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	// Create stores if not there
	const store = new Store();
	if (!store.has('thing')) {
		store.set('thing', {});
	}

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

ipc.on('invokeAction', function (event, path) {
	fileChange(path);
	event.sender.send('actionReply', path);
});

ipc.on('invokeDirChange', function (event, path) {
	saveDir = path
	event.sender.send('dirChanged', path);
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});



ipc.on('save', function (event, obj) {

	const store = new Store();

	const thing = 'something'

	store.set('thing', thing);

	event.sender.send('savedOrg', store.get('thing'));
});

ipc.on('get', function (event, data) {

	const store = new Store();

	event.sender.send('got', store.get('thing'));
});

ipc.on('login', function (event, name) {

	const org = connectToSF(name)
	event.sender.send('loggedIn', org)

});