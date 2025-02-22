const SHEET_ID = '1L7HIdiPbORqZ143SIYb4SiAXT0OdS8T-4DuhFVv9nIE';  // ID dari URL Google Sheet anda
const SHEET_NAME = 'Reports';
const SHEET_RANGE = 'A:B';

async function loadReportsFromSheets() {
    try {
        const response = await fetch(
            `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}&range=${SHEET_RANGE}`
        );
        
        const text = await response.text();
        const data = JSON.parse(text.substr(47).slice(0, -2));
        
        const reports = {};
        data.table.rows.forEach(row => {
            if (row.c[0] && row.c[1]) {
                const date = row.c[0].v;
                const reportData = JSON.parse(row.c[1].v);
                reports[date] = reportData;
            }
        });
        
        return reports;
    } catch (error) {
        console.error('Error loading from Sheets:', error);
        return null;
    }
}

async function saveReportsToSheets(reports) {
    try {
        console.log('Saving reports:', reports);
        const formData = new FormData();
        formData.append('data', JSON.stringify(reports));
        formData.append('sheet_id', SHEET_ID);
        
        const response = await fetch('save_to_sheets.php', {
            method: 'POST',
            body: formData
        });
        
        const responseText = await response.text();
        console.log('PHP Response:', responseText);
        
        if (!response.ok) throw new Error(`Failed to save to Sheets: ${responseText}`);
        return true;
    } catch (error) {
        console.error('Error saving to Sheets:', error);
        return false;
    }
} 