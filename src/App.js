import $ from 'jquery';
import './App.css';

// Currently using nba's website as proxy to get past CORS
// Find better way to fix this error

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

function getBoxScore(game) {
  var data;
  console.log(game.gameId);
  const url='/static/json/liveData/boxscore/boxscore_' + game.gameId + '.json';
  try {
    data = requestData(url, false);
  }
  catch(err) {
    console.log(err.name);
  }
  console.log(data);
}

function requestData(url, parse = true) {
  var data;
  $.ajax({
    url: url,
    type: "GET",
    async:false,
    success: function(result) {
      if (parse) {
        data = JSON.parse(result);
      }
      else {
        data = result;
      }
    },
    error: function(error) {
      console.log('Error ' + error);
    }
  })
  return data;
}


function App() {
  const url='/static/json/liveData/scoreboard/todaysScoreboard_00.json'
  var data = requestData(url).scoreboard;

  return (
    <div className="App">
      <div className="top">
        <h1>NBA Scores</h1>
        <p>{data.gameDate}</p>
      </div>
      
      <div className="games">
        {
          data.games.map(function(game) {
            return (
              <div key={game.gameId}>
                <a href="#">{game.homeTeam.teamName} vs {game.awayTeam.teamName}</a>
                <p>{game.homeTeam.score} : {game.awayTeam.score}</p>
                <h3>{getStatus(game)}</h3>
                {getBoxScore(game)}
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;