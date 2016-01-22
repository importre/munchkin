'use strict';

var Rx = require('rxjs/Rx');
var adb = require('adbkit');
var client = adb.createClient();
var path = require('path');
var fs = require('fs');
var os = require('os');

const ipcMain = require('electron').ipcMain;
ipcMain.on('check-devices', function (event, arg) {
  var devices = client.trackDevices();
  Rx.Observable.fromPromise(devices)
      .subscribe(tracker => {
        tracker.on('add', device => {
          event.sender.send('on-add-device', device);
        });

        tracker.on('change', device => {
          event.sender.send('on-change-device', device);

        });
        tracker.on('remove', device => {
          event.sender.send('on-remove-device', device);
        });

      }, error => {
        console.log(error);
      });
});

ipcMain.on('load-files', function (event, params) {
  if (!params || !params.device || !params.dir) return;
  const dir = client.readdir(params.device.id, params.dir);
  Rx.Observable.fromPromise(dir)
      .subscribe(files => {
        files.forEach(f => {
          f.time = f.mtime.toLocaleString('en-US');
          f.isDirectory = f.isDirectory();
          f.isFile = f.isFile();
          f.absPath = path.join(params.dir, f.name);
          f.symLink = f.isSymbolicLink() ? path.resolve(f.absPath) : null;
        });
        event.sender.send('on-load-files', {
          device: params.device,
          dir: params.dir,
          init: params.init,
          files: files,
          pos: params.pos
        });
      }, error => {
        console.log(error);
      });
});

ipcMain.on('open-file', function (event, params) {
  const p = client.pull(params.device.id, params.absPath);
  const tmp = path.resolve(os.tmpdir(), '1');

  Rx.Observable.fromPromise(p)
      .subscribe((transfer) => {
        transfer.on('progress', (stat) => {
          transfer.pipe(fs.createWriteStream(tmp));
        });

        transfer.on('end', () => {
          fs.readFile(tmp, 'utf8', function (err, data) {
            event.sender.send('on-load-file', {
              name: params.absPath,
              data: data,
              error: null
            });
          });
        });

        transfer.on('error', (error) => {
          event.sender.send('on-load-file', {
            data: null,
            error: error
          });
        })
      }, error => {
        console.log(error);
      });
});
