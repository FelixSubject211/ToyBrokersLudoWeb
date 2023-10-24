
function saveGame(input) {
    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:9000/save/' + input;
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            fetchSaveGames()
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
            console.error('Fehler beim Request: ' + xhr.status);
        }
    };
    xhr.send();
}