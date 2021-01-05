import './App.css';
import GamesList from './GamesList.js'

// Currently using nba's website as proxy to get past CORS
// Find better way to fix this error

function formatDate() {
  var date = new Date();
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

function App() {

  return (
    <div className="App">
      <div className="top">
        <h1>NBA Scores</h1>
        <p>{formatDate()}</p>
      </div>
      
      <div className="games">
        <GamesList />
      </div>
    </div>
  );
}

export default App;