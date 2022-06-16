// Pages
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
// Splash page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";
let correctGuess = 0;

// Scroll
let valueY = 0;
let itemIndex = 0;

// Check local Storage for best Scores, Set besScoresArray

function getSavedBestScrores() {
  if (localStorage.getItem("bestScores")) {
    bestScoreArray = JSON.parse(localStorage.getItem("bestScores"));
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Refresh Splash Page Page Best Scores
function bestScoresToDOM() {
  bestScores.forEach((bestScoreEl, index) => {
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Update Best Score
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct best Score to Update
    if (parseInt(questionAmount) === score.questions) {
      // Return Best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoresToDOM();
  // Save to local Storage
  localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
}

// Scroll, Change opacity of solved questions, Store user selection in playerGuessArray
function select(guessedTrue) {
  // Change opacity
  const items = document.querySelectorAll(".item");
  items[itemIndex].classList.add("finished");
  itemIndex++;
  // Scroll 80 more pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add Player guess to array
  return guessedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// Reset Game
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  itemIndex = 0;
  correctGuess = 0;
  playAgainBtn.hidden = true;
}

// Show Score Page
function showScorePage() {
  // Show Play Again button after 1 second delay
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Format and display Time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}`;
  updateBestScore();
  // Scroll to Top
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  // Go to Score Page
  showScorePage();
}

// Stop Timer , Process Results, go to Score Page
function checkTime() {
  if (playerGuessArray.length === parseInt(questionAmount)) {
    // Stop timer
    clearInterval(timer);
    // Check for wrong guess, add penalty time.
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No penalty
        correctGuess++;
      } else {
        // Incorrect Guess, Add penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log(
      "time:",
      timePlayed,
      "penalty:",
      penaltyTime,
      "final:",
      finalTime,
      "correct guesses:",
      correctGuess
    );
    scoresToDOM();
  }
}

// Adds time to time played.
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start time when gampe page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}
// Show Game Page
function showGamePage() {
  countdownPage.hidden = true;
  gamePage.hidden = false;
}

// Get Random Number up to a certain amount
function getRandomInt(max) {
  return Math.floor(Math.random() * (parseFloat(max) + 1));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log("correct equations:", correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log("wrong equations:", wrongEquations);
  // Loop through for each correct equation, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }
  // Loop through for each wrong equation, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    if (equationValue === 0) {
      firstNumber++;
      secondNumber++;
    }
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${
      secondNumber + 1
    } = ${equationValue}`;

    const formatChoice = getRandomInt(wrongFormat.length - 1);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add Equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    //Equation Text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorect equations
function populateGamePage() {
  // Reset DOM, Set Blan Space Above.
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// Displays countdown and shows game page.
function countdownStart() {
  let countDownNum = 3;
  countdown.textContent = countDownNum;
  const stopCountDown = setInterval(() => {
    countDownNum--;
    if (countDownNum > 0) {
      countdown.textContent = countDownNum;
    }
    if (countDownNum === 0) {
      countdown.textContent = "Go!";
    }
    if (countDownNum === -1) {
      showGamePage();
      clearInterval(stopCountDown);
    }
  }, 1000);
}

// Starts CountDown page and populates game.
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
}

//Get the vaue from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of Questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log("question amount:", questionAmount);
  if (questionAmount) {
    showCountdown();
  }
}

// Event Listeners

// Switch selected input styling
startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove("selected-label");
    // Add class selected if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// Submit form and move to countdown page
startForm.addEventListener("submit", selectQuestionAmount);
// Start timer when player clicks on game container.
gamePage.addEventListener("click", startTimer);

//On Load
getSavedBestScrores();
