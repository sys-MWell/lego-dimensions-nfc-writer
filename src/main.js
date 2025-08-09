document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("toyTagForm");
    const nfcUidInput = document.getElementById("nfcUid");
    const characterSelect = document.getElementById("characterSelect");
    const outputDiv = document.getElementById("output");

    // Update character/vehicle options dynamically from server
    fetch("/data")
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                // Display the full JSON response for specific uid and cvid
                outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            } else {
                // Populate characters and vehicles for dropdown
                const { characters, vehicles } = data;

                // Populate characters
                for (const character of characters) {
                    const option = document.createElement("option");
                    option.value = character.id;
                    option.textContent = character.name;
                    characterSelect.appendChild(option);
                }

                // Populate vehicles
                for (const vehicle of vehicles) {
                    const option = document.createElement("option");
                    option.value = vehicle.id;
                    option.textContent = vehicle.name;
                    characterSelect.appendChild(option);
                }
            }
        })
        .catch(err => console.error("Error loading data from server:", err));

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nfcUid = nfcUidInput.value.trim();
        const selectedCharacterId = characterSelect.value;

        if (!nfcUid || !selectedCharacterId) {
            outputDiv.innerHTML = `<div class="alert alert-danger">Please provide both NFC UID and select a character/vehicle.</div>`;
            return;
        }

        // Call backend logic to generate NFC lines
        fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ uid: nfcUid, id: selectedCharacterId })
        })
        .then(response => response.json())
        .then(data => {
            outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(err => {
            console.error("Error generating NFC lines:", err);
            outputDiv.innerHTML = `<div class="alert alert-danger">An error occurred while generating NFC lines.</div>`;
        });
    });
});
