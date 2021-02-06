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
    var gameDate = new Date(game.gameTimeUTC);
    // Formats the time the way I want it to
    // Gross but works
    return (gameDate.getHours() > 12 ? gameDate.getHours() - 12 : (gameDate.getHours() === 0 ? '12' : gameDate.getHours())) + ':' + (gameDate.getMinutes() < 10 ? '0' + gameDate.getMinutes() : gameDate.getMinutes()) + ' ' + (gameDate.getHours() >= 12 ? 'PM' : 'AM');
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
    else if (status.includes('PT')) {
        var quarter = status.match(/Q\d/)[0];
        var minutes = status.match(/PT\d\d/)[0].match(/\d\d/)[0];
        var seconds = status.match(/M\d\d/)[0].match(/\d\d/)[0];
        return <h3 style={{color: 'red', fontWeight: 'bold'}}>{quarter + ' ' + minutes + ':' + seconds}</h3>;
    }
    else if (status.includes('Q') || status.includes('Half')) {
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
    // If data recieved is empty, query your own. Otherwise, set the data to given data
    if (Object.keys(gameData).length === 0 && gameData.constructor === Object)
        data = getTodaysScoreboard();
    else
        data = gameData;

    const handlePress = (game) => {
        BoxScore(game);
    }

    // Hides the score of the given teamIds
    var hideScores = [];
    hideScores.push(1610612744); // warriors
    // hideScores.push(1610612738); // Testing multi-hiding
    
    return data.games.map(game => {
      return (
        <div key={game.gameId}>
          <h2><img src={getImage(game.homeTeam.teamId)} alt={game.homeTeam.teamName} height='30'></img> {game.homeTeam.teamTricode} vs {game.awayTeam.teamTricode} <img src={getImage(game.awayTeam.teamId)} alt={game.awayTeam.teamName} height='30'></img></h2>
          {/* Hides the score of the specified games with asterisks */}
          <p>{hideScores.includes(game.homeTeam.teamId) || hideScores.includes(game.awayTeam.teamId) ? '*' : game.homeTeam.score} : {hideScores.includes(game.homeTeam.teamId) || hideScores.includes(game.awayTeam.teamId) ? '*' : game.awayTeam.score}</p>
          {getStatus(game)}
          <Button variant="dark" onClick={() => handlePress(game)}>Box Score</Button>{' '}
        </div>
      )
    })
}

export default GamesList;