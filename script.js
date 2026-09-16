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

    const categories = {

        academic: {
            clues: [
                "college",
                "university",
                "campus",
                "class",
                "classmate",
                "professor",
                "teacher",
                "lecturer",
                "exam",
                "exams",
                "test",
                "semester",
                "assignment",
                "lab",
                "viva",
                "attendance",
                "marks",
                "grades",
                "grade",
                "cgpa",
                "gpa",
                "backlog",
                "syllabus",
                "project",
                "presentation",
                "study",
                "studying",
                "homework",
                "deadline",
                "course",
                "subject",
                "failed my exam",
                "failed the exam",
                "failed a test",
                "failed my test",
                "failed the subject"
            ],

            responses: [
                "College. Of course. Because apparently life wasn't stressful enough already. What's been bothering you?",
                "Okay, academic chaos. What exactly happened?",
                "Right. We've got a study-related crisis. Tell me what's going on.",
                "Exams, assignments, deadlines... humanity really had to make learning this dramatic. What's the problem?"
            ]
        },


        career: {
            clues: [
                "job",
                "work",
                "workplace",
                "boss",
                "manager",
                "coworker",
                "colleague",
                "internship",
                "interview",
                "interviews",
                "resume",
                "cv",
                "career",
                "promotion",
                "salary",
                "paycheck",
                "placement",
                "office",
                "client",
                "deadline",
                "application",
                "rejected from the job",
                "failed my interview",
                "lost my job",
                "got fired"
            ],

            responses: [
                "Career problems. Lovely. Tell me what happened.",
                "Okay, work has officially entered the chat. What's going on?",
                "An interview, a job, or something else? Give me the details.",
                "Right. Professional disaster. Start from the beginning."
            ]
        },


        friendship: {
            clues: [
                "best friend",
                "bestie",
                "close friend",
                "my friend",
                "my friends",
                "friendship",
                "friend group",
                "friend group",
                "we stopped talking",
                "stopped talking to me",
                "not talking to me",
                "ignored me",
                "ignoring me",
                "ghosted me",
                "betrayed me",
                "my friend lied",
                "friend lied",
                "lost a friend"
            ],

            responses: [
                "Okay. This sounds personal. What happened?",
                "Friendship drama. Fantastic. Start from the beginning.",
                "Someone you care about is involved. Tell me what happened.",
                "Okay, I'm listening. Give me the actual story."
            ]
        },


        romantic: {
            clues: [
                "boyfriend",
                "girlfriend",
                "partner",
                "relationship",
                "dating",
                "date",
                "breakup",
                "broke up",
                "ex",
                "crush",
                "love",
                "cheated",
                "cheating",
                "romantic",
                "relationship ended",
                "my boyfriend",
                "my girlfriend",
                "my partner"
            ],

            responses: [
                "Okay. Relationship territory. This could get complicated. What happened?",
                "Right. Feelings. Humanity's favourite source of unnecessary complications. Tell me.",
                "Okay, this sounds like a relationship problem. Start from the beginning.",
                "I have questions already. Unfortunately, you're going to have to tell me the story first."
            ]
        },


        family: {
            clues: [
                "my mom",
                "my mum",
                "my mother",
                "my dad",
                "my father",
                "my parents",
                "my parent",
                "my brother",
                "my sister",
                "my sibling",
                "my family",
                "family member",
                "family problem",
                "family issue",
                "at home",
                "parents won't",
                "parents don't",
                "parents are",
                "argument with my parents",
                "fight with my parents"
            ],

            responses: [
                "Family stuff. Never exactly simple, is it? Tell me what's going on.",
                "Okay. Family situation. I'm listening.",
                "Right. This one's a little more personal. What happened?",
                "Family drama. Because apparently we weren't allowed to have a peaceful day."
            ]
        },


        money: {
            clues: [
                "money",
                "broke",
                "debt",
                "loan",
                "rent",
                "fees",
                "tuition",
                "financial",
                "finance",
                "salary",
                "income",
                "afford",
                "expensive",
                "bank",
                "bill",
                "bills",
                "payment",
                "paying",
                "can't afford",
                "cannot afford",
                "need money"
            ],

            responses: [
                "Money problems. Humanity's favourite recurring villain. What's going on?",
                "Okay, financial mess. Tell me what happened.",
                "Right. Money. Annoyingly important for absolutely everything. What's the situation?",
                "Let's deal with one problem at a time. What's happening?"
            ]
        },


        safety: {
            clues: [
                "unsafe",
                "not safe",
                "danger",
                "dangerous",
                "threat",
                "threatened",
                "someone threatened me",
                "following me",
                "stalking me",
                "attacked",
                "attacking me",
                "hurt me",
                "hit me",
                "hitting me",
                "abuse",
                "abusive",
                "harassed",
                "harassment",
                "afraid to go home",
                "scared to go home",
                "someone is after me",
                "someone is following me"
            ],

            responses: [
                "Okay. That's serious. Forget everything else for a second. Are you safe right now?",
                "That's not something I'm going to joke about. Are you somewhere safe?",
                "Okay. Safety first. Tell me what's happening.",
                "Right. This needs attention. Are you safe right now?"
            ]
        },


        emotional: {
            clues: [
                "sad",
                "sadness",
                "lonely",
                "loneliness",
                "alone",
                "crying",
                "cry",
                "hurt",
                "heartbroken",
                "empty",
                "numb",
                "hopeless",
                "exhausted",
                "tired",
                "burnt out",
                "burned out",
                "overwhelmed",
                "stressed",
                "stress",
                "anxious",
                "anxiety",
                "worried",
                "scared",
                "afraid",
                "confused",
                "lost",
                "frustrated",
                "angry",
                "furious",
                "upset",
                "miserable",
                "can't cope",
                "cannot cope",
                "don't know what to do",
                "dont know what to do"
            ],

            responses: [
                "Hey. You don't have to pretend you're fine with me. Tell me what's going on.",
                "Okay. That's a lot to carry. Start wherever you want.",
                "You don't have to explain it perfectly. Just tell me what's happening.",
                "Right. Let's slow this down for a second. What's bothering you the most?"
            ]
        },


        social: {
            clues: [
                "people",
                "everyone",
                "nobody",
                "social",
                "group",
                "ignored",
                "judging me",
                "they hate me",
                "no one likes me",
                "left me out",
                "excluded",
                "embarrassed",
                "embarrassing",
                "awkward"
            ],

            responses: [
                "Okay. People are being people again. Tell me what happened.",
                "Social disaster? I need context.",
                "Right. Something happened with other people. Start from the beginning.",
                "Okay, you've got my attention. What did they do?"
            ]
        },


        failure: {
            clues: [
                "failed",
                "failure",
                "messed up",
                "screwed up",
                "made a mistake",
                "ruined everything",
                "didn't succeed",
                "couldn't do it",
                "couldn't fix it",
                "lost"
            ],

            responses: [
                "You keep calling it a failure. I'm not convinced that's the whole story. What actually happened?",
                "Okay. Something didn't go according to plan. Tell me what happened.",
                "You messed something up. Join the club. What happened?",
                "Right. Something went wrong. That doesn't tell me why yet."
            ]
        },


        general: {
            clues: [],

            responses: [
                "Okay. You've got my attention. Tell me a little more.",
                "I'm listening. Start wherever you want.",
                "Right. Something's going on. Give me the details.",
                "Okay. I need the actual story now.",
                "You've clearly got something on your mind. What happened?"
            ]
        }

    };


    const scores = {};


    for (const category in categories) {

        scores[category] = 0;

        for (const clue of categories[category].clues) {

            if (message.includes(clue)) {

                scores[category] +=
                    clue.includes(" ")
                        ? 3
                        : 1;

            }

        }

    }


    let bestCategory = "general";
    let highestScore = 0;


    for (const category in scores) {

        if (
            scores[category] > highestScore
        ) {

            highestScore =
                scores[category];

            bestCategory =
                category;

        }

    }


    const responses =
        categories[bestCategory].responses;


    return responses[
        Math.floor(
            Math.random() * responses.length
        )
    ];

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
