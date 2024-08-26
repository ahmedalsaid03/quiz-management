// select Elements
let spans = document.querySelector(".bullets .spans")
let countSpan = document.querySelector(".count span")
let qArea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area")
let btn = document.querySelector(".submit-btn")
let bullets = document.querySelector(".bullets")
let resultsContainer = document.querySelector(".results")
let countDownContainer = document.querySelector(".count-down")

// glabal variables
let count = 9
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval ;


// fuctions

function getQuestions() {
    let request = new XMLHttpRequest()
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let data = JSON.parse(this.responseText)
            let qcount = data.length;

            createBullets(qcount);

            addData(data[currentIndex], qcount);

            countDown(4, qcount);
            btn.addEventListener("click", function () {
                let rAnswer = data[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(rAnswer,qcount);

                qArea.innerHTML = "";
                answersArea.innerHTML = "";
                addData(data[currentIndex], qcount)
                handleBullets();

                clearInterval(countDownInterval)
                countDown(4, qcount)

                showResults(qcount);
            })
        }
    };

  

    request.open("GET", "html_questions.json", true);
    request.send();
}


function createBullets(num) {
    countSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {

        let span = document.createElement("span")
        if (i === 0) {
            span.className = "on"
        }
        spans.appendChild(span);
    }

};

function handleBullets(){
    let bullets = document.querySelectorAll(".spans span")
    bullets.forEach((span,index)=>{
        if(index === currentIndex){
            span.className = "on"
        }
    })
}

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function addData(obj, qcount) {
    if(currentIndex < qcount){
        let h2 = document.createElement("h2");
    qTitle = document.createTextNode(`${obj.title}`)
    h2.appendChild(qTitle);
    qArea.appendChild(h2);

    for (let i = 1; i <= 4; i++) {
        let div = document.createElement("div")
        div.className = "answer";
        let radioInput = document.createElement("input")
        setAttributes(radioInput, { "type": "radio", "id": `answer-${i}`, "name": "question" })
        radioInput.dataset.answer = obj[`answer_${i}`]
        if (i === 1) {
            radioInput.checked = true
        }
        let label = document.createElement("label")
        label.htmlFor = `answer-${i}`
        let labelText = document.createTextNode(obj[`answer_${i}`])
        label.appendChild(labelText)
        div.appendChild(radioInput)
        div.appendChild(label)
        answersArea.appendChild(div);
    }
    }
};

function checkAnswer(rAnswer, qcount){
let choosenAnswer ;
let answers = document.getElementsByName("question")
    for(let i = 0 ; i < answers.length ; i++){
        if(answers[i].checked){
            choosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === choosenAnswer){
        rightAnswers++;
    }
}

function showResults (count){
    let results;
    if(currentIndex === count){
        qArea.remove();
        answersArea.remove();
        btn.remove();
        bullets.remove()
        if(rightAnswers  > (count / 2 ) && rightAnswers < count){
            results = `<span class="good">Good</span>,${rightAnswers} from ${count}`
        }
        else if(rightAnswers === count){
            results = `<span class="excellent">excellent</span>,${rightAnswers} from ${count}`
        }
        else{
             results = `<span class="bad">bad </span>,${rightAnswers} from ${count}`
        }
        resultsContainer.innerHTML = results;
        resultsContainer.style.display = "block"
    }
}

function countDown(duration, count){
    if(currentIndex < count){
        let minutes , seconds;
        countDownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;
            countDownContainer.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0){
                clearInterval(countDownInterval) 
                btn.click();
            }
        },1000)
    }
}


// run functions

getQuestions()


