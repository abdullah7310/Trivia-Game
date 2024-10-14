let player1Name = '';
let player2Name = '';
let selectedCategory = '';
let currentPlayer;


// player1Name = document.getElementById('player1').value;


// player2Name = document.getElementById('player2').value;


document.getElementById('playerForm').addEventListener('submit', function (event) {
    event.preventDefault();


    player1Name = document.getElementById('player1').value;
    player1Name = "Player 1 " + player1Name;
    // console.log(player1Name);

    player2Name = document.getElementById('player2').value;
    player2Name = "Player 2 " + player2Name;
    // console.log(player2Name);
    currentPlayer = player1Name;


    if (player1Name && player2Name) {
        showCategorySelection();
    } else {
        alert('Please enter both player names!');
    }
});
// console.log(player1Name);
const categories = ['General Knowledge', 'Science', 'History', 'Geography', 'Music', 'Sports'];


function showCategorySelection() {
    document.body.innerHTML = '';


    // document.querySelector('.welcome-container').style.display = 'none';
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    const title = document.createElement('h2');
    title.textContent = 'Select a Category';
    categoryContainer.appendChild(title);
    // const categories = ['General Knowledge','Science','History','Geography','Music','Sports'];

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', function () {
            selectedCategory = category;
            const categoryIndex = categories.indexOf(category);
            categories.splice(categoryIndex, 1);
            console.log(categories);


            fetchQuestions(category);
        })
        categoryContainer.appendChild(button);
    })

    document.body.appendChild(categoryContainer);
}

async function fetchQuestions(category) {
    document.querySelector('.category-container').style.display = 'none';

    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Fetching questions.....';
    document.body.appendChild(loadingMessage);

    try {
        const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category.toLowerCase()}&limit=6&difficulty=easy,medium,hard`);
        const data = await response.json();
        console.log('total question', data);

        loadingMessage.remove();

        console.log(data);
        data.forEach(check => {
            console.log(check.difficulty);

        })


        let easyQuestions = data.filter(q => q.difficulty === 'easy');
        let mediumQuestions = data.filter(q => q.difficulty === 'medium');
        let hardQuestions = data.filter(q => q.difficulty === 'hard');

        easyQuestions = easyQuestions.slice(0, 2);
        mediumQuestions = mediumQuestions.slice(0, 2);
        hardQuestions = hardQuestions.slice(0, 2);


        let remainingQuestions = data.filter(q => ![...easyQuestions, ...mediumQuestions, ...hardQuestions].includes(q));

        if (easyQuestions.length < 2) {
            easyQuestions = easyQuestions.concat(remainingQuestions.slice(0, 2 - easyQuestions.length));
            remainingQuestions = remainingQuestions.slice(2 - easyQuestions.length);
        }

        if (mediumQuestions.length < 2) {
            mediumQuestions = mediumQuestions.concat(remainingQuestions.slice(0, 2 - mediumQuestions.length));
            remainingQuestions = remainingQuestions.slice(2 - mediumQuestions.length);
        }

        if (hardQuestions.length < 2) {
            hardQuestions = hardQuestions.concat(remainingQuestions.slice(0, 2 - hardQuestions.length));
        }

        const questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

        if (questions.length < 6) {
            alert("Unable to fetch enough questions for the game. Please try again.");
            return;
        }

        displayQuestions(questions);

    } catch (error) {
        console.log("Error fetching questions: ", error);
        loadingMessage.textContent = "Error fetching questions. Please try again.";
    }
}




// player1Name = document.getElementById('player1').value;
// console.log(player1Name);

// player2Name = document.getElementById('player2').value;
// console.log(player2Name);

let currentQuestionIndex = 0;

let scores = { player1: 0, player2: 0 };



function displayQuestions(questions) {
    showQuestion(questions[currentQuestionIndex])

    async function showQuestion(question) {
        document.body.innerHTML = '';


        const badaContainer = document.createElement('div');
        badaContainer.classList.add('sirfQues');
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('nameD');
        nameDiv.innerHTML = ` <span> ${player1Name} / ${scores.player1} </span> <span> ${player2Name} / ${scores.player2} </span>`
        badaContainer.append(nameDiv)
        const questionText = document.createElement('p');
        questionText.classList.add('ques-div');
        questionText.innerHTML = ` <span> Question for ${currentPlayer} </span> <br> <p> ${question.question.text}</p>`;
        badaContainer.appendChild(questionText);
        document.body.appendChild(badaContainer);


        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');
        // let quesDiv = document.createElement('div');
        // quesDiv.classList.add('question-div');

        // quesDiv.appendChild(questionText);
        // questionContainer.appendChild(quesDiv);

        document.body.appendChild(questionContainer);
        await showOptions(questionContainer, question);

    }

    async function showOptions(container, question) {
        const correctButton = document.createElement('button');
        correctButton.classList.add("correctAns");
        correctButton.textContent = question.correctAnswer;
        correctButton.addEventListener('click', () => {
            document.querySelector(".correctAns").style.backgroundColor = "blue";
            document.querySelectorAll(".wrong").forEach(btn => {
                btn.style.backgroundColor = "red";
            });
            // document.querySelectorAll(".wrongAns").style.backgroundColor = "red";
            setTimeout(() => {
                handleAnswer(question.correctAnswer, question.correctAnswer);
            }, 1000)
            // handleAnswer(question.correctAnswer, question.correctAnswer)
        });
        container.appendChild(correctButton);

        question.incorrectAnswers.forEach(answer => {
            const answerButton = document.createElement('button');
            
            answerButton.classList.add("wrong");
            answerButton.textContent = answer;
            answerButton.addEventListener('click', () => {
                document.querySelector(".correctAns").style.backgroundColor = "blue";
                document.querySelectorAll(".wrong").forEach(btn => {
                    btn.style.backgroundColor = "red";
                });
                setTimeout(() => {
                    handleAnswer(answer, question.correctAnswer);
                }, 1000)
            });
            container.appendChild(answerButton);
        });

        shuffleOptions(container);
    }

    function handleAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer === correctAnswer) {
            if (currentPlayer === player1Name) {
                scores.player1 += getPointsForQuestion(currentQuestionIndex);
            } else {
                scores.player2 += getPointsForQuestion(currentQuestionIndex)
            }
        } else {
            // alert("Wrong Answer");

        }

        currentQuestionIndex++;
        currentPlayer = currentPlayer === player1Name ? player2Name : player1Name;
        //toggle player for switching

        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex])
        } else {
            currentQuestionIndex = 0;
            if (categories.length == 0) {
                endGame()
            } else {
                document.body.innerHTML = '<button class="chooseAnotherCategory">choose another categary</button> <button class="endGame" >End Game</button>';
                document.querySelector(".chooseAnotherCategory").addEventListener('click', showCategorySelection);
                document.querySelector(".endGame").addEventListener('click', endGame);
                console.log("end");
            }


            // endGame()
        }
    }
}
function getPointsForQuestion(index) {
    if (index < 2) return 10;
    if (index < 4) return 15;
    return 20;
}

function endGame() {
    document.body.innerHTML = '<div class="end-container"></div>';
    const resultMessage = document.createElement('h2');
    const resultMessage2 = document.createElement('h2');
    const endContainer = document.querySelector('.end-container');
    if (scores.player1 > scores.player2) {
        resultMessage.textContent = `${player1Name} wins with ${scores.player1} points !!`;
        resultMessage2.textContent = ` ${player2Name} Lose with ${scores.player2} points !!!`;
        endContainer.appendChild(resultMessage);
        endContainer.appendChild(resultMessage2);
    } else if (scores.player2 > scores.player1) {
        resultMessage.textContent = `${player2Name} wins with ${scores.player2} points !!`;
        resultMessage2.textContent = ` ${player1Name} Lose with ${scores.player1} points !!!`;
        endContainer.appendChild(resultMessage);
        endContainer.appendChild(resultMessage2);
    } else {
        resultMessage.textContent = 'It\'s a tie!!';
        endContainer.appendChild(resultMessage);
    }

    const homeButton = document.createElement("button");
    homeButton.classList.add("Home");
    homeButton.innerHTML = "Home";
    endContainer.appendChild(homeButton);
    document.querySelector(".Home").addEventListener("click", () => location.reload());
}
function shuffleOptions(container) {
    for (let i = container.children.length; i >= 0; i--) {
        container.appendChild(container.children[Math.random() * i | 0]);
    }
}