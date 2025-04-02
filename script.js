// Card data  
const cardsArray = [  
    {  
     name: "pokemon1",  
     img: "./game/pokemon1.png",  
    },  
    {  
     name: "pokemon2",  
     img: "./game/pokemon2.png",  
    },  
    {  
     name: "pokemon3",  
     img: "./game/pokemon3.png",  
    },  
    {  
     name: "pokemon4",  
     img: "./game/pokemon4.png",  
    },  
    {  
     name: "pokemon5",  
     img: "./game/pokemon5.png",  
    },  
    {  
     name: "pokemon6",  
     img: "./game/pokemon6.png",  
    },  
    {  
     name: "pokemon7",  
     img: "./game/pokemon7.png",  
    },  
    {  
     name: "pokemon8",  
     img: "./game/pokemon8.png",  
    },  
    {  
     name: "pokemon9",  
     img: "./game/pokemon9.png",  
    },  
    {  
     name: "pokemon10",  
     img: "./game/pokemon10.png",  
    },  
    {  
     name: "pokemon11",  
     img: "./game/pokemon11.png",  
    },  
    {  
     name: "pokemon12",  
     img: "./game/pokemon12.png",  
    },  
   ];  
   // GAME   
   const game = document.getElementById("game");  
   const grid = document.createElement("section");  
   grid.classList.add("grid");  
   // game.addEventListener("click", secCount);  
   game.appendChild(grid);  
   // DOUBLE ARRAY  
   let gameGrid = cardsArray.concat(cardsArray);  
   // FOR RAMDOMISING THE CARDS EVERY TIME WE REFERESH THE PAGE  
   gameGrid.sort(() => 0.5 - Math.random());  
   // CREATE CARDS  
   gameGrid.forEach((item) => {  
    const card = document.createElement("div");  
    card.classList.add(`card`,`${item.name}`);  
    card.dataset.name = item.name;  
    const front = document.createElement("div");  
    front.classList.add("front");  
    const back = document.createElement("div");  
    back.classList.add("back");  
    back.style.backgroundImage = `url(${item.img})`;  
    grid.appendChild(card);  
    card.appendChild(front);  
    card.appendChild(back);  
   });  
   // ATTEMPTS COUNT  
   let attemptCount = 0;  
   let attempts = document.querySelector(".count");  
   attempts.innerText = attemptCount;  
   // SCORE COUNT
   let scoreCount = 0;
   let score = document.querySelector(".score");
   score.innerText = scoreCount;  
   // TIME COUNT  
   var sec = 0;  
   var timeInSec;  
   let min = 0;  
   function secCount() {  
    sec = sec + 1;  
    document.querySelector(".sec-count").innerText = Math.floor(sec % 60);  
    timeInSec = setTimeout(secCount, 1000);  
    min = Math.floor(sec / 60);  
    document.querySelector(".min-count").innerText = min;  
   }  
   var timeStarted = false;  
   // secCount();  
   // RESET ALL  
   let reset = document.querySelector(".reset");  
   reset.addEventListener("click", () => {  
    let confirmReset = confirm("Whole game will start again. continue to reset?");  
    if (confirmReset === true) {  
     window.location.reload();  
    }   
   });  
   // VARIABLES FOR THE GAME  
   let firstGuess = "";  
   let secondGuess = "";  
   let previousTarget = null;  
   let count = 0;  
   let delay = 1200;  
   // FUNCTIONS FOR THE GAME  
   const match = () => {  
    var selected = document.querySelectorAll(".selected");  
    selected.forEach((card) => {  
     card.classList.add("match");  
    });  
    // Increment score for every match
    updateScore();
   };  
   const resetGuesses = () => {  
    firstGuess = "";  
    secondGuess = "";  
    count = 0;  
    var selected = document.querySelectorAll(".selected");  
    selected.forEach((card) => {  
     card.classList.remove("selected");  
    });  
   };  
   // GAME LOGICS  
   grid.addEventListener("click", function (event) {  
    !timeStarted && secCount();  
    timeStarted = true;  
    let clicked = event.target;   
    attemptCount++;  
    attempts.innerText = attemptCount;  
    if (  
     clicked.nodeName === "SECTION" ||  
     clicked === previousTarget ||  
     clicked.parentNode.classList.contains("selected")  
    ) {  
     return;  
    }  
    if (count < 2) {  
     count++;  
     if (count === 1) {  
      // Assign first guess  
      firstGuess = clicked.parentNode.dataset.name;  
      clicked.parentNode.classList.add("selected");  
     } else {  
      // Assign second guess  
      secondGuess = clicked.parentNode.dataset.name;  
      clicked.parentNode.classList.add("selected");  
     }  
     // If both guesses are not empty...  
     if (firstGuess !== "" && secondGuess !== "") {  
      // and the first guess matches the second match...  
      if (firstGuess === secondGuess) {  
       // run the match function  
       // match();  
       // resetGuesses();  
       setTimeout(match, delay);  
       setTimeout(resetGuesses, delay);  
       var matched = document.querySelectorAll(`.${firstGuess}`);  
       matched.forEach(node => node.addEventListener('click',function (e) {    
        e.stopPropagation();  
       }))  
      } else {  
       setTimeout(resetGuesses, delay);  
      }  
     }  
    }  
    // Set previous target to clicked  
    previousTarget = clicked;  
   });

// Function to update the highest score
// Function to update the highest score
function updateHighestScore(score) {
    let highestScore = localStorage.getItem('highestScore') || 0;
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem('highestScore', highestScore);

        // Send the highest score to the backend
        const userId = localStorage.getItem('userId'); // Assuming the user's ID is saved in localStorage
        if (userId) {
            fetch('/api/game/update-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    score: highestScore
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Highest score updated on the backend!');
                } else {
                    console.log('Error updating highest score on the backend:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }
    document.querySelector('.highest-score').textContent = highestScore;
}


// Function to update the score
// Function to update the score and send to backend
function updateScore() {
    scoreCount += 1;
    score.innerText = scoreCount;

    const userId = localStorage.getItem('userId');
    console.log("Updating score for user ID:", userId, "New score:", scoreCount);  // Add logging
    
    if (userId) {
        fetch('http://localhost:5000/api/game/update-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                score: scoreCount
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Score updated on the backend!');
            } else {
                console.log('Error updating score on the backend:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}



// Initialize the highest score on page load
document.addEventListener('DOMContentLoaded', () => {
    const highestScore = localStorage.getItem('highestScore') || 0;
    document.querySelector('.highest-score').textContent = highestScore;
});