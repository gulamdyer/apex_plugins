// Sales KPI Dashboard - Main Application

class Dashboard {
    constructor() {
        this.data = null;
        this.charts = {};
        this.init();
    }

    init() {
        // Check authentication
        this.checkAuth();

        // Load data
        this.loadData();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize UI
        this.initializeUI();
    }

    checkAuth() {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            window.location.href = 'login.html';
        }
    }

    loadData() {
        this.data = DataGenerator.getAllData();
        this.renderDashboard();
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'login.html';
        });

        // Menu toggle for mobile
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });

        // Period selector
        document.getElementById('periodSelector').addEventListener('change', (e) => {
            this.handlePeriodChange(e.target.value);
        });

        // Country filter
        document.getElementById('countryFilter').addEventListener('change', (e) => {
            this.filterSalespeopleByCountry(e.target.value);
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    initializeUI() {
        // Set current date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', options);

        // Set username
        const username = sessionStorage.getItem('username') || 'Admin';
        document.getElementById('userName').textContent = username;

        // Populate country filter
        const countries = ['all', ...new Set(this.data.salespeople.map(p => p.country))];
        const countryFilter = document.getElementById('countryFilter');
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country === 'all' ? 'All Countries' : country;
            countryFilter.appendChild(option);
        });
    }

    renderDashboard() {
        this.renderKPICards();
        this.renderMonthlySalesChart();
        this.renderStoreSalesChart();
        this.renderSalespersonChart();
        this.renderComparisonChart();
        this.renderConversionChart();
        this.renderProductsTable();
        this.renderPerformersTable();
        this.renderRevenueLoss();
    }

    renderKPICards() {
        const { summary } = this.data;

        // Total Sales
        document.getElementById('totalSales').textContent = this.formatCurrency(summary.totalSales.value);
        document.getElementById('totalSalesChange').textContent = `${summary.totalSales.change}% vs last month`;
        this.setChangeIndicator('totalSalesChange', summary.totalSales.change);

        // Total Orders
        document.getElementById('totalOrders').textContent = this.formatNumber(summary.totalOrders.value);
        document.getElementById('totalOrdersChange').textContent = `${summary.totalOrders.change}% vs last month`;
        this.setChangeIndicator('totalOrdersChange', summary.totalOrders.change);

        // Conversion Rate
        document.getElementById('conversionRate').textContent = `${summary.conversionRate.value}%`;
        document.getElementById('conversionRateChange').textContent = `${summary.conversionRate.change}% vs last month`;
        this.setChangeIndicator('conversionRateChange', summary.conversionRate.change);

        // Revenue Loss
        document.getElementById('revenueLoss').textContent = this.formatCurrency(summary.revenueLoss.value);
        document.getElementById('revenueLossChange').textContent = `${Math.abs(summary.revenueLoss.change)}% vs last month`;
        this.setChangeIndicator('revenueLossChange', summary.revenueLoss.change, true);
    }

    setChangeIndicator(elementId, value, reverse = false) {
        const element = document.getElementById(elementId).parentElement;
        element.classList.remove('positive', 'negative');

        const isPositive = reverse ? value < 0 : value > 0;
        element.classList.add(isPositive ? 'positive' : 'negative');

        if (!isPositive) {
            element.querySelector('svg').innerHTML = '<polyline points="6 9 12 15 18 9" stroke-width="2"/>';
        }
    }

    renderMonthlySalesChart() {
        const ctx = document.getElementById('monthlySalesChart');
        const { monthlySales } = this.data;

        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }

        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlySales.map(m => m.month),
                datasets: [
                    {
                        label: 'Sales',
                        data: monthlySales.map(m => m.sales),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 6,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Orders',
                        data: monthlySales.map(m => m.orders * 400),
                        borderColor: '#f093fb',
                        backgroundColor: 'rgba(240, 147, 251, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 6,
                        pointBackgroundColor: '#f093fb',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label === 'Sales') {
                                    label += ': ' + this.formatCurrency(context.parsed.y);
                                } else {
                                    label += ': ' + Math.round(context.parsed.y / 400);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            callback: (value) => Math.round(value / 400)
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderStoreSalesChart() {
        const ctx = document.getElementById('storeSalesChart');
        const stores = this.data.storeSales.slice(0, 10);

        if (this.charts.stores) {
            this.charts.stores.destroy();
        }

        this.charts.stores = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stores.map(s => s.name),
                datasets: [{
                    label: 'Sales',
                    data: stores.map(s => s.sales),
                    backgroundColor: stores.map((_, i) => {
                        const colors = [
                            'rgba(102, 126, 234, 0.8)',
                            'rgba(118, 75, 162, 0.8)',
                            'rgba(240, 147, 251, 0.8)',
                            'rgba(79, 172, 254, 0.8)',
                            'rgba(250, 112, 154, 0.8)'
                        ];
                        return colors[i % colors.length];
                    }),
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => 'Sales: ' + this.formatCurrency(context.parsed.y)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    renderSalespersonChart() {
        const ctx = document.getElementById('salespersonChart');
        const topSalespeople = this.data.salespeople.slice(0, 10);

        if (this.charts.salesperson) {
            this.charts.salesperson.destroy();
        }

        this.charts.salesperson = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topSalespeople.map(s => s.name),
                datasets: [{
                    label: 'Sales',
                    data: topSalespeople.map(s => s.sales),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => 'Sales: ' + this.formatCurrency(context.parsed.x)
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        const { comparison } = this.data;

        if (this.charts.comparison) {
            this.charts.comparison.destroy();
        }

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Total Sales', 'Orders', 'Avg Order Value'],
                datasets: [
                    {
                        label: 'Current Period',
                        data: [
                            comparison.current.total,
                            comparison.current.orders * 400,
                            comparison.current.avgOrder
                        ],
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderRadius: 8
                    },
                    {
                        label: 'Previous Period',
                        data: [
                            comparison.previous.total,
                            comparison.previous.orders * 400,
                            comparison.previous.avgOrder
                        ],
                        backgroundColor: 'rgba(156, 163, 175, 0.5)',
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                let value = context.parsed.y;
                                if (context.dataIndex === 1) {
                                    value = Math.round(value / 400);
                                    return context.dataset.label + ': ' + value;
                                }
                                return context.dataset.label + ': ' + this.formatCurrency(value);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderConversionChart() {
        const ctx = document.getElementById('conversionChart');
        const { conversion } = this.data;

        if (this.charts.conversion) {
            this.charts.conversion.destroy();
        }

        const stages = ['Leads', 'Qualified', 'Opportunities', 'Proposals', 'Orders'];
        const values = [
            conversion.leads,
            conversion.qualified,
            conversion.opportunities,
            conversion.proposals,
            conversion.orders
        ];

        this.charts.conversion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stages,
                datasets: [{
                    label: 'Count',
                    data: values,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.9)',
                        'rgba(102, 126, 234, 0.75)',
                        'rgba(102, 126, 234, 0.6)',
                        'rgba(102, 126, 234, 0.45)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                const percent = ((value / values[0]) * 100).toFixed(1);
                                return `Count: ${value} (${percent}% of leads)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        const products = this.data.products.slice(0, 10);

        tbody.innerHTML = products.map((product, index) => `
            <tr>
                <td><span class="rank-badge rank-${index < 3 ? index + 1 : 'other'}">${index + 1}</span></td>
                <td><strong>${product.name}</strong></td>
                <td>${this.formatNumber(product.units)}</td>
                <td>${this.formatCurrency(product.revenue)}</td>
                <td><span class="growth-${product.growth >= 0 ? 'positive' : 'negative'}">${product.growth > 0 ? '+' : ''}${product.growth}%</span></td>
            </tr>
        `).join('');
    }

    renderPerformersTable(country = 'all') {
        const tbody = document.getElementById('performersTableBody');
        let salespeople = this.data.salespeople;

        if (country !== 'all') {
            salespeople = salespeople.filter(p => p.country === country);
        }

        const topPerformers = salespeople.slice(0, 10);

        tbody.innerHTML = topPerformers.map((person, index) => `
            <tr>
                <td><span class="rank-badge rank-${index < 3 ? index + 1 : 'other'}">${index + 1}</span></td>
                <td><strong>${person.name}</strong></td>
                <td>${person.country}</td>
                <td>${person.store}</td>
                <td>${this.formatCurrency(person.sales)}</td>
            </tr>
        `).join('');
    }

    renderRevenueLoss() {
        const { revenueLoss } = this.data;

        document.getElementById('lostCancelled').textContent = this.formatCurrency(revenueLoss.cancelled.amount);
        document.getElementById('lostCancelledCount').textContent = `${revenueLoss.cancelled.count} orders`;

        document.getElementById('lostConversions').textContent = this.formatCurrency(revenueLoss.conversions.amount);
        document.getElementById('lostConversionsCount').textContent = `${revenueLoss.conversions.count} opportunities`;

        document.getElementById('lostReturns').textContent = this.formatCurrency(revenueLoss.returns.amount);
        document.getElementById('lostReturnsCount').textContent = `${revenueLoss.returns.count} returns`;

        document.getElementById('lostDiscounts').textContent = this.formatCurrency(revenueLoss.discounts.amount);
        document.getElementById('lostDiscountsCount').textContent = `${revenueLoss.discounts.count} discounts`;

        const lossSummary = document.getElementById('lossSummary');
        lossSummary.innerHTML = `<strong>Total Revenue Loss:</strong> ${this.formatCurrency(revenueLoss.total)}`;
    }

    filterSalespeopleByCountry(country) {
        this.renderPerformersTable(country);
    }

    handlePeriodChange(period) {
        // In a real application, this would fetch new data
        console.log('Period changed to:', period);
        this.loadData(); // Reload with new data
    }

    formatCurrency(value, short = false) {
        if (short && value >= 1000) {
            return '$' + (value / 1000).toFixed(0) + 'K';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value);
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
