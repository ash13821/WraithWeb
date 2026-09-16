const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");

const chatDialog = document.querySelector(".chat-dialog");
const closeChat = document.querySelector(".chat-close");
const chatOverlay = document.getElementById("chatOverlay");
const openChatButton = document.getElementById("openChat");

const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const chatForm = document.getElementById("chatForm");


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


if (closeChat) {

    closeChat.addEventListener(
        "click",
        closeChatBox
    );

}


if (chatOverlay) {

    chatOverlay.addEventListener(
        "click",
        closeChatBox
    );

}


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeChatBox();
    }

});


if (openChatButton) {

    openChatButton.addEventListener(
        "click",
        openChatBox
    );

}


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


    setTimeout(() => {

        if (
            introVideo.readyState < 2 &&
            !siteRevealed
        ) {

            revealSite();

        }

    }, 4500);

}


if (intro) {

    intro.addEventListener(
        "click",
        revealSite
    );

}


let currentStep = 0;
let problemFollowUp = false;
let conversationComplete = false;


const visitorData = {

    name: "",
    age: "",
    location: "",
    email: "",
    grievance: ""

};


const questions = [

    "First things first. What should I call you?",

    "How old are you? Just the number. I promise I won't judge.",

    "Where are you based?",

    "What's your Gmail? Yes, Gmail specifically.",

    "Alright. What's going on?"

];


const fields = [

    "name",
    "age",
    "location",
    "email",
    "grievance"

];


function addMessage(text, who = "bot") {

    if (!messages) return;

    const div = document.createElement("div");

    div.className = "msg " + who;

    div.textContent = text;

    messages.appendChild(div);

    messages.scrollTop =
        messages.scrollHeight;

}


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


function getWraithResponse(text) {

    const message = text.toLowerCase();


    if (
        message.includes("unsafe") ||
        message.includes("danger") ||
        message.includes("threat") ||
        message.includes("threatened") ||
        message.includes("scared") ||
        message.includes("afraid")
    ) {

        return "Okay. That's serious. Forget everything else for a second. Are you safe right now?";

    }


    if (
        message.includes("college") ||
        message.includes("exam") ||
        message.includes("assignment") ||
        message.includes("marks") ||
        message.includes("study")
    ) {

        return "College. Of course. Because apparently life wasn't stressful enough already. What's been bothering you?";

    }


    if (
        message.includes("friend") ||
        message.includes("bestie") ||
        message.includes("friendship")
    ) {

        return "Okay. This sounds personal. What happened?";

    }


    if (
        message.includes("family") ||
        message.includes("parent") ||
        message.includes("parents") ||
        message.includes("home")
    ) {

        return "Family stuff. Never exactly simple, is it? Tell me what's going on.";

    }


    if (
        message.includes("sad") ||
        message.includes("lonely") ||
        message.includes("alone") ||
        message.includes("cry")
    ) {

        return "Hey. You don't have to pretend you're fine with me. Tell me what's going on.";

    }


    if (
        message.includes("angry") ||
        message.includes("mad") ||
        message.includes("furious")
    ) {

        return "Okay. Someone has clearly managed to annoy you. I need the story.";

    }


    if (
        message.includes("stress") ||
        message.includes("stressed") ||
        message.includes("overwhelmed")
    ) {

        return "Sounds like you've got a lot on your plate. Let's untangle it one thing at a time.";

    }


    if (
        message.includes("confused") ||
        message.includes("lost") ||
        message.includes("don't know")
    ) {

        return "That's okay. You don't need to have everything figured out. Start wherever it makes sense.";

    }


    return "Okay. You've got my attention. Tell me a little more.";

}


async function submitGrievance() {

    addMessage(
        "Give me a moment while I send this through.",
        "bot"
    );


    try {

        const response = await fetch(
            "https://ashwinams.pythonanywhere.com/submit-grievance",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(visitorData)
            }
        );


        const result =
            await response.json();


        if (response.ok) {

            addMessage(
                "It's been submitted. I've got it from here.",
                "bot"
            );

            conversationComplete = true;

            if (input) {
                input.placeholder =
                    "Signal received.";
            }

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


async function handleSend(event) {

    if (event) {
        event.preventDefault();
    }


    if (!input) return;


    if (conversationComplete) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) return;


    addMessage(
        text,
        "user"
    );


    input.value = "";


    if (problemFollowUp) {

        visitorData.grievance +=
            "\n\nAdditional details: " + text;

        problemFollowUp = false;


        showTyping();


        await new Promise(
            resolve =>
                setTimeout(resolve, 800)
        );


        removeTyping();


        addMessage(
            "Okay. I think I've got the picture now. I'll take it from here.",
            "bot"
        );


        await new Promise(
            resolve =>
                setTimeout(resolve, 600)
        );


        await submitGrievance();

        return;
    }


    if (currentStep === 1) {

        const age =
            Number(text);


        if (
            !Number.isInteger(age) ||
            age < 1
        ) {

            addMessage(
                "I need the actual number. I'm good, but I can't guess your age.",
                "bot"
            );

            return;
        }

    }


    if (currentStep === 3) {

        const emailPattern =
            /^[^\s@]+@gmail\.com$/i;


        if (!emailPattern.test(text)) {

            addMessage(
                "That doesn't look like a valid Gmail address. Try again.",
                "bot"
            );

            return;
        }

    }


    if (currentStep < fields.length) {

        visitorData[
            fields[currentStep]
        ] = text;

    }


    currentStep++;


    showTyping();


    await new Promise(
        resolve =>
            setTimeout(resolve, 700)
    );


    removeTyping();


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


    problemFollowUp = true;


    addMessage(
        getWraithResponse(text),
        "bot"
    );


    if (input) {

        input.placeholder =
            "Tell me more...";

    }

}


function updatePlaceholder() {

    if (!input) return;


    const placeholders = [

        "Your name...",

        "Just the number...",

        "Where are you from...",

        "Your Gmail...",

        "Tell me what happened..."

    ];


    if (currentStep < placeholders.length) {

        input.placeholder =
            placeholders[currentStep];

    } else {

        input.placeholder =
            "Tell me more...";

    }

}


if (chatForm) {

    chatForm.addEventListener(
        "submit",
        handleSend
    );

}


function startChat() {

    if (!messages) return;


    currentStep = 0;
    problemFollowUp = false;
    conversationComplete = false;


    visitorData.name = "";
    visitorData.age = "";
    visitorData.location = "";
    visitorData.email = "";
    visitorData.grievance = "";


    messages.innerHTML = "";


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


startChat();


document.addEventListener(
    "mousemove",
    (e) => {

        document.documentElement.style.setProperty(
            "--mouse-x",
            `${e.clientX}px`
        );

        document.documentElement.style.setProperty(
            "--mouse-y",
            `${e.clientY}px`
        );

    }
);
