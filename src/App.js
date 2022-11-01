// import styles
import './App.css';

// import logo images
import logo from './logo.png';
import mobileLogo from './mobileLogo.png';

// import components
import Main from './Main'

// App component
function App() {

  // App component return
  return (
    
    <div className="App">

      <div className="wrapper">

        <header>
          
          <h1>

            <img className="logo" src={logo} alt="Superhero Showdown" title="Superhero Showdown"/>
            <img className="mobile-logo" src={mobileLogo} alt="Superhero Showdown" title="Superhero Showdown"/>

          </h1>

          <h2>Who will win the war between heroes?</h2>

        </header>

        <Main />

        <footer>

          <p>All character images and statistics are taken from the <a href="https://marvel.fandom.com/wiki/Marvel_Database" target="_blank" rel="noreferrer">Marvel Database Wiki</a> and stored on <a href="https://firebase.google.com/" target="_blank" rel="noreferrer">Firebase</a>.</p>

          <p>This app was built using <a href="https://reactjs.org/" target="_blank" rel="noreferrer">React.js</a> by <a href="https://danateagle.com" target="_blank" rel="noreferrer">Dana Teagle</a> at <a href="https://junocollege.com" target="_blank" rel="noreferrer">Juno College</a> in 2022.</p>

        </footer>

      </div> {/* .wrapper end */}

    </div> // .App end
  );
}

// export App component
export default App;