#!/bin/bash
# Script to push Sales KPI Dashboard to sales-analytics repository

echo "========================================"
echo "Push to sales-analytics Repository"
echo "========================================"
echo ""

# Navigate to a temp directory
cd /tmp

# Clone the sales-analytics repository
echo "Cloning sales-analytics repository..."
git clone https://github.com/gulamdyer/sales-analytics.git
cd sales-analytics

# Copy the dashboard files
echo "Copying Sales KPI Dashboard files..."
cp -r /home/user/apex_plugins/sales_kpi_dashboard/* .

# Add all files
echo "Adding files to git..."
git add .

# Commit
echo "Committing changes..."
git commit -m "Add comprehensive Sales KPI Dashboard with enterprise-grade visualizations

Features:
- Static authentication system with login page
- Real-time KPI tracking (Total Sales, Orders, Conversion Rate, Revenue Loss)
- Interactive charts using Chart.js (monthly trends, store analysis, salesperson performance)
- Sales comparison (current vs previous period)
- Opportunity to order conversion funnel visualization
- Revenue loss analysis with detailed breakdowns
- Top trending products table with growth metrics
- Top performing salespeople by country/store
- Fully responsive design with mobile optimization
- Modern gradient UI with smooth animations
- Comprehensive mock data generator for realistic analytics

Tech Stack:
- HTML5, CSS3 (Grid/Flexbox)
- JavaScript ES6+
- Chart.js 4.4.0
- SVG icons

Demo Credentials:
- Username: admin
- Password: admin123"

# Push to main
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "========================================"
echo "Done! Check https://github.com/gulamdyer/sales-analytics"
echo "========================================"
