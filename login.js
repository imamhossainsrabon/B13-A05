document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    if (username == "admin" && password == "admin123") {
        alert('Login SuccessFull')
        window.location.replace("/B13-A05/homepage.html")
    } else {
        alert('Wrong Password')
    }
})