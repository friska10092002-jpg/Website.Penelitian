/**
 * UIN PONOROGO Research - Kuesioner Penelitian
 * Charts JavaScript File
 * Uses Chart.js for data visualization
 */

// ========================================
// CHART CONFIGURATION
// ========================================

const CHART_COLORS = {
    adaptation: '#3498db',
    goal: '#e74c3c',
    integration: '#27ae60',
    latency: '#9b59b6',
    ya: '#27ae60',
    tidak: '#e74c3c',
    primary: '#1a365d',
    secondary: '#c9a227'
};

// Chart.js default configuration
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#4a5568';

// ========================================
// CHART INSTANCES
// ========================================

let mainChart = null;
let adaptationChart = null;
let goalChart = null;
let integrationChart = null;
let latencyChart = null;
let summaryChart = null;

// ========================================
// MAIN CHART - Bar Chart
// ========================================

function createMainChart(data) {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (mainChart) {
        mainChart.destroy();
    }
    
    const totalQuestions = data.totalResponden * 5;
    
    mainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Adaptation', 'Goal Attainment', 'Integration', 'Latency'],
            datasets: [
                {
                    label: 'Ya',
                    data: [
                        (data.dimensions.adaptation.ya / totalQuestions * 100).toFixed(1),
                        (data.dimensions.goal.ya / totalQuestions * 100).toFixed(1),
                        (data.dimensions.integration.ya / totalQuestions * 100).toFixed(1),
                        (data.dimensions.latency.ya / totalQuestions * 100).toFixed(1)
                    ],
                    backgroundColor: CHART_COLORS.ya,
                    borderColor: CHART_COLORS.ya,
                    borderWidth: 0,
                    borderRadius: 8,
                    barPercentage: 0.7
                },
                {
                    label: 'Tidak',
                    data: [
                        (data.dimensions.adaptation.tidak / totalQuestions * 100).toFixed(1),
                        (data.dimensions.goal.tidak / totalQuestions * 100).toFixed(1),
                        (data.dimensions.integration.tidak / totalQuestions * 100).toFixed(1),
                        (data.dimensions.latency.tidak / totalQuestions * 100).toFixed(1)
                    ],
                    backgroundColor: 'rgba(231, 76, 60, 0.7)',
                    borderColor: CHART_COLORS.tidak,
                    borderWidth: 0,
                    borderRadius: 8,
                    barPercentage: 0.7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 13,
                            weight: 500
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 54, 93, 0.9)',
                    padding: 15,
                    cornerRadius: 10,
                    titleFont: {
                        size: 14,
                        weight: 600
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 13,
                            weight: 500
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// ========================================
// DIMENSION CHARTS - Doughnut Charts
// ========================================

function createDimensionChart(canvasId, data, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    // Destroy existing chart
    const chartInstance = Chart.getChart(ctx);
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ya', 'Tidak'],
            datasets: [{
                data: [data.ya, data.tidak],
                backgroundColor: [color, 'rgba(0,0,0,0.08)'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 54, 93, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1200
            }
        }
    });
}

// ========================================
// SUMMARY CHART - Pie Chart
// ========================================

function createSummaryChart(data) {
    const ctx = document.getElementById('summaryChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (summaryChart) {
        summaryChart.destroy();
    }
    
    const totalYa = data.dimensions.adaptation.ya + 
                    data.dimensions.goal.ya + 
                    data.dimensions.integration.ya + 
                    data.dimensions.latency.ya;
    
    const totalTidak = data.dimensions.adaptation.tidak + 
                       data.dimensions.goal.tidak + 
                       data.dimensions.integration.tidak + 
                       data.dimensions.latency.tidak;
    
    summaryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Ya', 'Tidak'],
            datasets: [{
                data: [totalYa, totalTidak],
                backgroundColor: [CHART_COLORS.ya, CHART_COLORS.tidak],
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 500
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 54, 93, 0.9)',
                    padding: 15,
                    cornerRadius: 10,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed + ' jawaban (' + percentage + '%)';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500
            }
        }
    });
}

// ========================================
// UPDATE STATS DISPLAY
// ========================================

function updateStats(data) {
    const totalResponden = data.totalResponden;
    const totalQuestions = totalResponden * 5;
    
    // Update total responden
    const totalEl = document.getElementById('totalResponden');
    if (totalEl) {
        animateNumber(totalEl, 0, totalResponden, 1500);
    }
    
    // Calculate percentages for each dimension
    const adaptationPercent = ((data.dimensions.adaptation.ya / totalQuestions) * 100).toFixed(0);
    const goalPercent = ((data.dimensions.goal.ya / totalQuestions) * 100).toFixed(0);
    const integrationPercent = ((data.dimensions.integration.ya / totalQuestions) * 100).toFixed(0);
    const latencyPercent = ((data.dimensions.latency.ya / totalQuestions) * 100).toFixed(0);
    
    // Update stat cards
    const adaptationEl = document.getElementById('adaptationStat');
    const goalEl = document.getElementById('goalStat');
    const integrationEl = document.getElementById('integrationStat');
    const latencyEl = document.getElementById('latencyStat');
    
    if (adaptationEl) animateNumber(adaptationEl, 0, adaptationPercent, 1500, '%');
    if (goalEl) animateNumber(goalEl, 0, goalPercent, 1500, '%');
    if (integrationEl) animateNumber(integrationEl, 0, integrationPercent, 1500, '%');
    if (latencyEl) animateNumber(latencyEl, 0, latencyPercent, 1500, '%');
    
    // Update data table
    updateDataTable(data);
}

function updateDataTable(data) {
    const totalQuestions = data.totalResponden * 5;
    
    // Adaptation
    document.getElementById('adaptationYa').textContent = data.dimensions.adaptation.ya;
    document.getElementById('adaptationTidak').textContent = data.dimensions.adaptation.tidak;
    document.getElementById('adaptationPercent').textContent = 
        ((data.dimensions.adaptation.ya / totalQuestions) * 100).toFixed(1) + '%';
    
    // Goal Attainment
    document.getElementById('goalYa').textContent = data.dimensions.goal.ya;
    document.getElementById('goalTidak').textContent = data.dimensions.goal.tidak;
    document.getElementById('goalPercent').textContent = 
        ((data.dimensions.goal.ya / totalQuestions) * 100).toFixed(1) + '%';
    
    // Integration
    document.getElementById('integrationYa').textContent = data.dimensions.integration.ya;
    document.getElementById('integrationTidak').textContent = data.dimensions.integration.tidak;
    document.getElementById('integrationPercent').textContent = 
        ((data.dimensions.integration.ya / totalQuestions) * 100).toFixed(1) + '%';
    
    // Latency
    document.getElementById('latencyYa').textContent = data.dimensions.latency.ya;
    document.getElementById('latencyTidak').textContent = data.dimensions.latency.tidak;
    document.getElementById('latencyPercent').textContent = 
        ((data.dimensions.latency.ya / totalQuestions) * 100).toFixed(1) + '%';
    
    // Totals
    const totalYa = data.dimensions.adaptation.ya + data.dimensions.goal.ya + 
                    data.dimensions.integration.ya + data.dimensions.latency.ya;
    const totalTidak = data.dimensions.adaptation.tidak + data.dimensions.goal.tidak + 
                       data.dimensions.integration.tidak + data.dimensions.latency.tidak;
    
    document.getElementById('totalYa').textContent = totalYa;
    document.getElementById('totalTidak').textContent = totalTidak;
    document.getElementById('totalPercent').textContent = 
        ((totalYa / (totalYa + totalTidak)) * 100).toFixed(1) + '%';
}

// ========================================
// NUMBER ANIMATION
// ========================================

function animateNumber(element, start, end, duration, suffix = '') {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current) + suffix;
    }, 16);
}

// ========================================
// INITIALIZE ALL CHARTS
// ========================================

async function initializeCharts() {
    showLoading('Memuat data grafik...');
    
    try {
        // Fetch data
        const data = await (window.KuesionerApp?.fetchChartData?.() || getSampleData());
        
        // Update stats
        updateStats(data);
        
        // Create charts
        createMainChart(data);
        
        adaptationChart = createDimensionChart(
            'adaptationChart', 
            data.dimensions.adaptation, 
            CHART_COLORS.adaptation
        );
        
        goalChart = createDimensionChart(
            'goalChart', 
            data.dimensions.goal, 
            CHART_COLORS.goal
        );
        
        integrationChart = createDimensionChart(
            'integrationChart', 
            data.dimensions.integration, 
            CHART_COLORS.integration
        );
        
        latencyChart = createDimensionChart(
            'latencyChart', 
            data.dimensions.latency, 
            CHART_COLORS.latency
        );
        
        createSummaryChart(data);
        
    } catch (error) {
        console.error('Error initializing charts:', error);
        showToast('Gagal memuat data grafik', 'error');
    } finally {
        hideLoading();
    }
}

function getSampleData() {
    return {
        totalResponden: 45,
        dimensions: {
            adaptation: { ya: 185, tidak: 40 },
            goal: { ya: 175, tidak: 50 },
            integration: { ya: 195, tidak: 30 },
            latency: { ya: 188, tidak: 37 }
        }
    };
}

// ========================================
// REFRESH BUTTON
// ========================================

function initRefreshButton() {
    const btn = document.getElementById('btnRefresh');
    if (btn) {
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
            
            await initializeCharts();
            
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            showToast('Data berhasil diperbarui');
        });
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the charts page
    if (document.getElementById('mainChart')) {
        initializeCharts();
        initRefreshButton();
    }
});

// Export functions
window.ChartsApp = {
    initializeCharts,
    createMainChart,
    createDimensionChart,
    createSummaryChart,
    updateStats,
    CHART_COLORS
};
