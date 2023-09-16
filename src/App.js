// import styles
import './App.css';

// import logo images
import logo from './assets/logo.png';
import mobileLogo from './assets/mobileLogo.png';

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

        {/* main component */}
        <Main />

        <footer>
          <p>This game was built by <a href="https://danateagle.com" target="_blank" rel="noreferrer">Dana Teagle</a> using React and CSS. See the repo <a href="https://github.com/torontopubliclibra/superhero-showdown" target="_blank" rel="noreferrer">here</a>.</p>
          <p>All character images and statistics are sourced from the <a href="https://marvel.fandom.com/wiki/Marvel_Database" target="_blank" rel="noreferrer">Marvel Database Wiki</a>. No copyright infringement intended.</p>
        </footer>

      </div> {/* .wrapper end */}

    </div> // .App end
  );
}

// export App component
export default App;