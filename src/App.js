import $ from "jquery";
import './App.css';

// Currently using nba's website as proxy to get past CORS
// Find better way to fix this error

function App() {
  const url='/static/json/liveData/scoreboard/todaysScoreboard_00.json'
  var data;
  $.ajax({
    url: url,
    type: "GET",
    async:false,
    success: function(result) {
      data = JSON.parse(result).scoreboard;
    },
    error: function(error) {
      console.log('Error ' + error)
    }
  })
  console.log(data)

  function getDate() {
    return data.gameDate;
  }

  function getGames() {
    var games = data.games
  }

  return (
    <div>
      <div className="top">
        <h1>Basketball Scores</h1>
        <p>{getDate()}</p>
      </div>
      
      <div className="games">
        <h2></h2>
      </div>
    </div>
  );
}

export default App;