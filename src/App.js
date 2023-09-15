import "./App.css";
import { useCallback, useEffect, useState } from "react";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";
import { wordsList } from "./data/words";

const stages = [
  { id: 1, nome: "start" },
  { id: 2, nome: "game" },
  { id: 3, nome: "end" },
];

const guessedQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].nome);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setpickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessedQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    //pick a random word inside the category
    const word =
      words[category][Math.floor(Math.random() * wordsList[category].length)];

    return { word, category };
  }, [words]);

  //starts the secret word game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();

    //pick word and pick category
    const { word, category } = pickWordAndCategory();

    //create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    console.log(wordLetters);

    //fill states
    setPickedWord(word);
    setpickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].nome);
  }, [pickWordAndCategory]);

  //process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toString().toLowerCase();

    //check if the letter has already been used
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]); //aqui pegamos o atual estado de guessedLetters e colocamos dentro desse array a nova letra (normalizada)
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]); //aqui pegamos o atual estado de wrongLetters e colocamos dentro desse array a nova letra (normalizada)
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates();

      setGameStage(stages[2].nome);
    }
  }, [guesses]);

  //check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]; //com o Set conseguimos um array apenas de letras únicas;

    //win condition
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => (actualScore += 100));
      //restart game with new word
      startGame();
    }
  }, [letters, guessedLetters, startGame]);

  //restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessedQty);
    setGameStage(stages[0].nome);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guesses={guesses}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
