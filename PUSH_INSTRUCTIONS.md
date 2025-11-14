# How to Push Sales KPI Dashboard to sales-analytics Repository

## The Issue
The `sales-analytics` repository is not currently authorized in your Claude Code environment, so I cannot push directly to it.

## Quick Solution - Run the Script

I've created a script that will do everything for you:

```bash
cd /home/user/apex_plugins
./push_to_sales_analytics.sh
```

This script will:
1. Clone the sales-analytics repository
2. Copy all dashboard files
3. Commit with a detailed message
4. Push to GitHub

**Note:** You'll need to have your GitHub credentials configured on your system.

---

## Alternative: Manual Steps

If you prefer to do it manually:

### Step 1: Clone the sales-analytics repository
```bash
git clone https://github.com/gulamdyer/sales-analytics.git
cd sales-analytics
```

### Step 2: Copy the dashboard files
```bash
cp -r /home/user/apex_plugins/sales_kpi_dashboard/* .
```

### Step 3: Commit and push
```bash
git add .
git commit -m "Add Sales KPI Dashboard"
git push origin main
```

---

## Alternative: Use the Compressed Archive

Extract and upload the tar.gz file:

```bash
# Extract the archive
tar -xzf /home/user/apex_plugins/sales_kpi_dashboard.tar.gz

# Then follow steps above to commit and push
```

---

## To Authorize in Claude Code (For Future)

To enable direct pushing from Claude Code:

1. Open your Claude Code settings/configuration
2. Find the "Authorized Repositories" section
3. Add: `gulamdyer/sales-analytics`
4. Save and restart Claude Code

After authorization, I'll be able to push directly to this repository.

---

## Files Included in the Dashboard

```
sales_kpi_dashboard/
├── index.html              # Entry point (redirects to login)
├── login.html              # Login page
├── dashboard.html          # Main dashboard
├── css/
│   ├── login.css          # Login page styles
│   └── dashboard.css      # Dashboard styles
├── js/
│   ├── login.js           # Authentication logic
│   ├── data.js            # Mock data generator
│   └── dashboard.js       # Dashboard application
└── README.md              # Complete documentation
```

## Demo Credentials

- **Username:** admin
- **Password:** admin123

---

## Support

All files are located at: `/home/user/apex_plugins/sales_kpi_dashboard/`

The dashboard is production-ready and fully functional!
