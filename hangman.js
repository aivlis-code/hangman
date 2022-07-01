// Word that user must guess
var toGuess;
// Lives that the user has before losing
var lives = 6;
// Seconds that the user has to guess the word
var initialTimer;

function startEasy() {
  initialTimer = 240;
  var words = ["html", "css", "java", "sql"];
  start(words);
}

function startMedium() {
  initialTimer = 180;
  var words = ["phyton", "javascript", "coding"];
  start(words);
}

function startHard() {
  initialTimer = 120;
  var words = [
    "hypertext markup language",
    "web development",
    "system of signals"
  ];
  start(words);
}

function start(words) {
  // Stop the timer from previous games
  stopTimer();
  setLivesTo6();
  cleanGameBoard();
  drawScaffolding();
  setRandomWordToGuess(words);
  initializeEmptyGameBoard();
  enableGuessButtons();
  startTimer();
}

function setLivesTo6() {
  lives = 6;
  // Write in the HTML that we have 6 lives
  document.getElementById("lives").innerHTML = lives.toString();
}

// Remove the letter boxes from previous games in the game board
function cleanGameBoard() {
  var lettersRow = document.getElementById("letters");
  while (lettersRow.firstChild) {
    lettersRow.removeChild(lettersRow.firstChild);
  }
}

function setRandomWordToGuess(words) {
  toGuess = words[Math.floor(Math.random() * words.length)];
}

// Inizialize the game board, that is the table containing the boxes with the guesses
function initializeEmptyGameBoard() {
  var lettersRow = document.getElementById("letters");
  for (var i = 0; i < toGuess.length; i++) {
    var character = toGuess.charAt(i);
    // Create the table data for the new letter
    var newTableData = document.createElement("td");
    newTableData.className = "guess-box";
    // The value of the node. If the character is a space, then this is a space. Otherwise, nodeValue is a underscore
    var nodeValue;
    if (character != " ") {
      nodeValue = "_";
    } else {
      nodeValue = " ";
    }
    var textNode = document.createTextNode(nodeValue);
    newTableData.appendChild(textNode);
    lettersRow.appendChild(newTableData);
  }
}

function guessLetter(guessed) {
  document.getElementById("guess-button-" + guessed).disabled = true;

  var found = false;
  for (var i = 0; i < toGuess.length; i++) {
    var currentCharacter = toGuess.charAt(i);
    if (currentCharacter == guessed) {
      found = true;
      // Set the text
      document.getElementById("letters").children.item(i).innerHTML =
        currentCharacter;
    }
  }

  if (found == false) {
    // The user guessed a letter that is not in the word
    lives -= 1;
    document.getElementById("lives").innerHTML = lives.toString();
    switch (lives) {
      case 5:
        drawHead();
        break;
      case 4:
        drawBody();
        break;
      case 3:
        drawLeftArm();
        break;
      case 2:
        drawRightArm();
        break;
      case 1:
        drawLeftLeg();
        break;
      case 0:
        // The player lost
        stopTimer();
        drawRightLeg();
        disableGuessButtons();
        window.alert(
          "You do not have lives left, you lost! The word was " + toGuess
        );
        break;
    }
  }

  if (found == true && playerWon()) {
    stopTimer();
    window.alert("You won!");
    disableGuessButtons();
  }
}

// Return true only if the player has guessed all the letters
function playerWon() {
  var lettersBoxes = document.getElementById("letters");
  for (let i = 0; i < lettersBoxes.children.length; i++) {
    let currentLetter = lettersBoxes.children[i].innerHTML;
    if (currentLetter == "_") {
      return false;
    }
  }
  // We considered all guessed letters, and we did not find any underscore, then the player won
  return true;
}

function enableGuessButtons() {
  var allLetters = "abcdefghijklmnopqrstuvwxyz".split("");
  for (var i = 0; i < allLetters.length; i++) {
    var letter = allLetters[i];
    document.getElementById("guess-button-" + letter).disabled = false;
  }
}

function disableGuessButtons() {
  var allLetters = "abcdefghijklmnopqrstuvwxyz".split("");
  for (var i = 0; i < allLetters.length; i++) {
    var letter = allLetters[i];
    document.getElementById("guess-button-" + letter).disabled = true;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Timer
////////////////////////////////////////////////////////////////////////////////

var startDate;
var timerUpdater;

function startTimer() {
  startDate = new Date();
  updateTimer();
}

function stopTimer() {
  if (timerUpdater != undefined) {
    clearTimeout(timerUpdater);
  }
}

function updateTimer() {
  // Current date
  var currentDate = new Date();
  // How many seconds passed since the timer was started
  var timeDeltaSeconds = Math.floor((currentDate - startDate) / 1000);
  // How much time the user has left
  var timeLeft = initialTimer - timeDeltaSeconds;
  // Minutes that the user has left
  var minutes = Math.floor(timeLeft / 60);
  // Seconds that the user has left
  var seconds = timeLeft % 60;

  // Display seconds that are less than 10 with a zero at the beginning
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // Update the timer in HTML
  var time = minutes + ":" + seconds;
  document.getElementById("timer").innerHTML = time;

  if (timeLeft <= 0) {
    // The time is over: the user lost
    stopTimer();
    window.alert("Timeout, you lost! The word was " + toGuess);
    disableGuessButtons();
  } else {
    // Set timerUpdater to setTimeout, so that other functions can stop the timer. For example, when the user wins.
    // If not stopped, this function will call itself in 0.5 seconds
    timerUpdater = setTimeout(updateTimer, 500);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Drawing
////////////////////////////////////////////////////////////////////////////////

function drawScaffolding() {
  var hangmanCanvas = document.getElementById("hangman-canvas");
  context = hangmanCanvas.getContext("2d");

  // Clear the canvas from possible previous games
  context.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);

  // Draw the scaffolding
  context.beginPath();
  context.strokeStyle = "#632904";
  context.lineWidth = 3;
  context.moveTo(110, 20);
  context.lineTo(110, 200);
  context.moveTo(90, 200);
  context.lineTo(130, 200);
  context.moveTo(110, 20);
  context.lineTo(200, 20);
  context.stroke();

  // Draw the rope
  context.beginPath();
  context.strokeStyle = "#eb955e";
  context.moveTo(200, 20);
  context.lineTo(200, 40);
  context.stroke();
}

function drawHead() {
  var hangmanCanvas = document.getElementById("hangman-canvas");
  context = hangmanCanvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.arc(200, 50, 10, 0, Math.PI * 2, true);
  context.stroke();
}

function drawBody() {
  var hangmanCanvas = document.getElementById("hangman-canvas");
  context = hangmanCanvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.moveTo(200, 60);
  context.lineTo(200, 130);
  context.stroke();
}

function drawLeftArm() {
  var hangmanCanvas = document.getElementById("hangman-canvas");
  context = hangmanCanvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.moveTo(200, 80);
  context.lineTo(160, 50);
  context.stroke();
}

function drawRightArm() {
  var hangmanCanvas = document.getElementById("hangman-canvas");
  context = hangmanCanvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.moveTo(200, 80);
  context.lineTo(240, 50);
  context.stroke();
}

function drawLeftLeg() {
  var hangmanCanvas = document.getElementById("hangman-canvas");
  context = hangmanCanvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.moveTo(200, 130);
  context.lineTo(170, 160);
  context.stroke();
}

function drawRightLeg() {
  var hangmanCanvas = document.getElementById("hangman-canvas");
  context = hangmanCanvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.moveTo(200, 130);
  context.lineTo(230, 160);
  context.stroke();
}
