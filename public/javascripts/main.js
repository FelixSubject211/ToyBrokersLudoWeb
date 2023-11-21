

function doDice() {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/dice',
        function(responseData) {
            let dice = document.getElementById('dice')
            dice.style.animation = 'roll 0.5s ease-in-out'
            setTimeout(() => {
                setDice((Math.floor(Math.random() * 6) + 1).toString())
            }, 100);

            setTimeout(() => {
                setDice((Math.floor(Math.random() * 6) + 1).toString())
            }, 150);

            setTimeout(() => {
                setDice((Math.floor(Math.random() * 6) + 1).toString())
            }, 300);

            setTimeout(() => {
                dice.style.animation = null
                setDice(responseData)
                reloadSnackbar()
            }, 500);
        }
    );
}

function setDice(diceNumber) {
    let dice = document.getElementById('dice')

    let newDiceHTML = "";

    switch (diceNumber) {
        case "1":
            newDiceHTML = `<div class="dice first-face">
                                        <span class="dot"></span>
                                   </div>`;
            break;
        case "2":
            newDiceHTML = `<div class="dice second-face">
                                        <span class="dot"></span>
                                        <span class="dot"></span>
                                    </div>`;
            break;
        case "3":
            newDiceHTML = `<div class="dice third-face">
                                        <span class="dot"></span>
                                        <span class="dot"></span>
                                        <span class="dot"></span>
                                    </div>`;
            break;
        case "4":
            newDiceHTML = `<div class="dice fourth-face">
                                       <div class="column">
                                           <span class="dot"></span>
                                           <span class="dot"></span>
                                       </div>
                                       <div class="column">
                                           <span class="dot"></span>
                                           <span class="dot"></span>
                                       </div>
                                   </div>`;
            break;
        case "5":
            newDiceHTML = `<div class="dice fifth-face">
                                        <div class="column">
                                            <span class="dot"></span>
                                            <span class="dot"></span>
                                        </div>
                                        <div class="column">
                                            <span class="dot"></span>
                                        </div>
                                        <div class="column">
                                            <span class="dot"></span>
                                            <span class="dot"></span>
                                        </div>
                                    </div>`;
            break;
        case "6":
            newDiceHTML = `<div class="dice sixth-face">
                                        <div class="column">
                                            <span class="dot"></span>
                                            <span class="dot"></span>
                                            <span class="dot"></span>
                                        </div>
                                        <div class="column">
                                            <span class="dot"></span>
                                            <span class="dot"></span>
                                            <span class="dot"></span>
                                        </div>
                                    </div>`;
            break;
        default:
            newDiceHTML = `<div>Unbekannter Würfelwert: ${diceNumber}</div>`;
            break;
    }

    dice.innerHTML = newDiceHTML;
}

function reloadSnackbar() {
    sendRequest(
        'GET',
        'http://localhost:9000/game/reloadSnackbar',
        function(responseData) {
            let snackbar = document.getElementById('snackbar')
            snackbar.textContent = responseData
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
