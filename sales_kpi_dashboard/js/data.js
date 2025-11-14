// Comprehensive Mock Data Generator for Sales KPI Dashboard

const DataGenerator = {
    // Configuration
    config: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        countries: ['USA', 'UK', 'Germany', 'France', 'Japan', 'Canada', 'Australia'],
        stores: [
            { name: 'New York Flagship', country: 'USA' },
            { name: 'Los Angeles Store', country: 'USA' },
            { name: 'London Store', country: 'UK' },
            { name: 'Manchester Store', country: 'UK' },
            { name: 'Berlin Store', country: 'Germany' },
            { name: 'Munich Store', country: 'Germany' },
            { name: 'Paris Store', country: 'France' },
            { name: 'Tokyo Store', country: 'Japan' },
            { name: 'Toronto Store', country: 'Canada' },
            { name: 'Sydney Store', country: 'Australia' }
        ],
        salespeople: [
            { name: 'John Smith', country: 'USA', store: 'New York Flagship' },
            { name: 'Sarah Johnson', country: 'USA', store: 'New York Flagship' },
            { name: 'Michael Brown', country: 'USA', store: 'Los Angeles Store' },
            { name: 'Emily Davis', country: 'USA', store: 'Los Angeles Store' },
            { name: 'James Wilson', country: 'UK', store: 'London Store' },
            { name: 'Emma Taylor', country: 'UK', store: 'London Store' },
            { name: 'Oliver Moore', country: 'UK', store: 'Manchester Store' },
            { name: 'Sophie Anderson', country: 'UK', store: 'Manchester Store' },
            { name: 'Hans Mueller', country: 'Germany', store: 'Berlin Store' },
            { name: 'Anna Schmidt', country: 'Germany', store: 'Berlin Store' },
            { name: 'Klaus Weber', country: 'Germany', store: 'Munich Store' },
            { name: 'Maria Fischer', country: 'Germany', store: 'Munich Store' },
            { name: 'Pierre Dubois', country: 'France', store: 'Paris Store' },
            { name: 'Marie Martin', country: 'France', store: 'Paris Store' },
            { name: 'Takeshi Tanaka', country: 'Japan', store: 'Tokyo Store' },
            { name: 'Yuki Yamamoto', country: 'Japan', store: 'Tokyo Store' },
            { name: 'David Lee', country: 'Canada', store: 'Toronto Store' },
            { name: 'Lisa Chen', country: 'Canada', store: 'Toronto Store' },
            { name: 'Jack Williams', country: 'Australia', store: 'Sydney Store' },
            { name: 'Emma Thompson', country: 'Australia', store: 'Sydney Store' }
        ],
        products: [
            'Premium Laptop Pro',
            'Wireless Headphones Elite',
            'Smart Watch Ultra',
            '4K Monitor XL',
            'Mechanical Keyboard RGB',
            'Gaming Mouse Pro',
            'USB-C Hub Deluxe',
            'Webcam HD Pro',
            'Portable SSD 2TB',
            'Bluetooth Speaker Premium',
            'Tablet Pro 12"',
            'Wireless Charger Fast',
            'Phone Case Luxury',
            'Screen Protector Pro',
            'Cable Set Premium'
        ]
    },

    // Utility functions
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat(min, max, decimals = 2) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
    },

    // Generate monthly sales data
    generateMonthlySales(monthsBack = 12) {
        const data = [];
        const currentMonth = new Date().getMonth();
        const baseValue = 500000;

        for (let i = monthsBack - 1; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const trend = (monthsBack - i) / monthsBack; // Upward trend
            const seasonality = Math.sin((monthIndex / 12) * Math.PI * 2) * 0.2; // Seasonal variation
            const variance = this.randomFloat(-0.1, 0.1);

            const value = baseValue * (1 + trend * 0.3 + seasonality + variance);

            data.push({
                month: this.config.months[monthIndex],
                sales: Math.round(value),
                orders: this.random(800, 1200),
                customers: this.random(600, 900)
            });
        }

        return data;
    },

    // Generate store-wise sales
    generateStoreSales() {
        return this.config.stores.map(store => ({
            name: store.name,
            country: store.country,
            sales: this.random(30000, 150000),
            orders: this.random(50, 300),
            growth: this.randomFloat(-15, 35, 1)
        })).sort((a, b) => b.sales - a.sales);
    },

    // Generate salesperson performance data
    generateSalespersonData() {
        return this.config.salespeople.map(person => ({
            name: person.name,
            country: person.country,
            store: person.store,
            sales: this.random(20000, 120000),
            orders: this.random(30, 180),
            conversionRate: this.randomFloat(15, 45, 1),
            growth: this.randomFloat(-20, 50, 1)
        })).sort((a, b) => b.sales - a.sales);
    },

    // Generate product sales data
    generateProductData() {
        return this.config.products.map(product => ({
            name: product,
            sales: this.random(5000, 50000),
            units: this.random(50, 500),
            revenue: this.random(100000, 800000),
            growth: this.randomFloat(-10, 80, 1),
            trend: this.randomFloat(0, 100, 1)
        })).sort((a, b) => b.revenue - a.revenue);
    },

    // Generate conversion funnel data
    generateConversionData() {
        const leads = this.random(5000, 8000);
        const qualified = Math.round(leads * this.randomFloat(0.6, 0.7));
        const opportunities = Math.round(qualified * this.randomFloat(0.5, 0.6));
        const proposals = Math.round(opportunities * this.randomFloat(0.6, 0.7));
        const orders = Math.round(proposals * this.randomFloat(0.4, 0.6));

        return {
            leads,
            qualified,
            opportunities,
            proposals,
            orders,
            conversionRate: ((orders / leads) * 100).toFixed(1)
        };
    },

    // Generate revenue loss data
    generateRevenueLoss() {
        const cancelledOrders = this.random(80, 150);
        const failedConversions = this.random(200, 400);
        const returns = this.random(50, 100);
        const discounts = this.random(300, 500);

        return {
            cancelled: {
                amount: this.random(150000, 300000),
                count: cancelledOrders
            },
            conversions: {
                amount: this.random(400000, 800000),
                count: failedConversions
            },
            returns: {
                amount: this.random(80000, 150000),
                count: returns
            },
            discounts: {
                amount: this.random(200000, 400000),
                count: discounts
            },
            get total() {
                return this.cancelled.amount + this.conversions.amount +
                       this.returns.amount + this.discounts.amount;
            }
        };
    },

    // Generate comparison data (current vs previous period)
    generateComparisonData() {
        const current = {
            total: this.random(800000, 1200000),
            orders: this.random(1500, 2500),
            avgOrder: 0
        };
        current.avgOrder = Math.round(current.total / current.orders);

        const changePercent = this.randomFloat(5, 25, 1);
        const previous = {
            total: Math.round(current.total / (1 + changePercent / 100)),
            orders: Math.round(current.orders / (1 + changePercent / 100)),
            avgOrder: 0
        };
        previous.avgOrder = Math.round(previous.total / previous.orders);

        return {
            current,
            previous,
            change: {
                total: changePercent,
                orders: this.randomFloat(3, 20, 1),
                avgOrder: this.randomFloat(2, 15, 1)
            }
        };
    },

    // Generate summary KPIs
    generateSummaryKPIs() {
        const monthlySales = this.generateMonthlySales(12);
        const currentMonthSales = monthlySales[monthlySales.length - 1].sales;
        const previousMonthSales = monthlySales[monthlySales.length - 2].sales;
        const salesGrowth = ((currentMonthSales - previousMonthSales) / previousMonthSales * 100).toFixed(1);

        const currentOrders = monthlySales[monthlySales.length - 1].orders;
        const previousOrders = monthlySales[monthlySales.length - 2].orders;
        const ordersGrowth = ((currentOrders - previousOrders) / previousOrders * 100).toFixed(1);

        const conversionData = this.generateConversionData();
        const previousConversionRate = this.randomFloat(18, 25, 1);
        const conversionGrowth = ((conversionData.conversionRate - previousConversionRate) / previousConversionRate * 100).toFixed(1);

        const revenueLoss = this.generateRevenueLoss();
        const previousLoss = this.random(900000, 1200000);
        const lossChange = ((revenueLoss.total - previousLoss) / previousLoss * 100).toFixed(1);

        return {
            totalSales: {
                value: currentMonthSales,
                change: salesGrowth
            },
            totalOrders: {
                value: currentOrders,
                change: ordersGrowth
            },
            conversionRate: {
                value: conversionData.conversionRate,
                change: conversionGrowth
            },
            revenueLoss: {
                value: revenueLoss.total,
                change: lossChange
            }
        };
    },

    // Get all dashboard data
    getAllData() {
        return {
            summary: this.generateSummaryKPIs(),
            monthlySales: this.generateMonthlySales(12),
            storeSales: this.generateStoreSales(),
            salespeople: this.generateSalespersonData(),
            products: this.generateProductData(),
            conversion: this.generateConversionData(),
            comparison: this.generateComparisonData(),
            revenueLoss: this.generateRevenueLoss()
        };
    }
};

// Make data generator globally available
window.DataGenerator = DataGenerator;
