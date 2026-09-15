const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");

const chatDialog = document.querySelector(".chat-dialog");
const closeChat = document.querySelector(".chat-close");
const chatOverlay = document.getElementById("chatOverlay");
const openChatButton = document.getElementById("openChat");

const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const chatForm = document.getElementById("chatForm");


// =========================================
// CHAT OPEN / CLOSE
// =========================================

function openChatBox() {

    if (!chatDialog) return;

    chatDialog.classList.add("is-open");
    chatDialog.setAttribute("aria-hidden", "false");

    document.body.classList.add("chat-open");

    setTimeout(() => {

        if (input) {
            input.focus();
        }

    }, 500);
}


function closeChatBox() {

    if (!chatDialog) return;

    chatDialog.classList.remove("is-open");
    chatDialog.setAttribute("aria-hidden", "true");

    document.body.classList.remove("chat-open");
}


// Close button
if (closeChat) {

    closeChat.addEventListener(
        "click",
        closeChatBox
    );

}


// Click outside hologram
if (chatOverlay) {

    chatOverlay.addEventListener(
        "click",
        closeChatBox
    );

}


// ESC key
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeChatBox();
    }

});


// Open chat button
if (openChatButton) {

    openChatButton.addEventListener(
        "click",
        openChatBox
    );

}


// =========================================
// INTRO
// =========================================

let siteRevealed = false;


function revealSite() {

    if (siteRevealed) return;

    siteRevealed = true;

    if (intro) {

        intro.classList.add("fade-out");

        setTimeout(() => {

            intro.style.display = "none";

            const site = document.getElementById("site");

            if (site) {
                site.setAttribute(
                    "aria-hidden",
                    "false"
                );
            }

            // Automatically open holographic chatbot
            openChatBox();

        }, 1200);

    } else {

        const site = document.getElementById("site");

        if (site) {
            site.setAttribute(
                "aria-hidden",
                "false"
            );
        }

        openChatBox();
    }
}


// Video finishes
if (introVideo) {

    introVideo.addEventListener(
        "ended",
        revealSite
    );


    introVideo.addEventListener(
        "error",
        revealSite
    );


    introVideo.addEventListener(
        "stalled",
        () => {

            setTimeout(
                revealSite,
                3000
            );

        }
    );


    // Safety net
    setTimeout(() => {

        if (
            introVideo.readyState < 2 &&
            !siteRevealed
        ) {

            revealSite();

        }

    }, 4500);

}


// Clicking intro
if (intro) {

    intro.addEventListener(
        "click",
        revealSite
    );

}


// =========================================
// CHAT INFORMATION COLLECTION
// =========================================

let currentStep = 0;


const visitorData = {

    name: "",
    age: "",
    location: "",
    email: "",
    grievance: ""

};


const questions = [

    "What's your name?",

    "How old are you?",

    "Where are you located?",

    "What's your Gmail address?",

    "Now tell me what's going on. What's the issue?"

];


const fields = [

    "name",
    "age",
    "location",
    "email",
    "grievance"

];


// =========================================
// ADD MESSAGE
// =========================================

function addMessage(text, who = "bot") {

    if (!messages) return;

    const div = document.createElement("div");

    div.className = "msg " + who;

    div.textContent = text;

    messages.appendChild(div);

    messages.scrollTop =
        messages.scrollHeight;

}


// =========================================
// TYPING INDICATOR
// =========================================

function showTyping() {

    if (!messages) return;

    const div =
        document.createElement("div");

    div.className = "typing";

    div.id = "typingIndicator";

    div.innerHTML =
        "<span></span><span></span><span></span>";

    messages.appendChild(div);

    messages.scrollTop =
        messages.scrollHeight;

}


function removeTyping() {

    const typing =
        document.getElementById(
            "typingIndicator"
        );

    if (typing) {
        typing.remove();
    }

}


// =========================================
// SEND MESSAGE
// =========================================

async function handleSend(event) {

    if (event) {
        event.preventDefault();
    }

    if (!input) return;

    const text =
        input.value.trim();

    if (!text) return;


    // Show user's message
    addMessage(
        text,
        "user"
    );


    // Clear input
    input.value = "";

// Validate age
if (currentStep === 1) {
    const age = Number(text);

    if (!Number.isInteger(age) || age < 1 ) {
        addMessage(
            "Please enter age in numbers",
            "bot"
        );
        return;
    }
}
 // Validate email before saving it

if (currentStep === 3) {
    const emailPattern = /^[^\s@]+@gmail\.com$/i;

    if (!emailPattern.test(text)) {
        addMessage(
            "That doesn't look like a valid Gmail address. Try again.",
            "bot"
        );
        return;
    }
}

// Save answer
if (currentStep < fields.length) {
    visitorData[
        fields[currentStep]
    ] = text;
}

// Move to next question
currentStep++;

    // Typing animation
    showTyping();


    await new Promise(
        resolve =>
            setTimeout(resolve, 700)
    );


    removeTyping();


    // =========================================
    // ASK NEXT QUESTION
    // =========================================

    if (
        currentStep <
        questions.length
    ) {

        addMessage(
            questions[currentStep],
            "bot"
        );

        updatePlaceholder();

        return;
    }


    // =========================================
    // EVERYTHING COLLECTED
    // =========================================

    addMessage(
        "Got it. Give me a moment while I send this through.",
        "bot"
    );


    try {

        const response = await fetch(
    "http://127.0.0.1:8000/submit-grievance",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(visitorData)
    }
);

const result = await response.json();

if (response.ok) {

    addMessage(
        "It's been submitted. I've got it from here.",
        "bot"
    );

} else {

    console.error(result);

    addMessage(
        "I couldn't submit this right now. The case system seems to be offline.",
        "bot"
    );
}
    } catch (error) {

        console.error(error);

        addMessage(
            "I couldn't reach the submission system. The server might be offline.",
            "bot"
        );

    }

}


// =========================================
// INPUT PLACEHOLDER
// =========================================

function updatePlaceholder() {

    if (!input) return;

    if (
        currentStep <
        questions.length
    ) {

        input.placeholder =
            questions[currentStep];

    } else {

        input.placeholder =
            "Message Wraith...";

    }

}


// =========================================
// FORM SUBMIT
// =========================================

if (chatForm) {

    chatForm.addEventListener(
        "submit",
        handleSend
    );

}


// =========================================
// START CHAT
// =========================================

function startChat() {

    if (!messages) return;


    // Clear whatever was originally inside
    messages.innerHTML = "";


    // First greeting
    addMessage(
        "Hey. I'm Wraith.",
        "bot"
    );


    setTimeout(() => {

        addMessage(
            questions[0],
            "bot"
        );

        updatePlaceholder();

    }, 700);

}


// =========================================
// PROFILE CHAT BUTTON
// =========================================

const profileChatButton =
    document.getElementById(
        "profileChatButton"
    );


if (profileChatButton) {

    profileChatButton.addEventListener(
        "click",
        () => {

            openChatBox();

        }
    );

}


// =========================================
// INITIALISE
// =========================================

startChat();
document.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
});