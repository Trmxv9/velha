document.addEventListener("DOMContentLoaded", () => {
  const hangmanAvatar = document
    .getElementById("hangman-avatar")
    .querySelector("pre");
  const wordDisplay = document.getElementById("word-display");
  const guessInput = document.getElementById("guess-input");
  const guessButton = document.getElementById("guess-button");
  const hangmanResult = document.getElementById("hangman-result");
  const wrongLettersDisplay = document.getElementById("wrong-letters");
  const gamesWonDisplay = document.getElementById("games-won");
  const gamesLostDisplay = document.getElementById("games-lost");

  let words = [];
  let currentWord = "";
  let guessedLetters = [];
  let wrongLetters = [];
  let remainingAttempts = 6;
  let gamesWon = 0;
  let gamesLost = 0;

  async function fetchWordsAndCreateString() {
    try {
      const response = await fetch("../letras.json");
      words = await response.json();

      // Move a lógica de inicialização do jogo para dentro da função assíncrona
      resetHangman();

      guessButton.addEventListener("click", handleGuess);
      guessInput.addEventListener("keydown", handleInputKey);
    } catch (error) {
      console.error("Erro ao carregar o arquivo JSON:", error);
    }
  }

  function resetHangman() {
    currentWord = getRandomWord();
    guessedLetters = [];
    wrongLetters = [];
    remainingAttempts = 6;

    renderHangman();
    renderWordDisplay();
    renderWrongLetters();
    renderGamesWonLost();
  }

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  function renderHangman() {
    const hangmanArt = [
      "  +   ",
      "  |   ",
      `  ${remainingAttempts < 6 ? "O" : " "}`,
      ` ${remainingAttempts < 4 ? "/" : " "}${
        remainingAttempts < 5 ? "|" : " "
      }${remainingAttempts < 3 ? "\\" : " "}`,
      ` ${remainingAttempts < 2 ? "/" : " "} ${
        remainingAttempts < 1 ? "\\" : " "
      }`,
    ];

    hangmanAvatar.innerHTML = hangmanArt.join("\n");
  }

  function renderWordDisplay() {
    const displayText = currentWord
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
    wordDisplay.textContent = displayText;

    if (!displayText.includes("_")) {
      gamesWon++;
      showResultMessage(
        `Parabéns! Você acertou a palavra! ${currentWord}`,
        "text-green-600"
      );
      resetHangman();
    } else if (remainingAttempts === 0) {
      gamesLost++;
      showResultMessage(
        `Você perdeu! A palavra era: ${currentWord}`,
        "text-red-600"
      );
      resetHangman();
    }
  }

  function renderWrongLetters() {
    wrongLettersDisplay.textContent = `Você tentou já: ${wrongLetters.join(
      ", "
    )}`;
  }

  function renderGamesWonLost() {
    gamesWonDisplay.textContent = `Jogos Ganhos: ${gamesWon}`;
    gamesLostDisplay.textContent = `Jogos Perdidos: ${gamesLost}`;
  }

  function showResultMessage(message, textColorClass) {
    hangmanResult.textContent = message;
    hangmanResult.classList.remove(
      "text-green-600",
      "text-red-600",
      "text-gray-600"
    );
    hangmanResult.classList.add(textColorClass);
  }

  function handleGuess() {
    handleInput(guessInput.value);
  }

  function handleInputKey(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleInput(guessInput.value);
    }
  }

  function handleInput(input) {
    const cleanedInput = input.toLowerCase().trim();

    if (cleanedInput) {
      for (const letter of cleanedInput) {
        if (guessedLetters.indexOf(letter) === -1) {
          guessedLetters.push(letter);

          if (currentWord.indexOf(letter) === -1) {
            wrongLetters.push(letter);
            remainingAttempts--;
          }
        }
      }

      renderHangman();
      renderWordDisplay();
      renderWrongLetters();
      renderGamesWonLost();

      guessInput.value = "";
    }
  }

  // Chama a função para carregar as palavras e iniciar o jogo
  fetchWordsAndCreateString();
});
