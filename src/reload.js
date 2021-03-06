import App from './App.js'
import requestData from './functions.js';
import ReactDOM from 'react-dom';
import React from 'react';

const defaultInterval = 10000;   // 10 seconds
const url = '/static/json/liveData/scoreboard/todaysScoreboard_00.json';    // Scoreboard url

var interval = defaultInterval;
var previous = null;
var current = null;

/**
 *  Checks to see if all games are finished/if they haven't started yet and determines next interval time
 *  Returns true if we want to stop pinging nba.com for data and false if not
 */
const stopPinging = (data) => {
    var status = true
    var possibleIntervals = [];
    data.games.map(game => {
        // If the game isn't over and it isn't waiting to start, it must mean it is happening
        if (game.gameStatusText != "Final" && !game.gameStatusText.includes("ET")) {
            status = false;
        }
        else if (game.gameStatusText.includes("ET")) {
            // Find current and game dates
            var currDate = new Date();
            var gameDate = new Date(game.gameTimeUTC);

            // Add this time difference to the list of possible intervals
            possibleIntervals.push(gameDate - currDate);
        }
        return null;
    })
    // If there are any time differences availalble, choose the smallest
    if (possibleIntervals.length > 0)
        interval = Math.min.apply(Math, possibleIntervals);
    else if (possibleIntervals.length == 0)
        status = true;
    
    // If there are live games, defaultly set the interval to 5 seconds
    if (status == false || interval < 0)
        interval = defaultInterval;
    
    return status;
}

/**
 *  Refreshes the data based on the value of interval
 */
var refreshIntervalID = setInterval(function() {
    var data = requestData(url).scoreboard;
    current = JSON.stringify(data);

    // Check if any changes were made to the data, and if so, refresh App with the new data
    if (previous && current && previous !== current) {
        ReactDOM.render(
            <React.StrictMode>
              {App(data)}
            </React.StrictMode>,
            document.getElementById('root')
        );
    }
    previous = current;

    // Don't request data more than needed
    if (stopPinging(data)) {
        clearInterval(refreshIntervalID);
    }
}, interval);