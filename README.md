# Juno WD Bootcamp 44 - Project 3 ("Superhero Showdown")

## About

[Superhero Showdown](https://superhero-showdown.netlify.app/) is a React app project completed by [Dana Teagle](https://danateagle.com) in October and November 2022 at [Juno College](https://junocollege.com) as part of the Web Development Bootcamp (Cohort 44). This site was written using the Javascript library React, using [Firebase](https://firebase.google.com/) to store data, with CSS for style.

## Functionality

This app is an online superhero card game written with React and using data pulled from the [Marvel Database](https://marvel.fandom.com/wiki/Marvel_Database) and stored in Firebase.

On app load, the user is presented with a main component that details how to play the game, and prompts them to input their first name. While they are entering their name, the database is queried for all of its 40+ superhero data objects, each featuring a character's name(s), image, accent colour, Marvel Database URL, and their corresponding statistics (between 1 and 7) in Intelligence, Strength, Speed, Durability, and Fighting.

Once the main component has retrieved all of the character card objects, the deck of cards is shuffled and the first 20 are stored as an array in a state variable representing the shuffled deck of characters. When the user has entered their name and pressed start, the game component is rendered, with the main component passing the player's name and the full character deck as properties.

When the game component loads, the player's name is stored as a stateful variable, and the deck property is divided into two 10 card decks, each of which is stored as an array in state which represents the computer's deck and the player's deck respectively.

Other initial states include an empty array representing the game pot, a turn state of 1 (the versus stage), a game over value of false, a display computer stats value of false, and an empty array for the recent players.

The top card from each deck is passed as a property to each of the player card and computer card components, and the computer card also retreives the display computer stats value (set to false at the start of the game). This renders a player card with their image, corresponding accent color styling the background, their name(s), and their stats visible, and a computer card with their image, color, and their name(s) visible, but no stats, along with text reading "V.S.", a dropdown prompting the user to select a statistic, and a fight button.

When the user selects a stat and clicks on the fight button, the selected stat for each the player's card and the computer's card are compared. If the player's card's stat is larger than the computer's, the turn state is set to 2 (the winning stage). If the player's card's stat and the computer's card's stat are equal, the turn state is set to 3 (the draw stage). If the player's card stat is smaller than the computer's card's stat, the turn state is set to 4 (the losing stage). If any losing or tying player is out of cards, the game is also set to over. Once the stats have been compared, the "display computer stats" value is set to true, and the computer card is re-rendered with its stats visible. Text is then displayed letting the user know the results, along with a next turn button.

When the user clicks the next turn button, the winning card and the losing card are both removed from their original positions in the deck arrays and added to the bottom of the winner's deck, along with any cards in the pot. If there was a draw, both cards are removed and then added to the pot array. "Display computer stats" is set back to false, the turn state is set back to 1, representing the versus stage, and the stat choice is cleared out.

When one player runs out of cards, the end game button is displayed in lieu of the next turn button. When the end game button is clicked, the turn state is set to 5 (the game over stage). If the player has won, their name is pushed to the player list data object in Firebase. That data is then pulled into the app and saved as an array. The array is reversed and the first five entries are sliced out, representing the most recent five players (including the user, if they won). This array is stored in the game component state.

The game over screen is then displayed instead of the game, displaying the recent players and a play again button. When the user clicks on play again, the app refreshes.

## Process

This was my first app built with the React library and mostly served as practice with the useState and useEffect functions within a component-based app. It also allowed me to experiment with more complicated logic, with a lot of comparison operators and ternaries used to check values and display the appropriate content at the appropriate time.

## Attributions

- Lexend and Fugaz One fonts from [Google Fonts](https://fonts.google.com/)
- Marvel character data from the [Marvel Database Wiki](https://marvel.fandom.com/wiki/Marvel_Database)
- CSSTransition component from [React Transition Group](https://reactcommunity.org/react-transition-group/css-transition)
- Fisher-Yates shuffle array function adapted from [JSTips](https://www.jstips.co/en/javascript/shuffle-an-array/)
- Light or Dark colour determining function adapted from [Andreas Wik](https://awik.io/determine-color-bright-dark-using-javascript/), [Jed Schmidt](https://gist.github.com/jed/983661), and [Darel Rex Finley](http://alienryderflex.com/hsp.html)

## Developer

[Dana Teagle](https://danateagle.com) (they/she) is a web developer from Tkaronto, Ontario. You can find them on Twitter at [@teagleistyping](https://twitter.com/teagleistyping) and on GitHub at [torontopubliclibra](https://github.com/torontopubliclibra).
