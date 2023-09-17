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
          <p>This game was built by <a href="https://danateagle.com" target="_blank" rel="noreferrer" title="Dana Teagle's website">Dana Teagle</a> using React and CSS. The character images and statistics are sourced from the <a href="https://marvel.fandom.com/wiki/Marvel_Database" target="_blank" rel="noreferrer" title="Marvel Database Wiki">Marvel Database Wiki</a>. No copyright infringement is intended. See the source code <a href="https://github.com/torontopubliclibra/superhero-showdown" target="_blank" rel="noreferrer" title="Superhero Showdown on Github">here</a>.</p>
        </footer>

      </div> {/* .wrapper end */}

    </div> // .App end
  );
}

// export App component
export default App;