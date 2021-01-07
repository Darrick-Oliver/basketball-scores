import React from 'react';
import requestData from './functions.js';
import {Button} from 'react-bootstrap';
import BoxScore from './BoxScore.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function getImage(name) {
    return `${process.env.PUBLIC_URL}/assets/images/` + name + '.png'
}

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
    if (status.includes('Q') || status.includes('Half')) {
        return <h3 style={{color: 'red'}}>{status}</h3>
    }
    return <h3>{status}</h3>;
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
          <h2><img src={getImage(game.homeTeam.teamId)} alt={game.homeTeam.teamName} height='30'></img> {game.homeTeam.teamTricode} vs {game.awayTeam.teamTricode} <img src={getImage(game.awayTeam.teamId)} alt={game.awayTeam.teamName} height='30'></img></h2>
          <p>{game.homeTeam.score} : {game.awayTeam.score}</p>
          {getStatus(game)}
          <Button variant="dark" onClick={() => handlePress(game)}>Box Score</Button>{' '}
        </div>
      )
    })
}

export default GamesList;