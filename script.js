let chart;

// Update slider values
function updateValue(id, value) {
  document.getElementById(id).innerText = value;
  calculate();
}

function calculate() {

  let transport = document.getElementById("transport").value;
  let distance = parseFloat(document.getElementById("distance").value) || 0;
  let electricity = parseFloat(document.getElementById("electricity").value) || 0;
  let diet = document.getElementById("diet").value;

  let transportCO2 = (transport === "car") ? distance * 0.2 : distance * 0.1;
  let electricityCO2 = electricity * 0.5;
  let dietCO2 = (diet === "veg") ? 2 : 5;

  let total = transportCO2 + electricityCO2 + dietCO2;

  let category = "";
  let color = "";

  if (total < 5) {
    category = "🌱 Low";
    color = "lightgreen";
  } else if (total < 10) {
    category = "⚠️ Medium";
    color = "orange";
  } else {
    category = "🔥 High";
    color = "red";
  }

  let resultBox = document.getElementById("result");
  resultBox.innerText = `Your footprint: ${total.toFixed(2)} kg CO₂/day (${category})`;
  resultBox.style.color = color;

  let suggestion = "";
  if (transport === "car") suggestion += "Use public transport. ";
  if (diet === "nonveg") suggestion += "Reduce meat consumption. ";
  if (electricity > 5) suggestion += "Save electricity. ";

  document.getElementById("suggestion").innerText = suggestion;

  // Chart
  let data = [transportCO2, electricityCO2, dietCO2];

  if (chart) chart.destroy();

  let ctx = document.getElementById("chart").getContext("2d");

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Transport", "Electricity", "Diet"],
      datasets: [{
        data: data,
        backgroundColor: [
          '#60a5fa',
          '#f97316',
          '#34d399'
        ],
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { color: '#e6eef8' } }
      }
    }
  });
}

// Auto update on change
// wire inputs (use input for ranges, change for selects)
document.querySelectorAll("input[type='range']").forEach(el => el.addEventListener('input', calculate));
document.querySelectorAll("select").forEach(el => el.addEventListener('change', calculate));

// initialize displayed values and chart once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const dist = document.getElementById('distance');
  const elec = document.getElementById('electricity');
  document.getElementById('distVal').innerText = dist.value;
  document.getElementById('elecVal').innerText = elec.value;
  calculate();
});