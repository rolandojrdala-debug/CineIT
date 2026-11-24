
"use strict";

const EMAILJS_CONFIG = {
    serviceId: "service_b8p5m6g",
    templateId: "template_0y0p4ui",
    publicKey: "mncxx0B1kHA5NYBaB"
};

async function sendTicketEmail(ticket) {
    if (!window.emailjs) {
        throw new Error("EmailJS failed to load.");
    }

    if (!ticket || ticket.demo !== true) {
        throw new Error("No valid demo ticket found.");
    }

    if (!ticket.customerEmail) {
        throw new Error("Customer email is missing.");
    }

    const formatPHP = (amount) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP"
        }).format(Number(amount));

    const snacksSummary =
        Array.isArray(ticket.snacks) && ticket.snacks.length
            ? ticket.snacks.map(
                item => `${item.qty}x ${item.name}`
            ).join(", ")
            : "No snack add-ons";

    const templateParams = {
        to_name: ticket.customerName,
        to_email: ticket.customerEmail,
        booking_ref: ticket.bookingRef,
        movie_title: ticket.movieTitle,
        cinema_name: ticket.cinema,
        cinema_format: ticket.format,
        show_datetime: `${ticket.date} at ${ticket.time}`,
        seats: ticket.seats.join(", "),
        snacks_summary: snacksSummary,
        payment_method: ticket.paymentMethod,
        calculated_total: formatPHP(ticket.grandTotal)
    };

    return await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        {
            publicKey: EMAILJS_CONFIG.publicKey,
            blockHeadless: true,
            limitRate: {
                id: "cineit-ticket-email",
                throttle: 30000
            }
        }
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const emailBtn = document.getElementById("email-ticket-btn");
    const emailStatus = document.getElementById("email-status");

    if (!emailBtn || !emailStatus) return;

    emailBtn.addEventListener("click", async () => {
        emailBtn.disabled = true;
        emailBtn.textContent = "Sending Ticket...";

        emailStatus.textContent = "";
        emailStatus.style.color = "var(--muted)";

        try {
            const ticket = JSON.parse(
                sessionStorage.getItem("cineit_ticket") || "null"
            );

            if (!ticket || ticket.demo !== true) {
                throw new Error("No valid demo ticket found.");
            }

            const confirmed = window.confirm(
                `Send your demo ticket to ${ticket.customerEmail}?`
            );

            if (!confirmed) {
                emailBtn.disabled = false;
                emailBtn.textContent = "Email Ticket";
                return;
            }

            await sendTicketEmail(ticket);

            ticket.emailStatus = "sent";

            sessionStorage.setItem(
                "cineit_ticket",
                JSON.stringify(ticket)
            );

            emailStatus.textContent =
                `Email request accepted for ${ticket.customerEmail}. Check your inbox or spam folder.`;

            emailStatus.style.color = "var(--green)";
            emailBtn.textContent = "Email Sent";

            const deliveryNotice = document.getElementById(
                "ticket-delivery-notice"
            );

            if (deliveryNotice) {
                deliveryNotice.textContent =
                    "Demo ticket email requested. No actual payment or reservation was completed.";
            }

        } catch (error) {
            console.error("EmailJS error:", error);

            emailStatus.textContent =
                "Unable to send your ticket. " +
                (error.text || error.message || "Please try again.");

            emailStatus.style.color = "#f87171";

            emailBtn.disabled = false;
            emailBtn.textContent = "Email Ticket";
        }
    });
});
