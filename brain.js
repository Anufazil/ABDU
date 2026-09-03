/* ==========================================================
   ABDU 1.3
   CONVERSATIONAL BRAIN + BROWSER ROUTER
   ========================================================== */


const BROWSER_SITES = {

    youtube: "https://www.youtube.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
    x: "https://x.com",
    reddit: "https://www.reddit.com",
    gmail: "https://mail.google.com",
    google: "https://www.google.com",
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    linkedin: "https://www.linkedin.com",
    netflix: "https://www.netflix.com",
    spotify: "https://open.spotify.com",
    amazon: "https://www.amazon.com",
    wikipedia: "https://www.wikipedia.org",
    maps: "https://maps.google.com"

};


/* ==========================================================
   MAIN ROUTER
   ========================================================== */

function processUserInput(input) {

    if (!input || !input.trim()) {
        return;
    }

    const intent = detectIntent(input);

    log(`Intent detected: ${intent.type}`, "action");


    switch (intent.type) {

        case "greeting":
            respondGreeting();
            break;

        case "open":
            executeOpenSite(intent.site);
            break;

        case "search":
            executeGoogleSearch(intent.query);
            break;

        case "conversation":
            askAI(intent.query);
            break;

        default:
            log("Unknown intent.", "error");

    }
}


/* ==========================================================
   INTENT DETECTION
   ========================================================== */

function detectIntent(input) {

    const text = input.trim();


    /* -------------------------
       GREETING
       ------------------------- */

    if (
        /^(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(text)
    ) {

        return {
            type: "greeting"
        };

    }


    /* -------------------------
       OPEN WEBSITE
       ------------------------- */

    const openMatch = text.match(
        /^(open|launch|visit|go to|take me to)\s+(.+)$/i
    );


    if (openMatch) {

        return {

            type: "open",

            site: openMatch[2].trim()

        };

    }


    /* -------------------------
       SEARCH
       ------------------------- */

    const searchMatch = text.match(
        /^(search(?:\s+google)?|google|look up|find)(?:\s+for)?\s+(.+)$/i
    );


    if (searchMatch) {

        return {

            type: "search",

            query: searchMatch[2].trim()

        };

    }


    /* -------------------------
       CONVERSATION
       ------------------------- */

    return {

        type: "conversation",

        query: text

    };

}


/* ==========================================================
   OPEN WEBSITE
   ========================================================== */

function executeOpenSite(siteName) {

    const site = siteName.toLowerCase().trim();

    let url = null;
    let displayName = siteName;


    /* Exact match */

    if (BROWSER_SITES[site]) {

        url = BROWSER_SITES[site];

    }


    /* Partial match */

    if (!url) {

        for (const name in BROWSER_SITES) {

            if (
                site.includes(name) ||
                name.includes(site)
            ) {

                url = BROWSER_SITES[name];

                displayName = name;

                break;

            }

        }

    }


    /* Unknown website → Google search */

    if (!url) {

        url =
            `https://www.google.com/search?q=${encodeURIComponent(siteName)}`;

    }


    setState(
        ABDU_STATES.EXECUTING
    );


    setResponse(
        `Opening ${displayName}...`
    );


    log(
        `Opening ${displayName}`,
        "action"
    );


    addMessage(
        "assistant",
        `Opening ${displayName}.`
    );


    conversation.push({

        role: "assistant",

        content: `Opening ${displayName}.`

    });


    speak(
        `Opening ${displayName}.`
    );


    const newWindow = window.open(
        url,
        "_blank"
    );


    if (!newWindow) {

        log(
            "Browser blocked the new tab.",
            "error"
        );


        setResponse(
            "The browser blocked the new tab. Please allow popups for ABDU."
        );


        return;

    }

}


/* ==========================================================
   GOOGLE SEARCH
   ========================================================== */

function executeGoogleSearch(query) {

    if (!query) {
        return;
    }


    setState(
        ABDU_STATES.EXECUTING
    );


    setResponse(
        `Searching Google for "${query}"...`
    );


    log(
        `Searching Google for "${query}"`,
        "action"
    );


    const url =
        `https://www.google.com/search?q=${encodeURIComponent(query)}`;


    const newWindow = window.open(
        url,
        "_blank"
    );


    if (!newWindow) {

        log(
            "Browser blocked the Google search tab.",
            "error"
        );


        setResponse(
            "The browser blocked the new tab. Please allow popups for ABDU."
        );


        return;

    }


    const message =
        `Searching Google for "${query}".`;


    addMessage(
        "assistant",
        message
    );


    conversation.push({

        role: "assistant",

        content: message

    });


    speak(
        message
    );

}


/* ==========================================================
   GREETING
   ========================================================== */

function respondGreeting() {

    const responses = [

        "Hello. I'm ABDU. How can I help you?",

        "Hello. What can I do for you?",

        "Hey. I'm listening.",

        "Hi. How can I help?"

    ];


    const response =
        responses[
            Math.floor(
                Math.random() * responses.length
            )
        ];


    setResponse(
        response
    );


    addMessage(
        "assistant",
        response
    );


    conversation.push({

        role: "assistant",

        content: response

    });


    speak(
        response
    );

}


/* ==========================================================
   ABDU 1.4
   REAL LOCAL AI BRAIN
   ========================================================== */
const ABDU_SYSTEM_PROMPT = {
    role: "system",
    content:
        "You are ABDU, Artificial Brain for Digital Understanding. " +
        "You are created by Anu Fazil. " +
        "You are a helpful, intelligent, concise AI assistant. " +
        "Answer naturally and clearly. " +
        "Do not claim to have abilities you do not have."
};

async function askAI(message) {

    if (!message || !message.trim()) {
        return;
    }

    log(
        `AI request: "${message}"`,
        "action"
    );

    setState(
        ABDU_STATES.THINKING
    );

    setResponse(
        "Thinking..."
    );


    try {

        const response = await fetch(
            "http://localhost:11434/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "qwen3:1.7b",

                    messages: [
                        ABDU_SYSTEM_PROMPT,
                        ...conversation,
                        {
                            role: "user",
                            content: message
                        }
                    ],

                    stream: false

                })
            }
        );


        if (!response.ok) {

            throw new Error(
                `Ollama HTTP ${response.status}`
            );

        }


        const data = await response.json();


        const answer =
            data?.message?.content?.trim();


        if (!answer) {

            throw new Error(
                "Ollama returned an empty response."
            );

        }


        setResponse(
            answer
        );


        addMessage(
            "assistant",
            answer
        );


        conversation.push({
            role: "user",
            content: message
        });

        conversation.push({
            role: "assistant",
            content: answer
        });

        saveMemory();


        log(
            "AI response received.",
            "action"
        );


        speak(
            answer
        );


    } catch (error) {

        console.error(
            "ABDU AI Error:",
            error
        );


        setState(
            ABDU_STATES.ERROR
        );


        const errorMessage =
            "I couldn't connect to my local AI brain. Please make sure Ollama is running.";


        setResponse(
            errorMessage
        );


        addMessage(
            "assistant",
            errorMessage
        );


        log(
            `AI connection error: ${error.message}`,
            "error"
        );


        speak(
            errorMessage
        );

    }

}