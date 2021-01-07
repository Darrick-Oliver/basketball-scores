import requestData from './functions.js';
import ReactDOM from 'react-dom';

function formatMinutes(minutes) {
    var totMinutes = parseInt(minutes.match(/\d\dM/)[0].slice(0, -1));
    var totSeconds = minutes.match(/\d\d\./)[0].slice(0, -1);

    if(totMinutes == 0 && totSeconds == '00') {
        return '0';
    }
    return totMinutes + ':' + totSeconds;
}

function getImage(name) {
    return `${process.env.PUBLIC_URL}/assets/images/` + name + '.png'
}

function sumStat(team, stat) {
    var total = 0;
    team.map(player => {
        total += parseInt(player.statistics[stat]);
        return null;
    })
    return total;
}

// Fix team +/-
function generateTotals(team, plusMinus) {
    return (
        <tr>
            <td colSpan='3'>Totals</td>
            <td>{sumStat(team, 'points')}</td>
            <td>{sumStat(team, 'assists')}</td>
            <td>{sumStat(team, 'reboundsTotal')}</td>
            <td>{sumStat(team, 'reboundsOffensive')}</td>
            <td>{sumStat(team, 'reboundsDefensive')}</td>
            <td>{sumStat(team, 'steals')}</td>
            <td>{sumStat(team, 'blocks')}</td>
            <td>{sumStat(team, 'fieldGoalsMade')}</td>
            <td>{sumStat(team, 'fieldGoalsAttempted')}</td>
            <td>{(sumStat(team, 'fieldGoalsMade')/sumStat(team, 'fieldGoalsAttempted') * 100).toFixed(1)}</td>
            <td>{sumStat(team, 'threePointersMade')}</td>
            <td>{sumStat(team, 'threePointersAttempted')}</td>
            <td>{(sumStat(team, 'threePointersMade')/sumStat(team, 'threePointersAttempted') * 100).toFixed(1)}</td>
            <td>{sumStat(team, 'freeThrowsMade')}</td>
            <td>{sumStat(team, 'freeThrowsAttempted')}</td>
            <td>{(sumStat(team, 'freeThrowsMade')/sumStat(team, 'freeThrowsAttempted') * 100).toFixed(1)}</td>
            <td>{sumStat(team, 'foulsPersonal')}</td>
            <td>{plusMinus}</td>
        </tr>
    )
}

function generateTeamStats(team) {
    return team.map(player => {
        if (player.status == 'ACTIVE') {
            return (
                <tr key={player.personId}>
                    <td>{player.nameI}</td>
                    <td>{player.position}</td>
                    <td>{formatMinutes(player.statistics.minutes)}</td>
                    <td>{player.statistics.points}</td>
                    <td>{player.statistics.assists}</td>
                    <td>{player.statistics.reboundsTotal}</td>
                    <td>{player.statistics.reboundsOffensive}</td>
                    <td>{player.statistics.reboundsDefensive}</td>
                    <td>{player.statistics.steals}</td>
                    <td>{player.statistics.blocks}</td>
                    <td>{player.statistics.fieldGoalsMade}</td>
                    <td>{player.statistics.fieldGoalsAttempted}</td>
                    <td>{(player.statistics.fieldGoalsPercentage * 100).toFixed(1)}</td>
                    <td>{player.statistics.threePointersMade}</td>
                    <td>{player.statistics.threePointersAttempted}</td>
                    <td>{(player.statistics.threePointersPercentage * 100).toFixed(1)}</td>
                    <td>{player.statistics.freeThrowsMade}</td>
                    <td>{player.statistics.freeThrowsAttempted}</td>
                    <td>{(player.statistics.freeThrowsPercentage * 100).toFixed(1)}</td>
                    <td>{player.statistics.foulsPersonal}</td>
                    <td>{player.statistics.plusMinusPoints}</td>
                </tr>
            )
        }
        else {
            return (
                <tr key={player.personId}>
                    <td>{player.nameI}</td>
                    <td colSpan='20' style={{textAlign: 'center'}}>OUT{player.notPlayingDescription != undefined && player.notPlayingDescription != ''  ? ' - ' + player.notPlayingDescription : ''}</td>
                </tr>
            )
        }
    })
}

function generateTable(id, team, score, oppScore) {
    var teamPlusMinus = score - oppScore;
    return (
        <table id={id}>
            <thead>
                <tr>
                    <th>PLAYER</th>
                    <th>POS</th>
                    <th>MINS</th>
                    <th>PTS</th>
                    <th>AST</th>
                    <th>REB</th>
                    <th>OREB</th>
                    <th>DREB</th>
                    <th>STL</th>
                    <th>BLK</th>
                    <th>FGM</th>
                    <th>FGA</th>
                    <th>FG%</th>
                    <th>3PM</th>
                    <th>3PA</th>
                    <th>3P%</th>
                    <th>FTM</th>
                    <th>FTA</th>
                    <th>FT%</th>
                    <th>PF</th>
                    <th>+/-</th>
                </tr>
            </thead>
            <tbody>
                {generateTeamStats(team)}
            </tbody>
            <tfoot>
                {generateTotals(team, teamPlusMinus)}
            </tfoot>
        </table>
    )
}

function BoxScore(game) {
    var data;
    // const url='/static/json/liveData/boxscore/boxscore_' + game.gameId + '.json';

    // Testing url
    var url = '/static/json/liveData/boxscore/boxscore_0022000071.json';

    try {
        data = requestData(url, false).game;
    }
    catch (err) {
        ReactDOM.render(
            <div>
                <h2>No Box Score Available Yet</h2>
            </div>
        , document.getElementById('boxscore'));
        return null;
    }
    console.log(data);

    var scoreHome = data.homeTeam.score;
    var scoreAway = data.awayTeam.score;

    ReactDOM.render(
        <div>
            <h2><img src={getImage(data.homeTeam.teamId)} height='50' alt={data.homeTeam.teamName}></img> {data.homeTeam.teamCity} {data.homeTeam.teamName}</h2>
            {generateTable('home', data.homeTeam.players, scoreHome, scoreAway)}
            <h2><img src={getImage(data.awayTeam.teamId)} height='50' alt={data.awayTeam.teamName}></img> {data.awayTeam.teamCity} {data.awayTeam.teamName}</h2>
            {generateTable('away', data.awayTeam.players, scoreAway, scoreHome)}
        </div>
    
    , document.getElementById('boxscore'));
}

export default BoxScore;