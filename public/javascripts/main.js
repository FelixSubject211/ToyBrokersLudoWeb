

function doDice() {
    sendRequest(
        'GET',
        'http://localhost:9000/game/dice',
        null,
        function() {
            location.reload();
        },
        function(errorStatus) {
            console.error("error dice " + errorStatus);
        }
    )
}

function doMove(tokenString) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:9000/game/possibleMoves', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            let index = response.findIndex(item => item === tokenString);
            if (index !== -1) {
                doIndexMove(index)
            } else {
                console.log('index = -1')
            }
        } else {
            console.error('error so move : ' + xhr.status);
        }
    };
    xhr.send();
}

function doIndexMove(index) {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/game/move/' + index;
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            location.reload()
        } else {
            console.error("error do move " + xhr.status);
        }
    };
    xhr.send(JSON.stringify(''));
}

function undo() {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/game/undo';
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
    let url = 'http://localhost:9000/game/redo';
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

function saveGame() {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/game/save/' + document.getElementById('textField').value;
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
    let url = 'http://localhost:9000/game/load/' + name;
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
    xhr.open('GET', 'http://localhost:9000/game/saveGames', true);
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


function sendRequest(method, url, data, successCallback, errorCallback) {
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(successCallback)
        .catch(errorCallback);
}