let chart = null;

async function fetchData() {
    try {
        const response = await fetch('/api/readings');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateDashboard(data) {
    // Update chart
    const labels = data.map(d => new Date(d.timestamp).toLocaleTimeString());
    const values = data.map(d => parseFloat(d.value));

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('sensorChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sensor Reading',
                data: values,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Update statistics
    const stats = calculateStats(values);
    document.getElementById('statsContent').innerHTML = `
        <p><strong>Latest Reading:</strong> ${stats.latest}</p>
        <p><strong>Average:</strong> ${stats.average.toFixed(2)}</p>
        <p><strong>Maximum:</strong> ${stats.max}</p>
        <p><strong>Minimum:</strong> ${stats.min}</p>
        <p><strong>Total Readings:</strong> ${stats.count}</p>
    `;
}

function calculateStats(values) {
    if (values.length === 0) return {
        latest: 'No data',
        average: 0,
        max: 0,
        min: 0,
        count: 0
    };

    return {
        latest: values[values.length - 1],
        average: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        count: values.length
    };
}

// Update every 30 seconds
fetchData();
setInterval(fetchData, 30000);