<?php
require __DIR__ . '/vendor/autoload.php';

$sheet_id = $_POST['sheet_id'];
$reports = json_decode($_POST['data'], true);

$client = new Google_Client();
$client->setAuthConfig('credentials.json');
$client->setScopes([Google_Service_Sheets::SPREADSHEETS]);

$service = new Google_Service_Sheets($client);

$body = new Google_Service_Sheets_ValueRange([
    'values' => array_map(function($date, $data) {
        return [$date, json_encode($data)];
    }, array_keys($reports), array_values($reports))
]);

try {
    $service->spreadsheets_values->clear(
        $sheet_id,
        'Reports!A2:B',
        new Google_Service_Sheets_ClearValuesRequest()
    );
    
    $result = $service->spreadsheets_values->update(
        $sheet_id,
        'Reports!A2:B',
        $body,
        ['valueInputOption' => 'RAW']
    );
    
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} 