let player1Name = '';
let player2Name = '';
let selectedCategory = [];
let currentPlayer;
let categories = [];



document.getElementById('playerForm').addEventListener('submit', function (event) {
    event.preventDefault();


    player1Name = document.getElementById('player1').value;
    player1Name = "Player 1 " + player1Name;


    player2Name = document.getElementById('player2').value;
    player2Name = "Player 2 " + player2Name;

    currentPlayer = player1Name;


    if (player1Name && player2Name) {
        showCategorySelection();
    } else {
        alert('Please enter both player names!');
    }
});



function showCategorySelection() {
    document.body.innerHTML = '';
    let categoryContainer = document.querySelector('.category-container');

    if (!categoryContainer) {
        categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        document.body.appendChild(categoryContainer);
    }

    categoryContainer.innerHTML = ''; 

    const title = document.createElement('h2');
    title.textContent = 'Select a Category';
    categoryContainer.appendChild(title);

    categories = [];

    fetchCategories();

    async function fetchCategories() {
        try {
            let response = await fetch('https://the-trivia-api.com/v2/categories');
            let data = await response.json();
            console.log("This is category data", data);

            categories = [];

            for (let category in data) {
                
                if (selectedCategory.includes(category)) {
                    continue; 
                }

                categories.push(category);

                const button = document.createElement('button');
                button.textContent = category;
                categoryContainer.appendChild(button);

                button.addEventListener('click', function () {
                    if (!selectedCategory.includes(category)) {
                        button.remove(); 
                        selectedCategory.push(category);

                        console.log("Before selecting category:", categories);
                        console.log("After selecting category:", selectedCategory);

                        fetchQuestions(category); 
                    } else {
                        alert("You have already chosen this category! Please choose another category");
                    }
                });
                
            }
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    }
}


async function fetchQuestions(category) {
    document.querySelector('.category-container').style.display = 'none';

    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Fetching questions.....';
    document.body.appendChild(loadingMessage);

    let difficultyLevelQues= ["easy","medium","hard"]
    const questions = [];
    for(let i =0; i<difficultyLevelQues.length;i++){
        const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&limit=2&difficulties=${difficultyLevelQues[i]}`);
        const data = await response.json();
        console.log(difficultyLevelQues[i]);
        
        console.log("this is api fetch data",data);
        questions.push(...data)
        
    }
    displayQuestions(questions )
    

}


let currentQuestionIndex = 0;

let scores = { player1: 0, player2: 0 };



function displayQuestions(questions) {
    showQuestion(questions[currentQuestionIndex])

    async function showQuestion(question) {
        console.log("undefined very  ", question);

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
            if (selectedCategory.length == 10) {
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
    const endContainer = document.querySelector('.end-container ');
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


