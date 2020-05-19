chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'scan_now') {
        companies_mails.set(companies.APPLE, ["@apple.com", "@applemusic.com"]);
        companies_mails.set(companies.DESPEGAR, ["@despegar.com"]);
        companies_mails.set(companies.MERCADOLIBRE, ["@mercadolibre.com", "@r.mercadolibre.com"]);
        companies_mails.set(companies.NETFLIX, ["@mailer.netflix.com", "@netflix.com"]);
        companies_mails.set(companies.GOOGLE, ["@accounts.google.com"]);
        console.log("STARTED")
        mail_topic = document.querySelector('h2.hP'); //For Gmail
        if (mail_topic == null) { //So we're on Outlook
            console.log("Running Outlook")
            mail_topic = document.querySelector('.ITWTqi_23IoOPmK3O6ErT').innerText;
        } else {
            console.log("Running Gmail")
            mail_topic = mail_topic.innerText;
        }
        mail_mailer = document.querySelector('span.gD');
        mailer_name = null;
        mailer_address = null;
        if (mail_mailer == null) {
            mail_mailer = document.querySelector('.VHquDtYElxQkNvZKxCJct').innerText.split("<");
            mailer_address = mail_mailer[1].trim().replace(">", "");
            mailer_name = mail_mailer[0].trim();
        } else {
            mailer_address = mail_mailer.getAttribute('email');
            mailer_name = mail_mailer.innerText;
        }
        alerted = false;
        companies_mails.forEach((value, key) => {
            mail_t = mail_topic.trim().split(" ")
            for (i=0; i<mail_t.length;i++) {
                console.log(mail_topic+" and "+mail_t[i])
                if (levenshtein_distance(mail_t[i].toLowerCase(), key) < (mail_t[i].length * 0.16 < 1 ? 1 : mail_t[i].length * 0.16)) {
                    console.log("ENTERED for word " + mail_t[i] + " and company " + key);
                    alerted = validate_for(key, alerted, mailer_address);
                }
            }
            if (!alerted) {
                mailer_n = mailer_name.trim().split(" ")
                for (i=0;i<mailer_n.length;i++) {
                    if (levenshtein_distance(mailer_n[i].toLowerCase(), key) < (mailer_n[i].length * 0.16 < 1 ? 1 : mailer_n[i].length * 0.16)) {
                        console.log("ENTERED NAME for word " + mailer_n[i] + " and company " + key);
                        alerted = validate_for(key, alerted, mailer_address, true);
                    }
                }
            }
            if (!alerted) {
                // no pudimos hacer nada, sorry
                console.log("TERMINO SIN ENCONTRAR NADA")
            }
            console.log("Terminamos")
        });
    }
    sendResponse("");
});

var companies_mails = new Map();

const companies = {
    APPLE: "apple",
    DESPEGAR: "despegar",
    MERCADOLIBRE: "mercadolibre",
    NETFLIX: "netflix",
    SPOTIFY: "spotify",
    AMAZON: "amazon",
    MASTER: "mastercard",
    VISA: "visa",
    UBER: "uber",
    RAPPI: "rappi",
    PEDIDOSYA: "pedidosya",
    PREX: "prex",
    MERCADOPAGO: "mercadopago",
    BROU: "brou",
    EBROU: "ebrou",
    GOOGLE: "google"
};

function levenshtein_distance(a, b) {
    console.log(a)
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }
     console.log("Comparing "+a+" and "+b+" as a result: "+matrix[b.length][a.length])
    return matrix[b.length][a.length];
}

function validate_for(company, alerted, mailer_email, can_alert=false) {
    match = false;
    emails =  companies_mails.get(company);
    if (emails != undefined) {
        emails.forEach( email => {
            if (mailer_email.includes(email)) {
                match = true;
            }
        })
    }
    if (match) {
        send_popup('El mail '+mailer_email+' parece ser valido para la empresa '+company);
        return !alerted;
    } else {
        if (can_alert) {
            send_popup('WARNING, El mail '+mailer_email+' parece NO ser valido para la empresa '+company+', ten cuidado!');
        }
        return can_alert ? !alerted : alerted;
    }
}

function send_popup(message) {
    console.log("[ALERT] "+message);
    chrome.runtime.sendMessage('', {
    type: 'notification',
    options: {
      title: 'Fraudy',
      message: message,
      iconUrl: '/logo.png',
      type: 'basic'
    }
  });

}