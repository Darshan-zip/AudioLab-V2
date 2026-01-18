// Define the backend URL
let backendUrl = "http://127.0.0.1:8000"; // Ensure FastAPI is running at this address

document.getElementById("uploadBtn").addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent page refresh

    let fileInput = document.getElementById("fileInput");
    let resultDiv = document.getElementById("result");
    let downloadLink = document.getElementById("downloadLink");
    let audioPlayer = document.getElementById("audioPlayer");

    if (!fileInput.files.length) {
        alert("Please select a file!");
        return;
    }

    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("file", file);

    try {
        console.log("Uploading file...");
        let response = await fetch(`${backendUrl}/remove_vocals/`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        let data = await response.json();
        console.log("Server Response:", data); // Debugging output

        if (data.instrumental_url) {
            let instrumentalUrl = `${backendUrl}${data.instrumental_url}`;

            downloadLink.href = instrumentalUrl;
            downloadLink.innerText = "Download Instrumental";
            resultDiv.classList.remove("hidden");

            audioPlayer.src = instrumentalUrl;
            audioPlayer.classList.remove("hidden");
            audioPlayer.load();
        } else {
            alert("Error processing file: " + (data.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to server. Check console for details.");
    }
});
