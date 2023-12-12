

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

function reloadDice() {
    sendRequest(
        'GET',
        'http://localhost:9000/game/reloadDice',
        function(responseData) {
            setDice(responseData.toString())
        }
    );
}

function reloadGame() {
    sendRequest(
        'GET',
        'http://localhost:9000/game/reloadGame',
        function(responseData) {
            let gameTable = document.getElementById('game')
            gameTable.innerHTML = jsonToHtmlGame(responseData)

            const cells = document.querySelectorAll('.green-player, .red-player, .blue-player, .yellow-player');
            const greenPlayers = document.querySelectorAll('.green-player')
            const redPlayers = document.querySelectorAll('.red-player')
            const bluePlayers = document.querySelectorAll('.blue-player')
            const yellowPlayers = document.querySelectorAll('.yellow-player')

            greenPlayers.forEach(player => {
                player.addEventListener('click', function() {
                    doMove('G'.concat(player.textContent.trim()))
                });
            });

            redPlayers.forEach(player => {
                player.addEventListener('click', function() {
                    doMove('R'.concat(player.textContent.trim()))
                });
            });

            bluePlayers.forEach(player => {
                player.addEventListener('click', function() {
                    doMove('B'.concat(player.textContent.trim()))
                });
            });

            yellowPlayers.forEach(player => {
                player.addEventListener('click', function() {
                    doMove('Y'.concat(player.textContent.trim()))
                });
            });

            cells.forEach(cell => {
                cell.addEventListener('mousedown', function() {
                    cell.style.animation = 'bounce 0.5s ease-in-out'
                });

                cell.addEventListener('mouseup', function() {
                    setTimeout(() => {
                        cell.style.animation = null;
                    }, 1000);
                });
            });
        }
    );
}

function jsonToHtmlGame(jsonData) {
    let html = '<table border="1">';
    for (let i = 0; i < jsonData.length; i++) {
        html += '<tr>';
        for (let j = 0; j < jsonData[i].length; j++) {
            const stone = jsonData[i][j];
            if (stone.isAPlayField) {
                if (stone.token !== null) {
                    html += jsonToHtmlToken(stone.token);
                } else {
                    html += jsonToPlayField(stone)
                }
                html += '</td>';
            } else {
                html += '<td class="token"></td>';
            }
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

function jsonToPlayField(stone) {
    if ([70, 71, 72, 73].includes(stone.index)) {
        return `<td class="token green-end-field"></td>`;
    } else if ([74, 75, 76, 77].includes(stone.index)) {
        return `<td class="token red-end-field"></td>`;
    } else if ([78, 79, 80, 81].includes(stone.index)) {
        return `<td class="token blue-end-field"></td>`;
    } else if ([82, 83, 84, 85].includes(stone.index)) {
        return `<td class="token yellow-end-field"></td>`;
    } else {
        return `<td class="token empty-field"></td>`;
    }
}


function jsonToHtmlToken(token) {
    if (token !== null) {
        switch (token.color) {
            case "G":
                return `<td class="token green-player">${token.number}</td>`;
            case "R":
                return `<td class="token red-player">${token.number}</td>`;
            case "B":
                return `<td class="token blue-player">${token.number}</td>`;
            case "Y":
                return `<td class="token yellow-player">${token.number}</td>`;
        }
    }
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
            reloadGame()
            reloadSnackbar()
        }
    );
}

function undo() {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/undo',
        function() {
            reloadGame()
            reloadDice()
            reloadSnackbar()
        }
    );
}

function redo() {
    sendRequest(
        'PATCH',
        'http://localhost:9000/game/redo',
        function() {
            reloadGame()
            reloadDice()
            reloadSnackbar()
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

function connectWebSocket() {
    var websocket = new WebSocket("ws://localhost:9000/websocket");
    websocket.setTimeout

    websocket.onopen = function(event) {
        console.log("Connected to Websocket");
    }

    websocket.onclose = function () {
        console.log('Connection with Websocket Closed!');
    };

    websocket.onerror = function (error) {
        console.log('Error in Websocket Occured: ' + error);
    };

    websocket.onmessage = function (e) {
        switch (e.data) {
            case "reloadAll": {
                reloadGame()
                reloadSnackbar()
                reloadDice()
                break;
            }
            case "reloadGame": reloadGame(); break;
            case "reloadSnackbar": reloadSnackbar(); break;
            case "reloadDice": reloadDice(); break;
            default: alert("non event massage " + e.data)
        }
    };
}
