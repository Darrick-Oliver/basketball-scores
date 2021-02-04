import './App.css';
import GamesList from './GamesList.js'

const formatDate = () => {
  var date = new Date();
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

const App = () => {

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