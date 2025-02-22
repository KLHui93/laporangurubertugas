const GITHUB_TOKEN = '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';
const REPO_OWNER = 'KLHui93';
const REPO_NAME = 'laporangurubertugas';
const FILE_PATH = 'data/reports.json';

async function loadReportsFromGitHub() {
    try {
        console.log('Attempting to load from GitHub...');
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Load failed:', response.status, response.statusText);
            console.error('Error details:', errorText);
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('Successfully loaded data from GitHub');
        const content = atob(data.content);
        return JSON.parse(content);
    } catch (error) {
        console.error('Error loading from GitHub:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        return null;
    }
}

async function saveReportsToGitHub(reports) {
    try {
        console.log('Attempting to save to GitHub...');
        // Get current file to get SHA
        const currentFile = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        ).then(res => {
            if (!res.ok) {
                console.error('Error response:', res.status, res.statusText);
                return res.text().then(text => {
                    console.error('Error details:', text);
                    throw new Error('Failed to get file');
                });
            }
            console.log('Successfully got current file');
            return res.json();
        });

        console.log('Preparing to update file...');
        // Update file
        const response = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update reports data',
                    content: btoa(JSON.stringify(reports)),
                    sha: currentFile.sha
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update failed:', response.status, response.statusText);
            console.error('Error details:', errorText);
            throw new Error('Failed to save to GitHub');
        }
        console.log('Successfully updated file');
        return true;
    } catch (error) {
        console.error('Error saving to GitHub:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        return false;
    }
} 