const dlg = document.querySelector('#find-dialog');
//Escによるキャンセルをさせない
dlg.addEventListener('cancel', (event) => {
    'use strict';
    event.preventDefault();
});

function findDialog01() {
    'use strict';
    return new Promise((resolve, reject) => {
        dlg.showModal();

        function onClose(event) {
            // 2017/2/5現在Chromium:v54のためaddEventListenerの{once: true}は利用できないため自力で解放。v55になれば{once: true}を利用するのが良いと思います。
            dlg.removeEventListener('close', onClose);
            if (dlg.returnValue === 'ok') {  
                const inputValue = document.querySelector('#input_find').value;  

                searchIt01(inputValue);                      

                resolve(inputValue); //入力値をresolve
            } else {
                reject();
            }
        }
        dlg.addEventListener('close', onClose, {
            once: true
        });
    });
}