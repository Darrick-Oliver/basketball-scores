import React from 'react';
import requestData from './functions.js';
import {Button} from 'react-bootstrap';
import BoxScore from './BoxScore.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Fix, include dates on hours past 24 and on hours below 0
function getGameTime(game) {
    var timeUTC = game.gameTimeUTC.match(/\d\d:\d\d:\d\d/)[0];
    var date = new Date();
    var offset = date.getTimezoneOffset();

    var hours = parseInt(timeUTC.match(/\b\d\d:/)[0].match(/\d\d/)[0]);
    var minutes = parseInt(timeUTC.match(/:\d\d:/)[0].match(/\d\d/)[0]);

    // Weird but works
    var totalMins = hours * 60 + minutes - offset;
    var localHour = Math.floor(totalMins/60);
    var localMins = totalMins % 60;
    var period;
    if (localHour > 12) {
        localHour = localHour - 12;
        period = 'pm';
    }
    else if (localHour == 12) {
        period = 'pm';
    }
    else if (localHour < 0) {
        localHour = localHour + 12;
        period = 'pm';
    }
    else {
        period = 'am';
    }
    if (localMins < 0) {
        localMins = localMins + 60;
    }

    var localTime;
    if (localMins < 10) {
        localTime = localHour + ':0' + localMins + ' ' + period;
    }
    else {
        localTime = localHour + ':' + localMins + ' ' + period;
    }

    return localTime;
}

function getStatus(game) {
    var status = game.gameStatusText;
    if (status.includes('ET')) {
        status = getGameTime(game);
    }
    return status;
}

function getTodaysScoreboard() {
    const url='/static/json/liveData/scoreboard/todaysScoreboard_00.json'
    return requestData(url).scoreboard;
}

const GamesList = () => {

    const handlePress = (game) => {
        BoxScore(game);
    }

    var data = getTodaysScoreboard()
    return data.games.map(game => {
      return (
        <div key={game.gameId}>
          <h2>{game.homeTeam.teamName} vs {game.awayTeam.teamName}</h2>
          <p>{game.homeTeam.score} : {game.awayTeam.score}</p>
          <h3>{getStatus(game)}</h3>
          <Button variant="dark" onClick={() => handlePress(game)}>Box Score</Button>{' '}
        </div>
      )
    })
}

export default GamesList;