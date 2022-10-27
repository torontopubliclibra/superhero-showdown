import './App.css';
import Main from './Main'

function App() {
  return (
    <div className="App">
      <header>
        <h1>Superhero Showdown</h1>
        <h2>Who will win the civil war between heroes?</h2>
      </header>
      <Main />
      <footer>
        <p>All characters and data pulled from the <a href="https://marvel.fandom.com/wiki/Marvel_Database">Marvel Database</a> and stored using <a href="https://firebase.google.com/">Firebase</a>.</p>
        <p>Built by <a href="https://danateagle.com" target="_blank">Dana Teagle</a> at <a href="https://junocollege.com" target="_blank">Juno College</a> in 2022.</p>
      </footer>
    </div>
  );
}

export default App;