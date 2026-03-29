document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const btn = document.getElementById("loginBtn");

    // Clear previous messages
    const globalMsg = document.getElementById("globalMsg");
    globalMsg.className = "";
    globalMsg.textContent = "";

    let hasError = false;

    if (!username) {
        document.getElementById("username").classList.add("error-field");
        hasError = true;
    }

    if (!password) {
        document.getElementById("password").classList.add("error-field");
        hasError = true;
    }

    if (hasError) {
        globalMsg.textContent = "⚠️ Please fill all fields";
        globalMsg.className = "error";
        return;
    }

    // Loading UI
    btn.classList.add("loading");
    btn.disabled = true;

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            globalMsg.textContent = "❌ Invalid Credentials";
            globalMsg.className = "error";
            return;
        }

        const data = await response.json();

        if (data && data.id) {
            localStorage.setItem("student", JSON.stringify(data));

            globalMsg.textContent = "✅ Login Successful!";
            globalMsg.className = "success";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);
        } else {
            globalMsg.textContent = "❌ Invalid response from server";
            globalMsg.className = "error";
        }

    } catch (error) {
        console.error(error);
        globalMsg.textContent = "🔌 Server error. Try again.";
        globalMsg.className = "error";
    } finally {
        btn.classList.remove("loading");
        btn.disabled = false;
    }
});