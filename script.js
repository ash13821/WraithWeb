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

  "Alright, what kind of mess are we dealing with?",
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


async function handleSend(event) {

    if (event) {
        event.preventDefault();
    }

    if (!input) return;

    const text =
        input.value.trim();

    if (!text) return;


    
    addMessage(
        text,
        "user"
    );


    
    input.value = "";


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


   

    addMessage(
        "Got it. Give me a moment while I send this through.",
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
            "Message Wraith...";

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
document.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
});
