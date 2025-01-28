import { fetchUsers } from "../../db/Apis/GET.js";
import { createUser } from "../../db/Apis/POST.js";
import { goToLogin } from "./navigate.js";

// DOM Elements
const signupForm = document.querySelector("#signupForm");
const eyeIcons = signupForm.querySelectorAll(".eye-icon");
const loader = document.getElementById("loader");
const page = document.getElementById("page");

// Input Fields
const inputs = {
  fName: signupForm.querySelector("#firstName"),
  lName: signupForm.querySelector("#lastName"),
  email: signupForm.querySelector("#email"),
  password: signupForm.querySelector("#password"),
  confirmPassword: signupForm.querySelector("#confirmPassword"),
  gender: signupForm.querySelectorAll('input[name="gender"]'),
};

const errorMessages = signupForm.querySelectorAll(".error-message");
// Error Messages
const errors = {
  fName: inputs.fName.closest(".form-input").querySelector(".error-message"),
  lName: inputs.lName.closest(".form-input").querySelector(".error-message"),
  email: inputs.email.closest(".form-input").querySelector(".error-message"),
  gender: signupForm
    .querySelector('.form-input input[name="gender"]')
    .closest(".form-input")
    .querySelector(".error-message"),
  password: inputs.password
    .closest(".form-input")
    .querySelector(".error-message"),
  confirmPassword: inputs.confirmPassword
    .closest(".form-input")
    .querySelector(".error-message"),
  formError: errorMessages[errorMessages.length - 1],
};

// Toggle Password Visibility
eyeIcons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    if (e.target.tagName === "I") {
      e.target.classList.toggle("fa-eye");
      e.target.classList.toggle("fa-eye-slash");
      const passwordInput = e.target
        .closest(".password-input")
        .querySelector("input");
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    }
  });
});

// Validation Functions
const validateName = (name) => /^[a-zA-Z]{3,20}$/.test(name);
const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validatePassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

// Clear Errors and Styles (updated for gender inputs)
const clearErrors = () => {
  Object.values(errors).forEach((error) => {
    error.classList.remove("show");
    error.textContent = ""; // Clear any previous error messages
  });

  Object.values(inputs).forEach((input) => {
    if (input instanceof NodeList) {
      input.forEach((inp) => {
        inp.classList.remove("error");
        inp.removeAttribute("aria-invalid");
        inp.closest("label").classList.remove("error");
      });
    } else {
      input.classList.remove("error");
      input.removeAttribute("aria-invalid");
    }
  });
};
// Form Submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear previous errors
  Object.values(errors).forEach((error) => error.classList.remove("show"));
  // Object.values(inputs).forEach((input) => input.classList.remove("error"));
  Object.values(inputs).forEach((input) => {
    if (input instanceof NodeList) {
      input.forEach((inp) => inp.classList.remove("error"));
    } else {
      input.classList.remove("error");
    }
  });

  const selectedGender = Array.from(inputs.gender).find(
    (radio) => radio.checked
  )?.value;

  // Validate inputs
  const validationResults = {
    fName: validateName(inputs.fName.value),
    lName: validateName(inputs.lName.value),
    email: validateEmail(inputs.email.value),
    gender: !!selectedGender,
    password: validatePassword(inputs.password.value),
    confirmPassword: inputs.password.value === inputs.confirmPassword.value,
  };

  // Display validation errors
  Object.keys(validationResults).forEach((key) => {
    if (!validationResults[key]) {
      errors[key].classList.add("show");
      if (key === "gender") {
        inputs.gender.forEach((radio) =>
          radio.closest("label").classList.add("error")
        );
      } else {
        inputs[key].classList.add("error");
      }
    }
  });

  // Proceed if all validations pass
  if (Object.values(validationResults).every(Boolean)) {
    try {
      const users = await fetchUsers();
      const isExistingUser = users.some(
        (user) => user.email === inputs.email.value
      );

      if (isExistingUser) {
        errors.formError.textContent =
          "This Email already exists. Please try logging in.";
        errors.formError.classList.add("show");
      } else {
        const newUser = {
          id: users.length + 1,
          fname: inputs.fName.value,
          lname: inputs.lName.value,
          gender: selectedGender,
          email: inputs.email.value,
          password: inputs.password.value,
          exams: [
            { examId: 101, status: "pending", score: null },
            { examId: 102, status: "pending", score: null },
            { examId: 201, status: "pending", score: null },
          ],
        };
        setTimeout(async () => {
          await createUser(newUser);
          loader.classList.remove("hidden");
          page.classList.add("hidden");
          goToLogin();
        }, 500);
        localStorage.setItem(
          "user",
          JSON.stringify({
            firstName: inputs.fName.value,
            lastName: inputs.lName.value,
            id: newUser.id,
            gender: selectedGender,
          })
        );
      }
    } catch (error) {
      console.error("Error during sign-up process:", error);
      errors.formError.textContent =
        "An error occurred. Please try again later.";
    } finally {
      loader.classList.add("hidden");
      page.classList.remove("hidden");
    }
  }
});
