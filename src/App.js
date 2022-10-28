import './App.css';
import Main from './Main'

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <header>
          <h1>Superhero Showdown</h1>
          <h2>Who will win the war between heroes?</h2>
        </header>
        <Main />
        <footer>
          <p>All characters and data pulled from the <a href="https://marvel.fandom.com/wiki/Marvel_Database" target="_blank" rel="noreferrer">Marvel Database</a> and stored using <a href="https://firebase.google.com/" target="_blank" rel="noreferrer">Firebase</a>.</p>
          <p>Built by <a href="https://danateagle.com" target="_blank" rel="noreferrer">Dana Teagle</a> at <a href="https://junocollege.com" target="_blank" rel="noreferrer">Juno College</a> in 2022.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;