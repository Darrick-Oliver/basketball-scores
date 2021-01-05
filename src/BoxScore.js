import requestData from './functions.js';
import ReactDOM from 'react-dom';

function formatMinutes(minutes) {
    var totMinutes = minutes.match(/\d\dM/)[0].slice(0, -1);
    var totSeconds = minutes.match(/\d\d./)[0].slice(0, -1);

    if(totMinutes == '00' && totSeconds == '00') {
        return '0.0';
    }
    return totMinutes + ':' + totSeconds;
}

function generateTeamStats(team) {
    return team.map(player => {
        return (
            <tr>
                <td>{player.nameI}</td>
                <td>{player.position}</td>
                <td>{formatMinutes(player.statistics.minutes)}</td>
                <td>{player.statistics.points}</td>
                <td>{player.statistics.assists}</td>
                <td>{player.statistics.reboundsTotal}</td>
            </tr>
        )
    })
}

function generateTable (id, team) {
    return (
        <table id={id}>
            <thead>
                <tr>
                    <th>NAME</th>
                    <th>POS</th>
                    <th>MINS</th>
                    <th>PTS</th>
                    <th>AST</th>
                    <th>REB</th>
                </tr>
            </thead>
            <tbody>
                {generateTeamStats(team)}
            </tbody>
        </table>
    )
}

function BoxScore(game) {
    var data;
    const url='/static/json/liveData/boxscore/boxscore_' + game.gameId + '.json';

    // Testing url
    // var url = '/static/json/liveData/boxscore/boxscore_0022000092.json';

    try {
        data = requestData(url, false).game;
    }
    catch (err) {
        console.log(err.name);
        ReactDOM.render(
            <div>
                <h2>No Box Score Available Yet</h2>
            </div>
        , document.getElementById('boxscore'));
        return null;
    }
    console.log(data.homeTeam);
    console.log(data.homeTeam.players);

    ReactDOM.render(
        <div>
            <h2>{data.homeTeam.teamCity} {data.homeTeam.teamName}</h2>
            {generateTable('home', data.homeTeam.players)}
            <h2>{data.awayTeam.teamCity} {data.awayTeam.teamName}</h2>
            {generateTable('away', data.awayTeam.players)}
        </div>
    
    , document.getElementById('boxscore'));
}

export default BoxScore;