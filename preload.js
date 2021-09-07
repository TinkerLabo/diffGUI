const { remote } = require('electron');
const { dialog, BrowserWindow } = remote;
const Encoding = require('encoding-japanese');

window.remote = remote;
window.BrowserWindow = BrowserWindow;
window.dialog = dialog;
window.Encoding = Encoding;

const fs = require('fs');
window.fs = fs;

const path = require('path');
window.path = path;

const Diff = require('diff');
window.Diff = Diff;

// window.jQuery = window.$ = require('./render/js/jquery-3.6.0.min.js');

//window.jQuery = window.$ = require('./lib/jquery');