// Main Application JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize chart if element exists
    const chartCanvas = document.getElementById('downtimeChart');
    if (chartCanvas) {
        initializeDowntimeChart();
    }

    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});

function initializeDowntimeChart() {
    const ctx = document.getElementById('downtimeChart').getContext('2d');
    let downtimeChart;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    const createOrUpdateChart = (hourlyRevenue) => {
        const labels = ['1 Hour', '4 Hours', '8 Hours (1 Shift)', '24 Hours (1 Day)'];
        const data = [
            hourlyRevenue,
            hourlyRevenue * 4,
            hourlyRevenue * 8,
            hourlyRevenue * 24
        ];

        if (downtimeChart) {
            downtimeChart.data.datasets[0].data = data;
            downtimeChart.update();
        } else {
            downtimeChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cost of Downtime',
                        data: data,
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(239, 68, 68, 0.6)',
                            'rgba(185, 28, 28, 0.6)'
                        ],
                        borderColor: [
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(239, 68, 68, 1)',
                            'rgba(185, 28, 28, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => formatCurrency(value),
                                color: '#6b7280'
                            },
                            grid: {
                                color: 'rgba(200, 200, 200, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6b7280'
                            },
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    const revenueInput = document.getElementById('hourlyRevenue');
    if (revenueInput) {
        revenueInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) {
                createOrUpdateChart(value);
            }
        });

        // Initial chart creation
        createOrUpdateChart(parseInt(revenueInput.value, 10));
    }
}
