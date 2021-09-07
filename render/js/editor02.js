var editor02 = null;
var folder_path02 = null;
var folder_items02 = null;
// var sidebar02 = null;
// var footer02 = null;
var current_fname02 = null;
var change_flg02 = false;

window.addEventListener('DOMContentLoaded', onLoad02);

function onLoad02() {
  // let w = BrowserWindow.getFocusedWindow();
  // w.on('close', (e)=> {
  //   savefile();
  // });
  // footer02 = document.querySelector('#footer02');
  // sidebar02 = document.querySelector('#sidebar02');
  editor02 = ace.edit('editor_area02');
  editor02.setTheme('ace/theme/pastel_on_dark');
  setMode02("xml");
  editor02.focus();

  editor02.setFontSize(16);
  // editor02.setReadOnly(false);
  editor02.setShowPrintMargin(false);

  editor02.session.getDocument().on('change', (ob) => {
    change_flg02 = true;
  });

  // drag & drop

  // sidebar02.addEventListener("dragover", (event) => {
  //   event.preventDefault();
  //   current_fname02 = null;
  //   folder_path02 = null;
  //   folder_items02 = null;
  // });

  // sidebar02.addEventListener('drop', (event) => {
  //   event.preventDefault();
  //   editor02.session.getDocument().setValue('');
  //   change_flg02 = false;
  //   const folder = event.dataTransfer.files[0];
  //   folder_path02 = folder.path;
  //   loadPath02();
  // });
}

function replace02() {
  document.querySelector('#input_find2').value = '';
  document.querySelector('#input_replace').value = '';
  $('#replace-modal').modal('show');
}

function replacenow02() {
  let fstr = document.querySelector('#input_find2').value;
  editor02.focus();
  editor02.gotoLine(0);
  editor02.find(fstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
  replacenext02();
}

function replacenext02() {
  let rstr = document.querySelector('#input_replace').value;
  editor02.replace(rstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
}

function replaceall02() {
  let rstr = document.querySelector('#input_replace').value;
  editor02.replaceAll(rstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
}

function find02() {
  document.querySelector('#input_find').value = '';
  $('#find-modal').modal('show');
  // document.querySelector('#find-modal').modal= 'show';
}

function searchIt02(fstr) {
  editor02.focus();
  editor02.gotoLine(0);
  editor02.find(fstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
}

function search02() {
  let fstr = document.querySelector('#input_find').value;
  searchIt02(fstr)
}

function findnext02() {
  editor02.findNext();
}

function findprev02() {
  editor02.findPrevious();
}
// function openDialog() {
//   console.log("### openDialog()   ###");
// }
function openDialog02() {
  let w = remote.getCurrentWindow();
  dialog.showOpenDialog(w, {
    properties: ['openFile'],
    filters: [{
        name: 'config Files',
        extensions: ['config']
      },
      {
        name: 'All Files',
        extensions: ['*']
      }
    ]
  }).then((result) => {
    if (!result.canceled) {
      let path = result.filePaths[0];
      console.log("### openDialog()   ###" + path);
      let data = readText02(path);
      // console.log("### data:"+data);
      editor02.session.getDocument().setValue(data);
      // document.querySelector('#ta').value = fs.readFileSync(path).toString();
    }
  });
}

function readText02(path) {
  return fs.readFileSync(path).toString();
}

function readXML02(path) {
  return fs.readFileSync(path, "utf-8");
}

function openfolder02() {
  let w = BrowserWindow.getFocusedWindow();
  let result = dialog.showOpenDialogSync(w, {
    properties: ['openDirectory']
  });
  if (result != undefined) {
    folder_path02 = result[0];
    loadPath02();
    // footer02.textContent = 'open dir:"' + folder_path02 + '".';
  }
}

function loadPath02() {
  fs.readdir(folder_path02, (err, files) => {
    folder_items02 = files;
    let tag = '<ul>';
    for (const n in files) {
      tag += '<li id="item ' +
        n + '" onclick="openfile(' +
        n + ')">' + files[n] + '</li>';
    }
    tag += '</ul>';
    // sidebar02.innerHTML = tag;
  });
}

function openfile02(n) {
  savefile02();
  current_fname02 = folder_items02[n];
  let fpath = path.join(folder_path02, current_fname02);
  fs.readFile(fpath, (err, result) => {
    if (err == null) {
      let data = result.toString();
      editor02.session.getDocument().setValue(data);
      change_flg02 = false;
      // footer02.textContent = ' "' + fpath + '" loaded.';
      setExt02(current_fname02);
    } else {
      dialog.showErrorBox(err.code + err.errno, err.message);
    }
  });
}

function createfile02() {
  $('#save-modal').modal('show');
}

function createfileresult02() {
  current_fname02 = document.querySelector('#input_file_name').value;
  let fpath = path.join(folder_path02, current_fname02);
  fs.writeFile(fpath, '', (err) => {
    editor02.session.getDocument().setValue('');
    // footer02.textContent = '"' + current_fname02 + '" createed.';
    change_flg02 = false;
    loadPath02();
  });
}

function backupcopy(fromPath) {
  console.log("### fromPath:" + fromPath)
  // fromPath:C:\Users\ken.yuasa\Desktop\wk0803\SiteConfig\others\shoplistcom\site.config
  let array = fromPath.split('\\')
  let cid = array[array.length - 2]
  // console.log("### array.length:"+array.length)
  // console.log("### cid:"+cid)
  if (!fs.existsSync('./backup')) {
    fs.mkdir('./backup', (err) => {
      if (err) {
        throw err;
      }
      console.log('backup ディレクトリが作成されました');
    });
  }
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hh = now.getHours()
  let mm = now.getMinutes()
  let toPath = `./backup/${cid}-${year}-${month}-${date}_${hh}_${mm}.txt`
  fs.copyFile(fromPath, toPath, (err) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('backupcopy Done.');
    }
  });
}

function savefile02() {
  let fpath = document.getElementById('inputpath').innerText;
  fpath = fpath.trim()
  if (fpath == "") {
    console.log("ファイルが読み込まれていません")
    alert("ファイルが読み込まれていません")
    return;
  }

  backupcopy(fpath); // 保存前にオリジナルファイルをリネームして退避

  // if (!change_flg02) { 
  //   console.log("変更されていないので保存しませんでした")
  //   return; 
  // }

  // let fpath = path.join(folder_path02, current_fname02);
  let data = editor02.session.getDocument().getValue();

  console.log("##data:" + data)

  fs.writeFile(fpath, data, (err) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('write Done=>'+fpath);
    }
    change_flg02 = false;
  });
}

function setTheme02(tname) {
  editor02.setTheme('ace/theme/' + tname);
}

function setMode02(mname) {
  editor02.session.setMode('ace/mode/' + mname);
}

function setFontSize02(n) {
  editor02.setFontSize(n);
}

function setExt02(fname) {
  let ext = path.extname(fname);
  switch (ext) {
    case '.txt':
      setMode02('text');
      break;
    case '.js':
      setMode02('javascript');
      break;
    case '.json':
      setMode02('javascript');
      break;
    case '.html':
      setMode02('html');
      break;
    case '.py':
      setMode02('python');
      break;
    case '.php':
      setMode02('php');
      break;
  }
}

function gotoHome() {
  editor02.gotoLine(1);
}

//editor02.gotoLine(1);
//editor02.renderer.setShowPrintMargin(false);