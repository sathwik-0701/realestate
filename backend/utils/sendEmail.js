const sendEmail = async (option) => {
    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
        if(!BREVO_API_KEY) {
            console.error("Missing BREVO_API_KEY in the .env file");
            throw new Error("Missing Email Api key");
        }
        const data = {
            sender: {
                name: "Real Estate Platform",
                email: process.env.EMAIL_USER
            },
            to: [{ email: option.email }],        
            subject: option.subject,               
            htmlContent: option.message           
        };

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if(response.ok) {
            console.log("Email sent successfully via Brevo:", result.messageId);
        } else {
            console.error("Brevo API Error:", result);
            throw new Error(result.message || "Could not send email via Brevo"); // ✅ Error not error
        }

    } catch(error) {
        console.error("Brevo Email Error:", err.message); // ✅ was result (not defined here)
        throw new Error("Could not send email via Brevo");  // ✅ Error not error
    }
};

export default sendEmail;