const urlParams = new URLSearchParams(window.location.search);
    const cls = urlParams.get("class");
    const difficulty = urlParams.get("difficulty");
    const category = urlParams.get("category");

    let questions = [], current = 0, score = 0, timer, timeLeft = 15;

    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const timerEl = document.getElementById("timer");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const resetBtn = document.getElementById("reset");

    document.getElementById("quizTitle").textContent = `🧠 Class ${cls} | ${difficulty.toUpperCase()} | Quiz`;

    fetch(`https://opentdb.com/api.php?amount=10&type=multiple&category=${category}&difficulty=${difficulty}`)
      .then(res => res.json())
      .then(data => {
        questions = data.results.map(q => ({
          question: decodeHTML(q.question),
          options: shuffle([...q.incorrect_answers, q.correct_answer].map(decodeHTML)),
          answer: decodeHTML(q.correct_answer)
        }));
        loadQuestion();
      });

    function decodeHTML(str) {
      const txt = document.createElement("textarea");
      txt.innerHTML = str;
      return txt.value;
    }

    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    function loadQuestion() {
      if (current >= questions.length) return showResult();

      const q = questions[current];
      questionEl.textContent = q.question;
      optionsEl.innerHTML = "";

      q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "btn btn-outline-primary m-2";
        btn.onclick = () => {
          if (opt === q.answer) score++;
          nextQuestion();
        };
        const li = document.createElement("li");
        li.appendChild(btn);
        optionsEl.appendChild(li);
      });

      startTimer();
      updateNavButtons();
    }

    function startTimer() {
      clearInterval(timer);
      timeLeft = 15;
      timerEl.textContent = `⏱️ ${timeLeft}s`;
      timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `⏱️ ${timeLeft}s`;
        if (timeLeft === 0) nextQuestion();
      }, 1000);
    }

    function nextQuestion() {
      if (current < questions.length - 1) {
        current++;
        loadQuestion();
      } else {
        showResult();
      }
    }

    function prevQuestion() {
      if (current > 0) {
        current--;
        loadQuestion();
      }
    }

    function updateNavButtons() {
      prevBtn.style.display = current > 0 ? "inline-block" : "none";
      nextBtn.style.display = current < questions.length - 1 ? "inline-block" : "none";
    }

    function showResult() {
      clearInterval(timer);
      questionEl.textContent = `🎉 You scored ${score} out of ${questions.length}`;
      optionsEl.innerHTML = "";
      timerEl.textContent = "";
      nextBtn.style.display = "none";
      prevBtn.style.display = "none";
    }

    nextBtn.onclick = nextQuestion;
    prevBtn.onclick = prevQuestion;
    resetBtn.onclick = () => window.location.href = "index.html";