import { fetchUser } from "../../db/Apis/GET.js";
import { updateUserExam } from "../../db/Apis/POST.js";

// Retrieve user and exam data
const { firstName } = JSON.parse(localStorage.getItem("user"));
const { userId, examId, score } = Object.fromEntries(
  new URLSearchParams(window.location.search).entries()
);

// DOM Elements
const resultItem = document.querySelector("#result");
const homeBtn = document.querySelector("#homeBtn");

// Determine exam result and status
const getStatusMessage = (score, name) => {
  console.log(score);
  if (score == -1) {
    return {
      message: `Time's out, ${name}`,
      status: "fail",
      color: "rgb(185, 31, 31)",
    };
  }
  if (score < 50) {
    return { message: `You failed, ${name}`, status: "fail", color: "red" };
  }
  if (score == 100) {
    return {
      message: `You got a full score, ${name}!`,
      status: "success",
      color: "green",
    };
  }
  return { message: `You passed, ${name}!`, status: "success", color: "green" };
};

const { message, status, color } = getStatusMessage(score, firstName);
resultItem.textContent = message;
resultItem.style.color = color;
// Event Listener: Update user exam and navigate to home
homeBtn.addEventListener("click", async () => {
  const updatedExamData = {
    examId: Number(examId),
    status,
    score,
  };

  let user = JSON.parse(localStorage.getItem("userData"));
  if (!user) {
    [user] = await fetchUser(userId);
  }
  // Update user's exam data
  const examsIndex = user.exams.findIndex(
    (exam) => exam.examId === Number(examId)
  );
  if (examsIndex !== -1) {
    user.exams[examsIndex] = updatedExamData;
  } else {
    user.exams.push(updatedExamData);
  }

  // Save updated user data and send to backend
  localStorage.setItem("userData", JSON.stringify(user));
  await updateUserExam(userId, examId, updatedExamData);

  // Redirect to home page
  history.replaceState(null, "", `../Home/home.html?userId=${userId}`);
  location.href = `../Home/home.html?userId=${userId}`;
});
