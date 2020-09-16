var Quiz = {};

var StartTime;
var CurrentScore = 0;
var CurrentTimer;
var QuestionIndex = 0;
var ShowingAnswer = false;


function loadQuiz(path) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				Quiz = JSON.parse(xhr.responseText)
				quizLoaded();
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}


function quizLoaded() {
	var startButton = document.querySelector("#btnStart");
	startButton.removeAttribute("disabled");
	var QuizLabel = document.querySelector("#txtQuizName");
	QuizLabel.textContent = Quiz.quizName;

}

function startQuiz() {
	console.log("Start Quiz");
	StartTime = new Date().getTime();
	console.log(StartTime);

	var startBody = document.querySelector("#startBody");
	startBody.style.display = "none";

	var quizBody = document.querySelector("#quizBody");
	quizBody.style.display = "";

	updateQuestion();
	CurrentTimer = setInterval(updateTimer, 1000);

	CurrentScore = 0;
	updateScore();

	var highscorebutton = document.querySelector("#btnShowHighScore");
	highscorebutton.style.display = "none";
}

function finishQuiz() {
	clearInterval(CurrentTimer);
	var quizBody = document.querySelector("#quizBody");
	quizBody.style.display = "none";

	var finishBody = document.querySelector("#finishBody");
	finishBody.style.display = "";

	var yourScore = document.querySelector("#txtYourScore");
	yourScore.textContent = "Your Score was " + CurrentScore;

	var questionHeader = document.querySelector("#txtQuestion");
	questionHeader.textContent = "GAME OVER!!!";

}

function updateScore() {
	document.querySelector("#txtScore").textContent = "Score: " + CurrentScore;
}

function updateQuestion() {
	ShowingAnswer = false;
	document.querySelector("#btnNext").setAttribute("disabled", "");
	var questionHeader = document.querySelector("#txtQuestion");
	var currentQuestion = Quiz.quizQuestions[QuestionIndex]
	questionHeader.textContent = currentQuestion.question;

	var QuestionCount = 4;
	for (var i = 0; i < QuestionCount; i++) {
		var el = document.querySelector("#txtAns" + i);
		el.textContent = currentQuestion.answers[i].text;
		el.classList.remove("fa", "fa-check", "fa-close");
		el.previousElementSibling.disabled = false;
	}

	for (var i = 0; i < QuestionCount; i++) {
		document.querySelector("#inAns" + i).checked = false;
	}


}

function showAnswer() {
	ShowingAnswer = true;
	var currentQuestion = Quiz.quizQuestions[QuestionIndex]
	var QuestionCount = 4;
	var score = CurrentScore;
	for (var i = 0; i < QuestionCount; i++) {
		var el = document.querySelector("#txtAns" + i);
		if (currentQuestion.answers[i].correct) {
			el.classList.add("fa", "fa-check");
			if (el.previousElementSibling.checked) {
				CurrentScore++;
				updateScore();
			}
		} else {
			el.classList.add("fa", "fa-close");
		}
		el.previousElementSibling.disabled = true;
	}
	if(score == CurrentScore){
		StartTime = StartTime - 5000;
		updateTimer();
	}

}

function nextQuestion() {
	if(document.querySelector("#highscoreBody").style.display !== "none"){
		showStart();
		return;
	}

	if (!ShowingAnswer) {
		showAnswer();
		return;
	}
	if (QuestionIndex + 1 >= Quiz.quizQuestions.length) {
		finishQuiz();
		return;
	}
	QuestionIndex++;
	updateQuestion();
}

function updateTimer() {
	console.log("Updating Timer");
	var timeLeft = Math.round((Quiz.quizTime - (new Date().getTime() - StartTime)) / 1000);
	if(timeLeft < 0){
		finishQuiz();
		timeLeft = 0;
	}
	document.querySelector("#txtTimeLeft").textContent = "Time Left: " + timeLeft.toLocaleString("en-us", { minimumIntegerDigits: 3 });

}

function answerChanged() {
	document.querySelector("#btnNext").removeAttribute("disabled");
}

function showStart(){
	var startBody = document.querySelector("#startBody");
	startBody.style.display = "";

	var quizBody = document.querySelector("#quizBody");
	quizBody.style.display = "none";

	var finishBody = document.querySelector("#finishBody");
	finishBody.style.display = "none";

	var highscoreBody = document.querySelector("#highscoreBody");
	highscoreBody.style.display = "none";

	var highscorebutton = document.querySelector("#btnShowHighScore");
	highscorebutton.style.display = "";

	document.querySelector("#btnNext").textContent = "Next";
	document.querySelector("#btnNext").setAttribute("disabled", "");
	QuestionIndex = 0;

}

function showHighscores() {
	var startBody = document.querySelector("#startBody");
	startBody.style.display = "none";

	var quizBody = document.querySelector("#quizBody");
	quizBody.style.display = "none";

	var finishBody = document.querySelector("#finishBody");
	finishBody.style.display = "none";

	var highscoreBody = document.querySelector("#highscoreBody");
	highscoreBody.style.display = "";

	
	var questionHeader = document.querySelector("#txtQuestion");
	questionHeader.textContent = "HighScores";

	var elScoreList = document.querySelector("#lstScoreList");

	document.querySelector("#btnNext").textContent = "Start";
	document.querySelector("#btnNext").removeAttribute("disabled");

	var scoreList = JSON.parse(localStorage.getItem("HighScores"));
	if (scoreList === null) {
		scoreList = [];
	}

	elScoreList.innerHTML = "";

	for (var i = 0; i < scoreList.length; i++) {
		var listEntry = document.createElement("li");
		listEntry.textContent = scoreList[i].name + " : " + scoreList[i].score;
		elScoreList.appendChild(listEntry);
	}
}

function submitHighscore() {
	var name = document.querySelector("#inHighscoreName").value;
	var entry = {};
	entry.name = name;
	entry.score = CurrentScore;

	var scores = [];
	if ((scores = JSON.parse(localStorage.getItem("HighScores"))) === null) {
		scores = [];
	}

	scores[scores.length] = entry;

	console.log(scores);

	scores.sort(function (a, b) {
		return b.score - a.score;
	});

	localStorage.setItem("HighScores", JSON.stringify(scores));

	showHighscores();
}


document.querySelector("#btnStart").addEventListener("click", startQuiz);
document.querySelector("#btnNext").addEventListener("click", nextQuestion);
document.querySelector("#btnSubmitHighscore").addEventListener("click", submitHighscore);
document.querySelector("#btnNext").setAttribute("disabled", "");
document.querySelector("#btnShowHighScore").addEventListener("click", showHighscores);
for (var i = 0; i < 4; i++) {
	document.querySelector("#inAns" + i).addEventListener("change", answerChanged)
}

loadQuiz("SampleQuiz.json");