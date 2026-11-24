"use strict";

const CINEIT_PHP_API = "http://localhost:8000";

async function submitPHPCheckout(booking, customer) {
    const payload = {
        movieTitle: booking.movieTitle,
        cinema: booking.cinema,
        format: booking.format,
        date: booking.date,
        time: booking.time,
        seats: booking.seats,
        snacks: (booking.snacks || []).map(item => ({
            id: item.id,
            qty: item.qty
        })),
        customerName: customer.name,
        customerEmail: customer.email,
        paymentMethod: customer.paymentMethod
    };

    const response = await fetch(
        `${CINEIT_PHP_API}/checkout.php`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Checkout validation failed."
        );
    }

    return {
        moviePoster: booking.moviePoster,
        movieInfo: booking.movieInfo,
        ...result.ticket
    };
}