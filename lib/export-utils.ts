// Utility functions for exporting data to CSV and PDF

export function exportToCSV(data: any[], filename: string, columns?: { key: string; title: string }[]) {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }

    // Get headers
    let headers: string[];
    if (columns) {
        headers = columns.map(col => col.title);
    } else {
        headers = Object.keys(data[0]);
    }

    // Convert data to CSV format
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
        const values = columns
            ? columns.map(col => {
                const value = row[col.key];
                // Handle complex values
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return JSON.stringify(value);
                // Escape quotes and wrap in quotes if contains comma
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            })
            : Object.values(row).map(val => {
                if (val === null || val === undefined) return '';
                if (typeof val === 'object') return JSON.stringify(val);
                const stringValue = String(val);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            });

        csvRows.push(values.join(','));
    }

    // Create blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToPDF(
    data: any[],
    filename: string,
    title: string,
    columns?: { key: string; title: string }[],
    chartData?: { title: string; type: string; items: { label: string; value: number; color?: string }[] }[]
) {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Get headers
    let headers: string[];
    if (columns) {
        headers = columns.map(col => col.title);
    } else {
        headers = Object.keys(data[0]);
    }

    // Build chart visualizations HTML if provided
    let chartsHtml = '';
    if (chartData && chartData.length > 0) {
        chartsHtml = '<div class="charts-section">\n<h2><span class="icon">📊</span> Visual Analytics</h2>\n<div class="charts-grid">';

        for (const chart of chartData) {
            const total = chart.items.reduce((sum, item) => sum + item.value, 0);

            chartsHtml += '<div class="chart-card">\n<h3>' + chart.title + '</h3>\n';

            if (chart.type === 'bar') {
                // Bar chart visualization
                const maxValue = Math.max(...chart.items.map(item => item.value));
                chartsHtml += '<div class="bar-chart">';
                for (const item of chart.items) {
                    const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    chartsHtml += '<div class="bar-item">\n';
                    chartsHtml += '<div class="bar-label">' + item.label + '</div>\n';
                    chartsHtml += '<div class="bar-container">\n';
                    chartsHtml += '<div class="bar-fill" style="width:' + percentage + '%;background:' + (item.color || '#16332B') + '"></div>\n';
                    chartsHtml += '</div>\n';
                    chartsHtml += '<div class="bar-value">' + item.value + '</div>\n';
                    chartsHtml += '</div>';
                }
                chartsHtml += '</div>';
            } else if (chart.type === 'pie' || chart.type === 'donut') {
                // Pie/Donut chart as legend list
                chartsHtml += '<div class="pie-legend">';
                for (const item of chart.items) {
                    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                    chartsHtml += '<div class="legend-item">\n';
                    chartsHtml += '<span class="legend-color" style="background:' + (item.color || '#16332B') + '"></span>\n';
                    chartsHtml += '<span class="legend-label">' + item.label + '</span>\n';
                    chartsHtml += '<span class="legend-value">' + item.value + ' (' + percentage + '%)</span>\n';
                    chartsHtml += '</div>';
                }
                chartsHtml += '</div>';
            } else {
                // Simple list for other types
                chartsHtml += '<div class="chart-list">';
                for (const item of chart.items) {
                    chartsHtml += '<div class="list-item">\n';
                    chartsHtml += '<span class="list-label">' + item.label + '</span>\n';
                    chartsHtml += '<span class="list-value">' + item.value + '</span>\n';
                    chartsHtml += '</div>';
                }
                chartsHtml += '</div>';
            }

            chartsHtml += '</div>';
        }

        chartsHtml += '</div>\n</div>';
    }

    // Build HTML table rows
    let tableRows = '';
    for (const row of data) {
        const values = columns
            ? columns.map(col => {
                const value = row[col.key];
                if (value === null || value === undefined) return '';
                if (typeof value === 'boolean') return value ? 'Yes' : 'No';
                if (typeof value === 'object') return JSON.stringify(value);
                return String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            })
            : Object.values(row).map(val => {
                if (val === null || val === undefined) return '';
                if (typeof val === 'boolean') return val ? 'Yes' : 'No';
                if (typeof val === 'object') return JSON.stringify(val);
                return String(val).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            });

        tableRows += '<tr>' + values.map(val => '<td>' + val + '</td>').join('') + '</tr>\n';
    }

    // Create professional HTML for PDF
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            background: #fff;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px;
        }
        
        .header {
            background: linear-gradient(135deg, #16332B 0%, #1F483D 50%, #16332B 100%);
            color: white;
            padding: 40px;
            margin: -40px -40px 40px -40px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(22, 51, 43, 0.15);
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }
        
        .header .subtitle {
            font-size: 14px;
            opacity: 0.9;
            letter-spacing: 0.5px;
        }
        
        .metadata {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: #F7F9F8;
            border-left: 4px solid #2FD9C4;
            border-radius: 4px;
            margin-bottom: 40px;
            font-size: 13px;
            color: #6B6E6C;
        }
        
        .metadata .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .metadata .icon {
            font-size: 16px;
        }
        
        .charts-section {
            margin-bottom: 50px;
        }
        
        .charts-section h2 {
            font-size: 24px;
            color: #16332B;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px solid #2FD9C4;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .charts-section h2 .icon {
            font-size: 28px;
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 25px;
        }
        
        .chart-card {
            background: white;
            border: 2px solid #E3ECE8;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            page-break-inside: avoid;
        }
        
        .chart-card h3 {
            font-size: 18px;
            color: #16332B;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        /* Bar Chart Styles */
        .bar-chart {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .bar-item {
            display: grid;
            grid-template-columns: 140px 1fr 60px;
            align-items: center;
            gap: 12px;
        }
        
        .bar-label {
            font-size: 13px;
            font-weight: 500;
            color: #16332B;
        }
        
        .bar-container {
            height: 28px;
            background: #F0F4F3;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .bar-fill {
            height: 100%;
            border-radius: 6px;
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8px;
        }
        
        .bar-value {
            font-size: 14px;
            font-weight: 600;
            color: #16332B;
            text-align: right;
        }
        
        /* Pie/Donut Legend Styles */
        .pie-legend {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px;
            background: #F7F9F8;
            border-radius: 6px;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            flex-shrink: 0;
        }
        
        .legend-label {
            flex: 1;
            font-size: 13px;
            font-weight: 500;
            color: #16332B;
        }
        
        .legend-value {
            font-size: 14px;
            font-weight: 600;
            color: #16332B;
        }
        
        /* List Styles */
        .chart-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .list-item {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            background: #F7F9F8;
            border-radius: 6px;
        }
        
        .list-label {
            font-size: 13px;
            font-weight: 500;
            color: #16332B;
        }
        
        .list-value {
            font-size: 14px;
            font-weight: 600;
            color: #16332B;
        }
        
        /* Data Table Section */
        .data-section {
            margin-top: 50px;
        }
        
        .data-section h2 {
            font-size: 24px;
            color: #16332B;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 3px solid #2FD9C4;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        
        thead {
            background: #16332B;
            color: white;
        }
        
        th {
            padding: 16px 14px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #2FD9C4;
        }
        
        td {
            padding: 14px;
            font-size: 13px;
            border-bottom: 1px solid #E3ECE8;
            color: #333;
        }
        
        tbody tr:nth-child(even) {
            background: #F7F9F8;
        }
        
        tbody tr:hover {
            background: #E8F4F0;
        }
        
        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #E3ECE8;
            text-align: center;
            color: #9BB0AB;
            font-size: 12px;
        }
        
        .footer .company {
            font-weight: 600;
            color: #16332B;
            margin-bottom: 5px;
        }
        
        .footer .confidential {
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 10px;
        }
        
        @media print {
            body { background: white; }
            .container { padding: 20px; }
            .header { margin: -20px -20px 30px -20px; }
            .chart-card, .table-wrapper { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <div class="subtitle">Help Desk Management System</div>
        </div>
        
        <div class="metadata">
            <div class="meta-item">
                <span class="icon">📅</span>
                <span><strong>Date:</strong> ${currentDate}</span>
            </div>
            <div class="meta-item">
                <span class="icon">🕐</span>
                <span><strong>Time:</strong> ${currentTime}</span>
            </div>
            <div class="meta-item">
                <span class="icon">📄</span>
                <span><strong>Records:</strong> ${data.length}</span>
            </div>
        </div>
        
        ${chartsHtml}
        
        <div class="data-section">
            <h2><span class="icon">📋</span> Detailed Data</h2>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>${headers.map(h => '<th>' + h + '</th>').join('')}</tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="footer">
            <div class="company">Help Desk Management System</div>
            <div class="confidential">Confidential Report • For Internal Use Only</div>
        </div>
    </div>
</body>
</html>`;

    // Create blob and download as HTML
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename + '.html');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
