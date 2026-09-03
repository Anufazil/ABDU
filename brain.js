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
   ABDU 1.5.2
   TARGETED SEARCH URLS
   ========================================================== */

const SEARCH_ENGINES = {

    google: query =>
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,

    youtube: query =>
        `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,

    github: query =>
        `https://github.com/search?q=${encodeURIComponent(query)}`,

    reddit: query =>
        `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,

    amazon: query =>
        `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,

    wikipedia: query =>
        `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,

    spotify: query =>
        `https://open.spotify.com/search/${encodeURIComponent(query)}`
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
            executeSearch(
                intent.target,
                intent.query
            );
            break;

        case "conversation":
            askAI(intent.query);
            break;

        default:
            log("Unknown intent.", "error");

    }
}


/* ==========================================================
   ABDU 1.5.1
   IMPROVED INTENT DETECTION
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
       SEARCH SPECIFIC WEBSITE
       ------------------------- */

    const siteSearchMatch = text.match(
        /^(search|find|look up)\s+(youtube|google|github|reddit|amazon|wikipedia|spotify)\s+(?:for\s+)?(.+)$/i
    );

    if (siteSearchMatch) {

        return {
            type: "search",
            target: siteSearchMatch[2].toLowerCase(),
            query: siteSearchMatch[3].trim()
        };

    }


    /* -------------------------
       GOOGLE SEARCH
       ------------------------- */

    const googleSearchMatch = text.match(
        /^(search(?:\s+google)?|google|look up|find)(?:\s+for)?\s+(.+)$/i
    );

    if (googleSearchMatch) {

        return {
            type: "search",
            target: "google",
            query: googleSearchMatch[2].trim()
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
   TARGETED SEARCH
   ========================================================== */

function executeSearch(target, query) {

    if (!query) {
        return;
    }

    const searchTarget =
        target?.toLowerCase() || "google";

    const searchBuilder =
        SEARCH_ENGINES[searchTarget];

    if (!searchBuilder) {

        log(
            `Unknown search target: ${searchTarget}`,
            "error"
        );

        executeGoogleSearch(query);

        return;
    }

    const url =
        searchBuilder(query);

    setState(
        ABDU_STATES.EXECUTING
    );

    const targetName =
        searchTarget.charAt(0).toUpperCase() +
        searchTarget.slice(1);

    const response =
        `Searching ${targetName} for "${query}"...`;

    setResponse(
        response
    );

    log(
        `Searching ${targetName} for "${query}"`,
        "action"
    );

    const newWindow =
        window.open(
            url,
            "_blank"
        );

    if (!newWindow) {

        log(
            "Browser blocked the search tab.",
            "error"
        );

        setResponse(
            "The browser blocked the new tab. Please allow popups for ABDU."
        );

        return;
    }

    const message =
        `Searching ${targetName} for "${query}".`;

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
        "You are currently assisting Anu Fazil. " +
        "Your assistant name is ABDU. " +
        "You are a helpful, intelligent, concise AI assistant. " +
        "Answer naturally and clearly. " +
        "Use the user's name naturally when appropriate. " +
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