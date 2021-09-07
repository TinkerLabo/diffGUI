var editor01 = null;
var folder_path01 = null;
var folder_items01 = null;
// var sidebar01 = null;
// var footer01 = null;
var current_fname01 = null;
var change_flg01 = false;


window.addEventListener('DOMContentLoaded', onLoad01);

function onLoad01() {
  // let w = BrowserWindow.getFocusedWindow();
  // w.on('close', (e)=> {
  //   savefile01();
  // });
  // footer01 = document.querySelector('#footer01');
  // sidebar01 = document.querySelector('#sidebar01');
  
  editor01 = ace.edit('editor_area01');
  editor01.setTheme('ace/theme/pastel_on_dark');
  setMode01("xml");
  editor01.focus();

  editor01.setFontSize(16);
  editor01.setReadOnly(true);
  editor01.setShowPrintMargin(false);

  editor01.session.getDocument().on('change', (ob)=> {
    change_flg01 = true;
  });

  // drag & drop

  // sidebar01.addEventListener("dragover", (event)=> {
  //   event.preventDefault();
  //   current_fname01 = null;
  //   folder_path01 = null;
  //   folder_items01 = null;
  // });

  // sidebar01.addEventListener('drop', (event) => {
  //   event.preventDefault();
  //   editor01.session.getDocument().setValue('');
  //   change_flg01 = false;
  //   const folder = event.dataTransfer.files[0];
  //   folder_path01 = folder.path;
  //   loadPath01();
  // });
}

function replace01() {
  document.querySelector('#input_find2').value = '';
  document.querySelector('#input_replace').value = '';
  $('#replace-modal').modal('show');
}

function replacenow01() {
  let fstr = document.querySelector('#input_find2').value;
  editor01.focus();
  editor01.gotoLine(0);
  editor01.find(fstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
  replacenext01();
}

function replacenext01() {
  let rstr = document.querySelector('#input_replace').value;
  editor01.replace(rstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
}

function replaceall01() {
  let rstr = document.querySelector('#input_replace').value;
  editor01.replaceAll(rstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
}

function find01() {
  document.querySelector('#input_find').value = '';
  $('#find-modal').modal('show');
  // document.querySelector('#find-modal').modal= 'show';
}

function searchIt01(fstr) {
  editor01.focus();
  editor01.gotoLine(0);
  let range = editor01.find(fstr, {
    backwards: false,
    wrap: false,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  });
  var startLine = range.start.row;
  console.log("startLine:"+startLine);
  // editor01.gotoLine(startLine);
  // editor01.setScrollTop(startLine);

}

function search01() {
  let fstr = document.querySelector('#input_find').value;
  searchIt01(fstr)
}

function findnext01() {
  editor01.findNext();
}
function findprev01() {
  editor01.findPrevious();
}
// function openDialog() {
//   console.log("### openDialog()   ###");
// }
function openDialog01() {
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
          console.log("### openDialog()   ###"+path);
          let data = readText01(path);
          //console.log("### data:"+data);
          editor01.session.getDocument().setValue(data);
          // document.querySelector('#ta').value = fs.readFileSync(path).toString();
      }
  });
}

function readText01(path) {
  return fs.readFileSync(path).toString();
}
function readXML01(path) {
  return fs.readFileSync(path, "utf-8");
}

function openfolder01() {
  let w = BrowserWindow.getFocusedWindow();
  let result = dialog.showOpenDialogSync(w, {
    properties: ['openDirectory']
  });
  if (result != undefined) {
    folder_path01 = result[0];
    loadPath01();
    // footer01.textContent = 'open dir:"' + folder_path01 + '".';
  }
}

function loadPath01() {
  fs.readdir(folder_path01, (err, files)=> {
    folder_items01 = files;
    let tag = '<ul>';
    for (const n in files) {
      tag += '<li id="item '
        + n + '" onclick="openfile(' 
        + n + ')">' + files[n] + '</li>';
    }
    tag += '</ul>';
    // sidebar01.innerHTML = tag;
  });
}

function openfile01(n) {
  savefile01();
  current_fname01 = folder_items01[n];
  let fpath = path.join(folder_path01, current_fname01);
  fs.readFile(fpath, (err, result)=> {
    if (err == null) {
      let data = result.toString();
      editor01.session.getDocument().setValue(data);
      change_flg01 = false;
      // footer01.textContent = ' "' + fpath +'" loaded.';
      setExt01(current_fname01);
    } else {
      dialog.showErrorBox(err.code + err.errno, err.message);
    }
  });
}

function createfile01() {
  $('#save-modal').modal('show');
}

function createfileresult01() {
  current_fname01 = document.querySelector('#input_file_name').value;
  let fpath = path.join(folder_path01, current_fname01);
  fs.writeFile(fpath, '', (err)=> {
    editor01.session.getDocument().setValue('');
    // footer01.textContent = '"' + current_fname01 + '" createed.';
    change_flg01 = false;
    loadPath01();
  });
}

function savefile01() {
  if (!change_flg01) { return; }
  let fpath = path.join(folder_path01, current_fname01);
  let data = editor01.session.getDocument().getValue();
  fs.writeFile(fpath, data, (err)=> {
    change_flg01 = false;
  });
}

function setTheme01(tname) {
  editor01.setTheme('ace/theme/' + tname);
}

function setMode01(mname) {
  editor01.session.setMode('ace/mode/' + mname);
}

function setFontSize01(n) {
  editor01.setFontSize(n);
}

function setExt01(fname) {
  let ext = path.extname(fname);
  switch (ext) {
    case '.txt':
    setMode01('text'); break;
    case '.js':
    setMode01('javascript'); break;
    case '.json':
    setMode01('javascript'); break;
    case '.html':
    setMode01('html'); break;
    case '.py':
    setMode01('python'); break;
    case '.php':
    setMode01('php'); break;
  }
}

function gotoHome() {
  editor01.gotoLine(1);
}

//editor01.gotoLine(1);
//editor01.renderer.setShowPrintMargin(false);
