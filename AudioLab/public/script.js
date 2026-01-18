document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-message").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    sendMessage();
  }
});

function sendMessage() {
  const userMessage = document.getElementById("user-message").value;

  if (userMessage.trim() !== "") {
    displayUserMessage(userMessage);
    document.getElementById("user-message").value = ""; // Clear input field

    // Send user message to server for processing by ML model
    fetch('http://127.0.0.1:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {displayBotMessage(data.reply);}) // Display bot's response
    .catch(err => console.error("Error sending message:", err));
  }
}

function displayUserMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("user-message");
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function displayBotMessage(message) {
  console.log("📢 Displaying Bot Message:", message);
  const chatBox = document.getElementById("chat-box");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("bot-message");
  messageDiv.innerHTML = message;  // ✅ Use innerHTML to render structured HTML from backend
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}
