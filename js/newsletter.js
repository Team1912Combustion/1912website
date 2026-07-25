document.addEventListener("DOMContentLoaded", () => {

    const newsletterForm = document.getElementById("newsletterForm");

    if (!newsletterForm) return;

    const submitButton = document.getElementById("subscribeBtn");
    const successMessage = document.getElementById("newsletterSuccess");
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const honeypot = document.getElementById("website");

    // Prevent bots from submitting instantly
    const pageLoadTime = Date.now();

    // Common email typos
    const commonTypos = {
        "gmial.com": "gmail.com",
        "gmal.com": "gmail.com",
        "gmai.com": "gmail.com",
        "hotmial.com": "hotmail.com",
        "outlok.com": "outlook.com",
        "yaho.com": "yahoo.com"
    };

    newsletterForm.addEventListener("submit", function (e) {

        e.preventDefault();

        // Honeypot check
        if (honeypot.value.trim() !== "") {
            console.warn("Bot detected (honeypot).");
            return;
        }

        // Time check (3 seconds minimum)
        if (Date.now() - pageLoadTime < 3000) {
            alert("Please wait a few seconds before submitting.");
            return;
        }

        // Email validation
        const email = emailInput.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        // Common typo detection
        const parts = email.split("@");

        if (parts.length === 2) {

            const domain = parts[1].toLowerCase();

            if (commonTypos[domain]) {

                const corrected =
                    parts[0] + "@" + commonTypos[domain];

                const useCorrection = confirm(
                    `Did you mean\n\n${corrected} ?`
                );

                if (useCorrection) {
                    emailInput.value = corrected;
                } else {
                    emailInput.focus();
                    return;
                }
            }
        }

        // Disable button
        submitButton.disabled = true;
        submitButton.textContent = "SUBSCRIBING...";
        submitButton.style.opacity = "0.7";
        submitButton.style.cursor = "not-allowed";

        // Submit form
        newsletterForm.submit();

        setTimeout(() => {

            newsletterForm.reset();

            successMessage.style.display = "block";

            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            submitButton.disabled = false;
            submitButton.textContent = "SUBSCRIBE";
            submitButton.style.opacity = "1";
            submitButton.style.cursor = "pointer";

        }, 1000);

    });

});