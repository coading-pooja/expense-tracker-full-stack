const signUp = document.getElementById("signUp");
const signIn = document.getElementById("signIn");
const container = document.getElementById("container");
const signUpBtn = document.getElementById("signUpBtn");
const loginBtn = document.getElementById("loginBtn");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

signUp.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signIn.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

async function signup() {
  try {
    const signupDetails = {
      signupName: signupName.value,
      signupEmail: signupEmail.value,
      signupPassword: signupPassword.value,
    
    };
    console.log(signupDetails)
    

    const response = await axios.post("http://localhost:3000/signup", signupDetails);
    alert("sign up successful");
    // window.location.href = "/homePage";
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      alert(errorMessage);
    } else {
      alert("An error occurred. Please try again later.");
    }
  }
}

async function login() {
  try {
    const loginDetails = {
      loginEmail: loginEmail.value,
      loginPassword: loginPassword.value,
    };
    console.log(loginDetails)


    const response = await axios.post("http://localhost:3000/login", loginDetails);
   alert("login successful");
    window.location.href = "./expense.html";
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      alert(errorMessage);
    } else {
      alert("An error occurred. Please try again later.");
    }
  }
}

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  login(); // Add event listener for login button click within the function
});

signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signup(); // Add event listener for signup button click within the function
});
