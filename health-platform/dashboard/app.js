const API_URL = "http://localhost:5000/api/measurements";
const statusElement = document.querySelector("#status");
const recordsElement = document.querySelector("#records");

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function updateSummary(records) {
  const latest = records[0];
  document.querySelector("#heart").textContent = latest ? latest.heartRate : "—";
  document.querySelector("#spo2").textContent = latest ? latest.spo2 : "—";
  document.querySelector("#temp").textContent = latest ? Number(latest.temperatureC).toFixed(1) : "—";
}
function renderRecords(records) {
  updateSummary(records);
  if (!records.length) {
    recordsElement.innerHTML = '<tr><td colspan="6">No records yet. Add your first measurement above.</td></tr>';
    return;
  }
  recordsElement.innerHTML = records.map(record => `<tr>
    <td>${safe(new Date(record.recordedAt).toLocaleString())}</td>
    <td>${safe(record.heartRate)} bpm</td><td>${safe(record.spo2)}%</td>
    <td>${safe(Number(record.temperatureC).toFixed(1))} °C</td><td>${safe(record.source)}</td>
    <td><button class="delete" data-id="${safe(record._id)}" type="button">Delete</button></td></tr>`).join("");
}
async function loadRecords() {
  statusElement.textContent = "Loading records…";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    renderRecords(await response.json());
    statusElement.textContent = "";
  } catch (error) { statusElement.textContent = `${error.message}. Start MongoDB and the API, then refresh.`; }
}
document.querySelector("#measurement-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  statusElement.textContent = "Saving…";
  try {
    const response = await fetch(API_URL, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const result = await response.json();
    if (!response.ok) throw new Error(result.details?.join(", ") || result.error || "Unable to save");
    event.currentTarget.reset();
    await loadRecords();
  } catch (error) { statusElement.textContent = error.message; }
});
recordsElement.addEventListener("click", async event => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  if (!confirm("Delete this measurement?")) return;
  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(button.dataset.id)}`, {method:"DELETE"});
    if (!response.ok) throw new Error("Unable to delete measurement");
    await loadRecords();
  } catch (error) { statusElement.textContent = error.message; }
});
document.querySelector("#refresh").addEventListener("click", loadRecords);
loadRecords();