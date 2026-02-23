function login() {
  const username = document.getElementById("username").value.trim().toUpperCase();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (!username.startsWith("INTO")) {
    error.innerText = "Username non valido";
    return;
  }

  const number = username.replace("INTO", "");

  if (number >= 1 && number <= 10 && password === number) {
    localStorage.setItem("store", username);
    window.location.href = "index.html";
  } else {
    error.innerText = "Credenziali errate";
  }
}
