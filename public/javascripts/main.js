

function doDice() {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/dice';
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            location.reload()
        } else {
            console.error("error dice " + xhr.status);
        }
    };
    xhr.send();
}

function doMove(tokenString) {
}

function undo() {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/undo';
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            location.reload()
        } else {
            console.error("error undo " + xhr.status);
        }
    };
    xhr.send(JSON.stringify(''));
}

function redo() {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/redo';
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            location.reload()
        } else {
            console.error("error redo " + xhr.status);
        }
    };
    xhr.send(JSON.stringify(''));
}

function saveGame(input) {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/save/' + input;
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            location.reload()
        } else {
            console.error("error saveGame " + xhr.status);
        }
    };
    xhr.send(JSON.stringify(''));
}


function loadGame(name) {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/load/' + name;
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            fetchSaveGames()
            location.reload()
        } else {
            console.error("error saveGame " + xhr.status);
        }
    };
    xhr.send(JSON.stringify(''));
}


function fetchSaveGames() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:9000/saveGames', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            let responseList = document.getElementById('responseList');
            responseList.innerHTML = '';
            for (let i = 0; i < response.length; i++) {
                let listItem = document.createElement('li');
                listItem.textContent = response[i];
                responseList.appendChild(listItem);
            }
        } else {
            console.error('error fetchSaveGames : ' + xhr.status);
        }
    };
    xhr.send();
}