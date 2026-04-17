const form = document.getElementById("guestbook-form");
const entriesContainer = document.getElementById("entries");
const statusText = document.getElementById("status");
const submitButton = form.querySelector("button");

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

function renderEntries(entries) {
  if (entries.length === 0) {
    entriesContainer.innerHTML =
      '<p class="empty-state">No entries yet. Be the first to sign the guestbook.</p>';
    return;
  }

  entriesContainer.innerHTML = entries
    .map((entry) => {
      return `
        <article class="entry">
          <div class="entry-header">
            <span class="entry-name">${escapeHtml(entry.name)}</span>
            <span class="entry-time">${formatDate(entry.created_at)}</span>
          </div>
          <p class="entry-message">${escapeHtml(entry.message)}</p>
        </article>
      `;
    })
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function loadEntries() {
  statusText.textContent = "Loading entries...";

  try {
    const response = await fetch("/api/entries");

    if (!response.ok) {
      throw new Error("Could not load entries.");
    }

    const entries = await response.json();
    renderEntries(entries);
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = error.message;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const message = formData.get("message").trim();

  submitButton.disabled = true;
  statusText.textContent = "Saving entry...";

  try {
    const response = await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not save entry.");
    }

    form.reset();
    statusText.textContent = "Entry saved.";
    await loadEntries();
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

loadEntries();
