import App from './App.js'
import requestData from './functions.js';
import ReactDOM from 'react-dom';
import React from 'react';

var interval = 5000;

/**
 *  Checks to see if all games are finished/if they haven't started yet
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
            var timeUTC = game.gameTimeUTC.match(/\d\d:\d\d:\d\d/)[0];
            var date = new Date();

            // Convert game time to hours and minutes and calculate the total minutes
            var hours = parseInt(timeUTC.match(/\b\d\d:/)[0].match(/\d\d/)[0]);
            var minutes = parseInt(timeUTC.match(/:\d\d:/)[0].match(/\d\d/)[0]);
            var totalMins = hours * 60 + minutes;

            // Use the difference between the tipoff time and local time to determine the next refresh interval
            var localMins = date.getUTCHours() * 60 + date.getUTCMinutes();
            var minDiff = totalMins - localMins;

            // Convert minutes to milliseconds
            possibleIntervals.push(minDiff * 60 * 1000);
        }
        return null;
    })
    // If there are any time differences availalble, choose the smallest
    if (possibleIntervals.length > 0)     interval = Math.min.apply(Math, possibleIntervals);
    // If there are live games, defaultly set the interval to 5 seconds
    if (status == false)    interval = 5000;
    return status;
}

const url='/static/json/liveData/scoreboard/todaysScoreboard_00.json';
var previous = null;
var current = null;

// Refresh data
var refreshIntervalID = setInterval(function() {
    var data = requestData(url).scoreboard;
    current = JSON.stringify(data);

    // Refresh App, reloads the data for each team and for the box score
    if (previous && current && previous !== current) {
        ReactDOM.render(
            <React.StrictMode>
              {App(data)}
            </React.StrictMode>,
            document.getElementById('root')
        );
    }
    previous = current;

    // Don't ping nba.com for more data than needed
    if (stopPinging(data)) {
        clearInterval(refreshIntervalID);
    }
}, interval);