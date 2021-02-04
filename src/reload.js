import App from './App.js'
import requestData from './functions.js';

/**
 *  Checks to see if all games are finished
 *  Returns true if all games are finished and false if not
 */
const allGamesFinished = (data) => {
    var status = true
    data.games.map(game => {
        if(game.gameStatusText != "Final") {
            status = false;
        }
    })
    return status;
}

const url='/static/json/liveData/scoreboard/todaysScoreboard_00.json';
var previous = null;
var current = null;

// Refresh data every 5s
var refreshIntervalID = setInterval(function() {
    var data = requestData(url).scoreboard;
    current = JSON.stringify(data);

    // Refresh App, reloads the data for each team and for the box score
    if (previous && current && previous !== current) {
        App();
    }
    previous = current;

    // If all games for the day are finished, don't ping nba.com for more data than needed
    if (allGamesFinished(data)) {
        clearInterval(refreshIntervalID);
    }
}, 5000);