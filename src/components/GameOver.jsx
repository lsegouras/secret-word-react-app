import "./GameOver.css";

const GameOver = ({ retry, score }) => {
  return (
    <div>
      <h1>Game Over!</h1>
      <h2>
        Sua pontuação foi de: <span>{score}</span>
      </h2>
      <button onClick={retry}>Finalizar Jogo!</button>
    </div>
  );
};

export default GameOver;
