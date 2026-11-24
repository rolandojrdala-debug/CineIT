<?php

declare(strict_types=1);

const BOOKING_FEE = 25;

const TICKET_PRICES = [
    '2D Standard' => 320,
    'IMAX Laser' => 520,
    "Director's Club" => 650,
    '4DX Atmos' => 580
];

const SNACK_MENU = [
    'combo-duo' => [
        'name' => 'CineIT Blockbuster Duo',
        'price' => 395
    ],
    'combo-solo' => [
        'name' => 'Solo Feature Combo',
        'price' => 230
    ],
    'pop-caramel' => [
        'name' => 'Large Gourmet Caramel Popcorn',
        'price' => 185
    ],
    'pop-cheese' => [
        'name' => 'Large White Cheddar Popcorn',
        'price' => 175
    ],
    'bite-nachos' => [
        'name' => 'Loaded Jalapeño Nachos',
        'price' => 190
    ],
    'bite-hotdog' => [
        'name' => 'Jumbo Cinema Beef Frank',
        'price' => 165
    ],
    'drink-soda' => [
        'name' => 'Large Iced Cola / Lemon-Lime',
        'price' => 95
    ],
    'drink-water' => [
        'name' => 'Bottled Mineral Water (500ml)',
        'price' => 55
    ]
];

const CINEMAS = [
    'SM Mall of Asia',
    'SM Megamall',
    'SM North EDSA',
    'Greenbelt 3',
    'Glorietta 4',
    'Trinoma'
];

const SHOWTIMES = [
    '11:30 AM',
    '2:15 PM',
    '5:00 PM',
    '8:45 PM',
    '10:30 PM'
];

const OCCUPIED_SEATS = [
    'A4',
    'A5',
    'B3',
    'C6',
    'C7',
    'D2',
    'D4',
    'E5'
];