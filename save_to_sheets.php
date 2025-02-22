<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require __DIR__ . '/vendor/autoload.php';

$sheet_id = '1L7HIdiPbORqZ143SIYb4SiAXT0OdS8T-4DuhFVv9nIE';  // Hardcode ID
$reports = json_decode($_POST['data'], true);

$client = new Google_Client();
$client->setAuthConfig(__DIR__ . '/credentials.json');
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