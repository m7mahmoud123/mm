const registerPage = document.getElementsByClassName("register")[0];
const registerButton = document.getElementById("register");
const registerButton2 = document.getElementById("register2");

registerButton.onclick = function () {
	registerPage.style.display = "flex";
};

registerButton2.onclick = function () {
	registerPage.style.display = "flex";
};

const close = document.getElementById("close");
close.onclick = function () {
	registerPage.style.display = "none";
};

const loginPage = document.getElementById("login");
const loginButton = document.getElementById("login-button");

loginButton.onclick = function () {
	loginPage.style.display = "flex";
};

const close2 = document.getElementById("close2");
close2.onclick = function () {
	loginPage.style.display = "none";
};

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const token = localStorage.getItem("token");
const success = document.getElementById("success");

loginBtn.onclick = function () {
	fetch("https://mm-5ijy.onrender.com/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`, // If authentication is needed
		},
		body: JSON.stringify({
			name: nameInput.value,
			email: emailInput.value,
			password: passwordInput.value,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data.message);
			success.innerText = data.message;
		})
		.catch((error) => console.error("Error:", error));
};

const name2 = document.getElementById("register-name");
const email2 = document.getElementById("register-email");
const password2 = document.getElementById("register-password");
const btn2 = document.getElementById("register-btn");

btn2.onclick = function () {
	fetch("https://mm-5ijy.onrender.com/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer your_token_here", // If authentication is needed
		},
		body: JSON.stringify({
			name: name2.value,
			email: email2.value,
			password: password2.value,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data.message);
			const message = document.getElementById("message");
			message.innerText = data.message;
			localStorage.setItem("token", data.token);
		})
		.catch((error) => console.error("Error:", error));
};
