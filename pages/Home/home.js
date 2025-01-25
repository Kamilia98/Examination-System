import { fetchExam, fetchUser } from "../../db/Apis/GET.js";
const loader = document.getElementById("loader");
const page = document.getElementById("page");
const logoutBtn = document.getElementById("logoutBtn");

// Show loader initially
loader.classList.remove("hidden");
page.classList.add("hidden");

// Fetch and display user details
const { firstName } = JSON.parse(localStorage.getItem("user"));
document.querySelector("#welcomeText").textContent = `Welcome, ${firstName}`;

// Logout functionality
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  history.replaceState(null, "", "../Registration/registration.html");
  location.href = "../Registration/registration.html";
});

// Extract user ID from URL
const userId = new URLSearchParams(window.location.search).get("userId");

// Fetch user data and display exams
(async function getUser() {
  const user =
    JSON.parse(localStorage.getItem("userData")) ||
    (await fetchUser(userId))[0];
  displayExams(user.exams);
})();

// Display exams in the UI
async function displayExams(userExams) {
  const examsContainer = document.querySelector("#exams");
  examsContainer.innerHTML = ""; // Clear existing content

  const examElements = await Promise.all(userExams.map(createExamElement));
  examElements.forEach((examElement) =>
    examsContainer.appendChild(examElement)
  );

  loader.classList.add("hidden");
  page.classList.remove("hidden");
}

// Create exam element styled as a Bootstrap card
async function createExamElement(userExam) {
  const exam = await fetchExam(userExam.examId).then((exams) => exams[0]);
  const card = document.createElement("div");
  card.classList.add("col");
  card.innerHTML = `
    <div class="card shadow-sm h-100">
      <div class="card-body gap-3">
        <h5 class="card-title">${exam.title}</h5>
        ${
          userExam.status === "pending"
            ? `
            <div class="mb-2">
              <label class="form-label">Choose Difficulty:</label>
              <select class="form-select">
                <option value="e">Easy</option>
                <option value="m" selected>Medium</option>
                <option value="h">Hard</option>
              </select>
            </div>
            <button
              class="btn btn-primary startBtn"
              style="background-color: #074128; border: none"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              data-exam="${userExam.examId}"
              data-exam-title="${exam.title}"
            >
              Start Exam
            </button>
          `
            : `
          <p class="card-text fw-bold" style="color: ${
            userExam.status === "success" ? "green" : "red"
          };">Status: ${userExam.status}</p>
          ${
            userExam.score !== null
              ? `<p class="card-text">Score: ${userExam.score}</p>`
              : ""
          }
        `
        }
      </div>
    </div>
  `;

  return card;
}

// Add event listeners to 'Start Exam' buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("startBtn")) {
    const modalTitle = document.querySelector("#exampleModalLabel");
    const modalBody = document.querySelector(".modal-body");
    const confirmButton = document.querySelector("#confirmButton");

    const { exam, examTitle } = e.target.dataset;
    const difficulty = e.target.closest("div").querySelector("select").value; // Get selected difficulty
    // console.log(e.target.closest("div").querySelector("select").value);

    modalTitle.textContent = `Start Exam: ${examTitle}`;
    modalBody.innerHTML = `<p>Are you sure you want to start the exam?</p><p>Difficulty: ${difficulty}</p>`;

    confirmButton.onclick = () => {
      history.replaceState(
        null,
        "",
        `../Exam/exam.html?userId=${userId}&examId=${exam}&difficulty=${difficulty}`
      );
      location.href = `../Exam/exam.html?userId=${userId}&examId=${exam}&difficulty=${difficulty}`;
    };
  }
});
