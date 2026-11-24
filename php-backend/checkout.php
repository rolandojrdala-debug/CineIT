<?php

declare(strict_types=1);

require_once __DIR__ . '/catalog.php';

date_default_timezone_set('Asia/Manila');

header('Content-Type: application/json; charset=utf-8');

// Allow requests from the local frontend.
$allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

function respond(int $status, array $data): void
{
    http_response_code($status);

    echo json_encode($data, JSON_UNESCAPED_UNICODE);

    exit;
}

// Handle browser preflight requests.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only accept POST requests.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, [
        'success' => false,
        'message' => 'Only POST requests are allowed.'
    ]);
}

// Read JSON data from JavaScript.
$raw = file_get_contents('php://input', false, null, 0, 20001);

if ($raw === false || strlen($raw) > 20000) {
    respond(413, [
        'success' => false,
        'message' => 'Request is too large.'
    ]);
}

$data = json_decode($raw, true);

if (!is_array($data)) {
    respond(400, [
        'success' => false,
        'message' => 'Invalid booking data.'
    ]);
}

// =====================================
// BOOKING INFORMATION
// =====================================

$movieTitle = $data['movieTitle'] ?? '';
$cinema = $data['cinema'] ?? '';
$format = $data['format'] ?? '';
$date = $data['date'] ?? '';
$time = $data['time'] ?? '';
$seats = $data['seats'] ?? [];
$snacks = $data['snacks'] ?? [];

$customerName = $data['customerName'] ?? '';
$customerEmail = $data['customerEmail'] ?? '';
$paymentMethod = $data['paymentMethod'] ?? '';

foreach ([
    $movieTitle, $cinema, $format, $date, $time,
    $customerName, $customerEmail, $paymentMethod
] as $value) {
    if (!is_string($value)) {
        respond(400, [
            'success' => false,
            'message' => 'Invalid booking information.'
        ]);
    }
}

$movieTitle = trim($movieTitle);
$customerName = trim($customerName);
$customerEmail = trim($customerEmail);

// =====================================
// VALIDATE MOVIE AND CINEMA
// =====================================

if ($movieTitle === '' || mb_strlen($movieTitle) > 200) {
    respond(400, [
        'success' => false,
        'message' => 'Invalid movie title.'
    ]);
}

if (!in_array($cinema, CINEMAS, true)) {
    respond(400, [
        'success' => false,
        'message' => 'Invalid cinema branch.'
    ]);
}

if (!array_key_exists($format, TICKET_PRICES)) {
    respond(400, [
        'success' => false,
        'message' => 'Invalid cinema format.'
    ]);
}

// =====================================
// VALIDATE DATE AND SHOWTIME
// =====================================

$screeningDate = DateTimeImmutable::createFromFormat(
    '!Y-m-d',
    $date
);

if (
    !$screeningDate ||
    $screeningDate->format('Y-m-d') !== $date ||
    $screeningDate < new DateTimeImmutable('today')
) {
    respond(400, [
        'success' => false,
        'message' => 'Please select a valid screening date.'
    ]);
}

if (!in_array($time, SHOWTIMES, true)) {
    respond(400, [
        'success' => false,
        'message' => 'Invalid showtime.'
    ]);
}

// =====================================
// VALIDATE SEATS
// =====================================

if (!is_array($seats) || count($seats) === 0) {
    respond(400, [
        'success' => false,
        'message' => 'Please select at least one seat.'
    ]);
}

$validatedSeats = [];

foreach ($seats as $seat) {

    if (!is_string($seat) || !preg_match('/^[A-E][1-8]$/D', $seat)) {
        respond(400, [
            'success' => false,
            'message' => 'Invalid seat selection.'
        ]);
    }

    if (in_array($seat, OCCUPIED_SEATS, true)) {
        respond(409, [
            'success' => false,
            'message' => "Seat $seat is already occupied in the demo."
        ]);
    }

    if (in_array($seat, $validatedSeats, true)) {
        respond(400, [
            'success' => false,
            'message' => 'Duplicate seat selection.'
        ]);
    }

    $validatedSeats[] = $seat;
}

// =====================================
// CALCULATE TICKET PRICE
// =====================================

$ticketUnitPrice = TICKET_PRICES[$format];

$ticketSubtotal =
    count($validatedSeats) * $ticketUnitPrice;

// =====================================
// VALIDATE AND CALCULATE SNACKS
// =====================================

$validatedSnacks = [];
$snacksSubtotal = 0;
$selectedSnackIds = [];

if (!is_array($snacks)) {
    respond(400, [
        'success' => false,
        'message' => 'Invalid snack selection.'
    ]);
}

foreach ($snacks as $snack) {

    if (!is_array($snack)) {
        respond(400, [
            'success' => false,
            'message' => 'Invalid snack information.'
        ]);
    }

    $id = $snack['id'] ?? '';
    $quantity = $snack['qty'] ?? 0;

    if (!is_string($id) || !isset(SNACK_MENU[$id])) {
        respond(400, [
            'success' => false,
            'message' => 'Invalid snack item.'
        ]);
    }

    if (!is_int($quantity) || $quantity < 1 || $quantity > 10) {
        respond(400, [
            'success' => false,
            'message' => 'Invalid snack quantity.'
        ]);
    }

    if (in_array($id, $selectedSnackIds, true)) {
        respond(400, [
            'success' => false,
            'message' => 'Duplicate snack item.'
        ]);
    }

    $selectedSnackIds[] = $id;

    $price = SNACK_MENU[$id]['price'];

    $subtotal = $price * $quantity;

    $validatedSnacks[] = [
        'id' => $id,
        'name' => SNACK_MENU[$id]['name'],
        'price' => $price,
        'qty' => $quantity,
        'subtotal' => $subtotal
    ];

    $snacksSubtotal += $subtotal;
}

// =====================================
// VALIDATE CUSTOMER INFORMATION
// =====================================

if (
    mb_strlen($customerName) < 2 ||
    mb_strlen($customerName) > 100
) {
    respond(400, [
        'success' => false,
        'message' => 'Please enter a valid full name.'
    ]);
}

if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
    respond(400, [
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
}

// =====================================
// VALIDATE PAYMENT METHOD
// =====================================

$paymentMethods = [
    'GCash / Maya',
    'Credit / Debit Card',
    'Cinema Counter'
];

if (!in_array($paymentMethod, $paymentMethods, true)) {
    respond(400, [
        'success' => false,
        'message' => 'Invalid payment method.'
    ]);
}

// No actual payment gateway is connected.
$paymentStatus = $paymentMethod === 'Cinema Counter'
    ? 'DEMO - PAY AT COUNTER'
    : 'SIMULATED - NOT PAID';

// =====================================
// CALCULATE FINAL TOTAL
// =====================================

$bookingFee = BOOKING_FEE;

$grandTotal =
    $ticketSubtotal +
    $snacksSubtotal +
    $bookingFee;

// =====================================
// GENERATE BOOKING REFERENCE
// =====================================

$bookingRef =
    'CIT-' .
    date('Y') .
    '-' .
    strtoupper(bin2hex(random_bytes(8)));

// =====================================
// RETURN VALIDATED BOOKING
// =====================================

respond(200, [
    'success' => true,
    'message' => 'Demo checkout validated successfully.',
    'ticket' => [
        'bookingRef' => $bookingRef,
        'movieTitle' => $movieTitle,
        'cinema' => $cinema,
        'format' => $format,
        'date' => $date,
        'time' => $time,
        'seats' => $validatedSeats,
        'ticketUnitPrice' => $ticketUnitPrice,
        'ticketSubtotal' => $ticketSubtotal,
        'snacks' => $validatedSnacks,
        'snacksSubtotal' => $snacksSubtotal,
        'customerName' => $customerName,
        'customerEmail' => $customerEmail,
        'paymentMethod' => $paymentMethod,
        'paymentStatus' => $paymentStatus,
        'bookingFee' => $bookingFee,
        'grandTotal' => $grandTotal,
        'issuedAt' => date('Y-m-d H:i:s')
    ]
]);
