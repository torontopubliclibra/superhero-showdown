# Superhero Showdown

## About
[Superhero Showdown](https://superhero-showdown.netlify.app/) is a statistics-based card game written in JavaScript and CSS using the React library. The site uses a data set of superhero character objects stored in Firebase, each with statistics pulled from the [Marvel Database Wiki](https://marvel.fandom.com/wiki/Marvel_Database). On game start, the character objects are retrieved, shuffled, and dealt into 2 decks of 10 cards each—one for you (the player) and one for your opponent (the computer). Each round, you choose the statistic from your card that you believe to be larger than your opponent's, and the winner of the challenge gets both cards. Game play continues until one of the decks is empty.

## Development
I originally built this application in Oct and Nov 2022 during my time at Juno College.

## Attributions
- Lexend and Fugaz One fonts from [Google Fonts](https://fonts.google.com/)
- Marvel character data from the [Marvel Database Wiki](https://marvel.fandom.com/wiki/Marvel_Database)
- CSSTransition component from [React Transition Group](https://reactcommunity.org/react-transition-group/css-transition)
- Fisher-Yates shuffle array function adapted from [JSTips](https://www.jstips.co/en/javascript/shuffle-an-array/)
- Light or Dark colour determining function adapted from [Andreas Wik](https://awik.io/determine-color-bright-dark-using-javascript/), [Jed Schmidt](https://gist.github.com/jed/983661), and [Darel Rex Finley](http://alienryderflex.com/hsp.html)

## Setup
### Build commands
- npm run start
- npm run build