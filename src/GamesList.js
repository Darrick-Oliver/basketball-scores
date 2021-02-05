import React from 'react';
import requestData from './functions.js';
import {Button} from 'react-bootstrap';
import BoxScore from './BoxScore.js';
import 'bootstrap/dist/css/bootstrap.min.css';


/**
 *  Used for retrieving photos from the /images folder using only the image name
 *  Returns the link to the image with the given name
 */
const getImage = (name) => {
    return `${process.env.PUBLIC_URL}/assets/images/` + name + '.png'
}


/**
 *  Calculates the tipoff time in the user's timezone
 *  Returns the calculated time
 */
const getGameTime = (game) => {
    // Fix, include dates on hours past 24 and on hours below 0
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


/**
 *  Determines formatting for different game statuses
 *      e.g.
 *          Before tipoff: Game time in local time
 *          Live game: Red, bolded status
 *  Returns the formatted status
 */
const getStatus = (game) => {
    var status = game.gameStatusText;
    if (status.includes('ET')) {
        status = getGameTime(game);
    }
    if (status.includes('Q') || status.includes('Half')) {
        return <h3 style={{color: 'red', fontWeight: 'bold'}}>{status}</h3>
    }
    return <h3>{status}</h3>;
}


/**
 *  Requests the scoreboard from nba.com
 *  Returns the acquired data
 */
const getTodaysScoreboard = () => {
    const url='/static/json/liveData/scoreboard/todaysScoreboard_00.json';
    return requestData(url).scoreboard;
}


/**
 *  Creates the individual game boxes
 */
const GamesList = (gameData) => {
    var data;
    if (gameData.length == undefined)   data = getTodaysScoreboard();
    else                                data = gameData;

    const handlePress = (game) => {
        BoxScore(game);
    }

    var hideScore = 0
    // hideScore = 1610612744; // warriors
    
    return data.games.map(game => {
      return (
        <div key={game.gameId}>
          <h2><img src={getImage(game.homeTeam.teamId)} alt={game.homeTeam.teamName} height='30'></img> {game.homeTeam.teamTricode} vs {game.awayTeam.teamTricode} <img src={getImage(game.awayTeam.teamId)} alt={game.awayTeam.teamName} height='30'></img></h2>
          <p>{game.homeTeam.teamId == hideScore || game.awayTeam.teamId == hideScore ? '*' : game.homeTeam.score} : {game.homeTeam.teamId == hideScore || game.awayTeam.teamId == hideScore ? '*' : game.awayTeam.score}</p>
          {getStatus(game)}
          <Button variant="dark" onClick={() => handlePress(game)}>Box Score</Button>{' '}
        </div>
      )
    })
}

export default GamesList;