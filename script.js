/* ==========================================================
   ABDU 1.1
   Artificial Brain for Digital Understanding

   Interface Controller
   ========================================================== */


/* ==========================================================
   DOM
   ========================================================== */

const body = document.body;

const statusText = document.getElementById("statusText");
const stateIndicator = document.getElementById("stateIndicator");

const characterStatus =
    document.getElementById("characterStatus");

const responseText =
    document.getElementById("responseText");

const micBtn =
    document.getElementById("micBtn");

const micLabel =
    document.getElementById("micLabel");

const textForm =
    document.getElementById("textForm");

const textInput =
    document.getElementById("textInput");

const messages =
    document.getElementById("messages");

const logList =
    document.getElementById("logList");

const activityStatus =
    document.getElementById("activityStatus");

const clearConversation =
    document.getElementById("clearConversation");

const sysClock =
    document.getElementById("sysClock");

const particles =
    document.getElementById("particles");


/* ==========================================================
   ABDU STATE
   ========================================================== */

const ABDU_STATES = {

    IDLE: "idle",

    LISTENING: "listening",

    THINKING: "thinking",

    SPEAKING: "speaking",

    EXECUTING: "executing",

    ERROR: "error"

};


let currentState = ABDU_STATES.IDLE;


/* ==========================================================
   CONVERSATION MEMORY
   ========================================================== */

const MEMORY_KEY = "abdu_conversation";

let conversation = JSON.parse(
    localStorage.getItem(MEMORY_KEY) || "[]"
);

function saveMemory() {
    localStorage.setItem(
        MEMORY_KEY,
        JSON.stringify(conversation)
    );
}

/* ==========================================================
   ABDU USER IDENTITY
   ========================================================== */

const USER_PROFILE = {
    name: "Anu Fazil",
    assistantName: "ABDU"
};

/* ==========================================================
   WEBSITE SHORTCUTS
   ========================================================== */

const SITES = {

    youtube:
        "https://www.youtube.com",

    github:
        "https://github.com",

    twitter:
        "https://twitter.com",

    x:
        "https://twitter.com",

    reddit:
        "https://www.reddit.com",

    gmail:
        "https://mail.google.com",

    google:
        "https://www.google.com",

    facebook:
        "https://www.facebook.com",

    instagram:
        "https://www.instagram.com",

    linkedin:
        "https://www.linkedin.com",

    netflix:
        "https://www.netflix.com",

    spotify:
        "https://open.spotify.com",

    amazon:
        "https://www.amazon.com",

    wikipedia:
        "https://www.wikipedia.org",

    maps:
        "https://maps.google.com"

};


/* ==========================================================
   STATE SYSTEM
   ========================================================== */

function setState(state) {

    currentState = state;

    body.classList.remove(
        "listening",
        "thinking",
        "speaking",
        "executing",
        "error"
    );


    switch (state) {

        case ABDU_STATES.LISTENING:

            body.classList.add("listening");

            statusText.textContent =
                "Listening...";

            characterStatus.textContent =
                "LISTENING";

            micLabel.textContent =
                "Stop listening";

            break;


        case ABDU_STATES.THINKING:

            body.classList.add("thinking");

            statusText.textContent =
                "Thinking...";

            characterStatus.textContent =
                "THINKING";

            micLabel.textContent =
                "Talk to ABDU";

            break;


        case ABDU_STATES.SPEAKING:

            body.classList.add("speaking");

            statusText.textContent =
                "Speaking...";

            characterStatus.textContent =
                "SPEAKING";

            micLabel.textContent =
                "Talk to ABDU";

            break;


        case ABDU_STATES.EXECUTING:

            body.classList.add("executing");

            statusText.textContent =
                "Executing...";

            characterStatus.textContent =
                "EXECUTING";

            micLabel.textContent =
                "Talk to ABDU";

            break;


        case ABDU_STATES.ERROR:

            body.classList.add("error");

            statusText.textContent =
                "Error";

            characterStatus.textContent =
                "ERROR";

            micLabel.textContent =
                "Talk to ABDU";

            break;


        default:

            statusText.textContent =
                "Idle";

            characterStatus.textContent =
                "READY";

            micLabel.textContent =
                "Talk to ABDU";

    }
}


/* ==========================================================
   ACTIVITY LOG
   ========================================================== */

function log(message, type = "info") {

    const item =
        document.createElement("div");

    item.className =
        "activity-item";

    if (type === "action") {

        item.classList.add("action");

    }

    if (type === "error") {

        item.classList.add("error");

    }

    item.textContent = message;

    logList.prepend(item);


    while (logList.children.length > 12) {

        logList.removeChild(
            logList.lastChild
        );

    }


    activityStatus.textContent =
        message;
}


/* ==========================================================
   CONVERSATION UI
   ========================================================== */

function addMessage(role, text) {

    const message =
        document.createElement("div");

    message.className =
        `message ${role}`;


    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        role === "user"
            ? "U"
            : "A";


    const content =
        document.createElement("div");

    content.className =
        "message-content";


    const roleLabel =
        document.createElement("div");

    roleLabel.className =
        "message-role";

    roleLabel.textContent =
        role === "user"
            ? "YOU"
            : "ABDU";


    const messageText =
        document.createElement("div");

    messageText.className =
        "message-text";

    messageText.textContent =
        text;


    content.appendChild(roleLabel);

    content.appendChild(messageText);

    message.appendChild(avatar);

    message.appendChild(content);

    messages.appendChild(message);


    messages.scrollTop =
        messages.scrollHeight;
}


/* ==========================================================
   RESPONSE
   ========================================================== */

function setResponse(text) {

    responseText.textContent =
        text;
}


/* ==========================================================
   SPEECH SYNTHESIS
   ========================================================== */

let voicesReady = [];


function loadVoices() {

    if (!("speechSynthesis" in window)) {

        return;
    }

    voicesReady =
        speechSynthesis.getVoices();
}


loadVoices();


if ("speechSynthesis" in window) {

    speechSynthesis.onvoiceschanged =
        loadVoices;
}


function speak(text, onDone) {

    if (!("speechSynthesis" in window)) {

        if (onDone) {

            onDone();

        }

        return;
    }


    const phoneticText =
        text.replace(
            /\bABDU\b/gi,
            "Abdoo"
        );


    const utterance =
        new SpeechSynthesisUtterance(
            phoneticText
        );


    utterance.rate =
        1;

    utterance.pitch =
        1;

    utterance.volume =
        1;


    const preferred =
        voicesReady.find(
            voice =>
                /en-|English/i.test(
                    voice.lang
                )
        );


    if (preferred) {

        utterance.voice =
            preferred;
    }


    utterance.onstart =
        () => {

            setState(
                ABDU_STATES.SPEAKING
            );

        };


    utterance.onend =
        () => {

            setState(
                ABDU_STATES.IDLE
            );

            if (onDone) {

                onDone();

            }

        };


    utterance.onerror =
        () => {

            setState(
                ABDU_STATES.IDLE
            );

            if (onDone) {

                onDone();

            }

        };


    speechSynthesis.cancel();

    speechSynthesis.speak(
        utterance
    );
}


/* ==========================================================
   SPEECH RECOGNITION
   ========================================================== */

const SpeechRecognitionAPI =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;

let isListening = false;


if (SpeechRecognitionAPI) {

    recognition =
        new SpeechRecognitionAPI();


    recognition.continuous =
        false;

    recognition.interimResults =
        true;

    recognition.lang =
        "en-US";


    recognition.onstart =
        () => {

            isListening =
                true;

            setState(
                ABDU_STATES.LISTENING
            );

            setResponse(
                "I'm listening..."
            );

            log(
                "Microphone activated."
            );

        };


    recognition.onresult =
        event => {

            let interim = "";

            let finalText = "";


            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const chunk =
                    event.results[i][0].transcript;


                if (
                    event.results[i].isFinal
                ) {

                    finalText += chunk;

                } else {

                    interim += chunk;

                }

            }


            if (interim) {

                setResponse(
                    interim
                );

            }


            if (finalText) {

                const text =
                    finalText.trim();

                handleInput(text);

            }

        };


    recognition.onerror =
        event => {

            isListening =
                false;

            setState(
                ABDU_STATES.ERROR
            );

            log(
                `Recognition error: ${event.error}`,
                "error"
            );


            setTimeout(
                () => {

                    setState(
                        ABDU_STATES.IDLE
                    );

                },
                1200
            );

        };


    recognition.onend =
        () => {

            isListening =
                false;


            if (
                currentState ===
                ABDU_STATES.LISTENING
            ) {

                setState(
                    ABDU_STATES.IDLE
                );

            }

        };

} else {

    log(
        "Speech recognition is not supported. Use Chrome.",
        "error"
    );

}


/* ==========================================================
   MICROPHONE
   ========================================================== */

function startListening() {

    if (!recognition) {

        speak(
            "Sorry, speech recognition is not supported in this browser."
        );

        return;
    }


    if (isListening) {

        recognition.stop();

        return;
    }


    try {

        recognition.start();

    } catch (error) {

        console.warn(error);

    }
}


micBtn.addEventListener(
    "click",
    startListening
);


/* ==========================================================
   INPUT HANDLER
   ========================================================== */

function handleInput(text) {

    if (!text) {

        return;
    }


    addMessage(
        "user",
        text
    );


    log(
        `Heard: "${text}"`
    );


    processRequest(text);
}


/* ==========================================================
   REQUEST PROCESSOR
   ========================================================== */

function processRequest(text) {
    processUserInput(text);
}


/* ==========================================================
   COMMAND ROUTER
   ========================================================== */

function handleCommand(rawText) {

    if (!rawText || !rawText.trim()) {
        return;
    }

    processUserInput(rawText.trim());
}


/* ==========================================================
   RESPOND
   ========================================================== */

function respond(text) {

    setResponse(
        text
    );


    addMessage(
        "assistant",
        text
    );


    conversation.push({

        role: "assistant",

        content: text

    });


    speak(
        text
    );


    log(
        "ABDU responded.",
        "action"
    );
}


/* ==========================================================
   OPEN WEBSITE
   ========================================================== */

function openSite(url, label) {

    setState(
        ABDU_STATES.EXECUTING
    );


    setResponse(
        `Opening ${label}...`
    );


    const newWindow =
        window.open(
            url,
            "_blank"
        );


    if (!newWindow) {

        respond(
            `I couldn't open ${label}. Your browser may have blocked the popup.`
        );

        return;
    }


    log(
        `Opened ${label}.`,
        "action"
    );


    addMessage(
        "assistant",
        `Opening ${label}.`
    );


    conversation.push({

        role: "assistant",

        content:
            `Opening ${label}.`

    });


    speak(
        `Opening ${label}.`
    );
}


/* ==========================================================
   GOOGLE SEARCH
   ========================================================== */

function searchGoogle(query) {

    setState(
        ABDU_STATES.EXECUTING
    );


    setResponse(
        `Searching Google for "${query}"...`
    );


    const url =
        `https://www.google.com/search?q=${encodeURIComponent(query)}`;


    const newWindow =
        window.open(
            url,
            "_blank"
        );


    if (!newWindow) {

        respond(
            "I couldn't open Google because the browser blocked the popup."
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


    log(
        `Google search: "${query}"`,
        "action"
    );


    speak(
        message
    );
}


/* ==========================================================
   TEXT INPUT
   ========================================================== */

textForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const text =
            textInput.value.trim();


        if (!text) {

            return;
        }


        textInput.value =
            "";


        handleInput(
            text
        );

    }
);


/* ==========================================================
   QUICK COMMAND BUTTONS
   ========================================================== */

document
    .querySelectorAll(
        ".quick-command"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const command =
                    button.dataset.command;


                handleInput(
                    command
                );

            }
        );

    });


/* ==========================================================
   CLEAR CONVERSATION
   ========================================================== */

clearConversation.addEventListener(
    "click",
    () => {

        conversation = [];


        messages.innerHTML = "";


        setResponse(
            "Conversation cleared."
        );


        addMessage(
            "assistant",
            "Conversation cleared. I'm ready for a new conversation."
        );


        log(
            "Conversation cleared.",
            "action"
        );

    }
);


/* ==========================================================
   CLOCK
   ========================================================== */

function updateClock() {

    const now =
        new Date();


    const pad =
        number =>
            String(number)
                .padStart(2, "0");


    sysClock.textContent =
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}


setInterval(
    updateClock,
    1000
);


updateClock();


/* ==========================================================
   PARTICLES
   ========================================================== */

function createParticles() {

    if (!particles) {

        return;
    }


    for (
        let i = 0;
        i < 24;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "particle";


        particle.style.left =
            `${15 + Math.random() * 70}%`;


        particle.style.bottom =
            `${20 + Math.random() * 20}%`;


        particle.style.animationDuration =
            `${4 + Math.random() * 5}s`;


        particle.style.animationDelay =
            `${Math.random() * 5}s`;


        particles.appendChild(
            particle
        );

    }
}


/* ==========================================================
   EYE MOVEMENT
   ========================================================== */

document.addEventListener(
    "mousemove",
    event => {

        const leftEye =
            document.getElementById(
                "leftEye"
            );

        const rightEye =
            document.getElementById(
                "rightEye"
            );


        if (!leftEye || !rightEye) {

            return;
        }


        const x =
            (event.clientX /
                window.innerWidth) *
                2 -
            1;


        const y =
            (event.clientY /
                window.innerHeight) *
                2 -
            1;


        const moveX =
            x * 3;


        const moveY =
            y * 2;


        leftEye.style.transform =
            `translate(${moveX}px, ${moveY}px)`;


        rightEye.style.transform =
            `translate(${moveX}px, ${moveY}px)`;

    }
);


/* ==========================================================
   BLINK
   ========================================================== */

function blink() {

    const eyes = [
        document.getElementById("leftEye"),
        document.getElementById("rightEye")
    ];


    eyes.forEach(
        eye => {

            if (!eye) return;

            eye.style.transform =
                "scaleY(0.12)";

        }
    );


    setTimeout(
        () => {

            eyes.forEach(
                eye => {

                    if (!eye) return;

                    eye.style.transform =
                        "";

                }
            );

        },
        140
    );


    scheduleBlink();
}


function scheduleBlink() {

    const delay =
        2600 +
        Math.random() * 3500;


    setTimeout(
        blink,
        delay
    );
}


/* ==========================================================
   INITIALIZATION
   ========================================================== */

window.addEventListener(
    "load",
    () => {

        setState(
            ABDU_STATES.IDLE
        );


        createParticles();


        log(
            "ABDU interface initialized.",
            "action"
        );


        log(
            "Voice system ready."
        );


        log(
            "Browser tools ready."
        );


        setTimeout(
            () => {

                setResponse(
                    "Hello. I'm ABDU. I'm ready to talk."
                );


                speak(
                    "Hello. I'm ABDU. I'm ready to talk."
                );

            },
            700
        );


        scheduleBlink();

    }
);