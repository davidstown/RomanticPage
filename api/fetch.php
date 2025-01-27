<?php
header('Content-Type: application/json');

// Validar URL
$url = filter_input(INPUT_GET, 'url', FILTER_VALIDATE_URL);
if (!$url) {
    http_response_code(400);
    echo json_encode(['error' => 'URL inválida']);
    exit;
}

// Configurar cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'ChiwasTownNews/1.0');
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Realizar petición
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Verificar respuesta
if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Error al obtener el contenido']);
    exit;
}

echo json_encode(['html' => $response]);
?>