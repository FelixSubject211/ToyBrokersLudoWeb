

function doDice() {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/dice',
        function() {
            location.reload();
        }
    );
}


function doMove(tokenString) {
    sendRequest(
        'GET',
        'http://localhost:9000/game/possibleMoves',
        function(responseData) {
            let index = responseData.findIndex(item => item === tokenString);
            if (index !== -1) {
                doIndexMove(index)
            } else {
                alert("Illegal move index")
            }
        }
    );
}

function doIndexMove(index) {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/move/' + index,
        function() {
            location.reload()
        }
    );
}

function undo() {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/undo',
        function() {
            location.reload()
        }
    );
}

function redo() {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/redo',
        function() {
            location.reload()
        }
    );
}

function saveGame() {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/save/' + document.getElementById('textField').value,
        function() {
            location.reload()
        }
    );
}


function loadGame(name) {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/load/' + name,
        function() {
            fetchSaveGames()
            location.reload()
        }
    );
}


function fetchSaveGames() {
    sendRequest(
        'GET',
        'http://localhost:9000/game/saveGames' + name,
        function(responseData) {
            let responseList = document.getElementById('responseList');
            responseList.innerHTML = '';
            for (let i = 0; i < responseData.length; i++) {
                let listItem = document.createElement('li');
                listItem.textContent = responseData[i];
                responseList.appendChild(listItem);
            }
        }
    );
}



function sendRequest(method, url, successCallback, data = null, errorCallback = (error) => {
    alert('Error : ' + error.message);
}) {

    if (method === 'GET' && data !== null) {
        throw new Error('GET should have not a request body');
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.status.toString());
        }
        return response.json();
    }).then(responseData => {
        successCallback(responseData);
    }).catch(error => {
        errorCallback(error);
    });
}
