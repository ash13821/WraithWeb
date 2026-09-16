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
function getFinalWraithResponse(text) {

    const message = text.toLowerCase();

    const categories = {

        betrayal: {
            clues: [
                "betrayed",
                "betrayal",
                "betray me",
                "betrayed me",
                "betrayal by",
                "broke my trust",
                "lost my trust",
                "can't trust",
                "cannot trust",
                "don't trust",
                "do not trust",
                "trusted them",
                "trusted her",
                "trusted him",
                "trusted you",
                "lied to me",
                "lied about",
                "kept it from me",
                "hid it from me",
                "wasn't honest",
                "was not honest",
                "deceived me",
                "backstabbed",
                "backstab",
                "went behind my back"
            ],

            responses: [
                "I can see why that felt like a betrayal. When someone you trust lies to you, it can change how you see everything else. I've got your message, and I'll get back to you as soon as I can.",

                "Yeah, I understand why you're hurt. It's not just the lie, it's the fact that you trusted them in the first place. I've got the details, and I'll look into this as soon as I can.",

                "That sounds like a pretty serious hit to your trust. I can see why you're upset. I've got your message, and I'll get back to you as soon as possible.",

                "Okay. I get why you're calling this a betrayal. When someone you trust does something like that, it doesn't exactly leave you feeling great. I've got this from here, and I'll get back to you soon."
            ]
        },


        lying: {
            clues: [
                "lied",
                "lie",
                "lying",
                "told me a lie",
                "not telling the truth",
                "wasn't telling the truth",
                "was not telling the truth",
                "made up a story",
                "made something up",
                "gave me a fake excuse",
                "fake excuse",
                "caught them lying",
                "caught her lying",
                "caught him lying"
            ],

            responses: [
                "Okay, so someone decided honesty was optional. That's frustrating. I've got the details, and I'll get back to you as soon as I can.",

                "Right. Someone wasn't exactly honest with you. I can see why that would bother you. I've got your message, and I'll get back to you soon.",

                "That's a pretty strange thing to have to deal with. Especially when you were expecting the truth. I've got the details, and I'll look into it as soon as I can."
            ]
        },


        friendship: {
            clues: [
                "my friend",
                "my friends",
                "best friend",
                "bestie",
                "friendship",
                "friend group",
                "close friend",
                "we stopped talking",
                "stopped talking to me",
                "not talking to me",
                "ignored me",
                "ignoring me",
                "ghosted me",
                "left me out",
                "excluded me",
                "lost a friend",
                "friendship ended"
            ],

            responses: [
                "Yeah, I can see why this is bothering you. Things get complicated when it's someone you actually care about. I've got your message, and I'll get back to you as soon as I can.",

                "Friendship problems are rarely as simple as they look from the outside. I get why this got to you. I've got the details, and I'll get back to you soon.",

                "Okay. Whatever happened here clearly mattered to you. I've got your message, and I'll take a closer look as soon as I can."
            ]
        },


        anger: {
            clues: [
                "angry",
                "mad",
                "furious",
                "pissed",
                "annoyed",
                "irritated",
                "frustrated",
                "can't stand",
                "hate them",
                "hate him",
                "hate her",
                "they made me angry",
                "made me mad"
            ],

            responses: [
                "Okay, you're definitely angry about this. And honestly, I probably would be too. I've got your message, and I'll get back to you as soon as I can.",

                "Yeah, you're upset. I can tell. Let's not make any dramatic decisions while you're this angry. I've got the details, and I'll get back to you soon.",

                "Someone has clearly managed to get under your skin. I've got your message, and I'll look into it as soon as I can."
            ]
        },


        sadness: {
            clues: [
                "sad",
                "really sad",
                "crying",
                "been crying",
                "keep crying",
                "feel empty",
                "feel numb",
                "heartbroken",
                "broken heart",
                "miserable",
                "feel terrible",
                "feel awful",
                "feel horrible",
                "feel hopeless",
                "feel alone",
                "feel lonely",
                "lonely",
                "alone"
            ],

            responses: [
                "Hey. I'm sorry you're dealing with that. You don't have to make it sound smaller than it feels. I've got your message, and I'll get back to you as soon as I can.",

                "That sounds really hard to carry around on your own. I'm glad you reached out. I've got the details, and I'll get back to you soon.",

                "Okay. That sounds like it's been weighing on you for a while. I've got your message, and I'll take a closer look as soon as I can."
            ]
        },


        fear: {
            clues: [
                "scared",
                "afraid",
                "terrified",
                "frightened",
                "nervous",
                "worried",
                "panicking",
                "panic",
                "fear",
                "feel unsafe",
                "don't feel safe",
                "do not feel safe"
            ],

            responses: [
                "Hey. It's okay to be scared. Whatever's happening, you don't have to deal with it completely on your own. I've got your message, and I'll get back to you as soon as I can.",

                "Okay. Take a breath for me. I can see why you're worried. I've got the details, and I'll get back to you as soon as possible.",

                "I hear you. Whatever's making you feel this way matters. I've got your message, and I'll look into it as soon as I can."
            ]
        },


        stress: {
            clues: [
                "stressed",
                "stress",
                "overwhelmed",
                "too much",
                "can't handle",
                "cannot handle",
                "too many things",
                "everything is happening",
                "everything at once",
                "under pressure",
                "pressure",
                "burnt out",
                "burned out",
                "exhausted"
            ],

            responses: [
                "Okay. You've clearly got too much happening at once. You don't need to solve everything tonight. I've got your message, and I'll get back to you as soon as I can.",

                "That sounds like a lot to carry at once. Take a breath. I've got the details, and I'll get back to you soon.",

                "Yeah, that's a lot. Let's not make you carry the entire universe at once. I've got your message, and I'll get back to you as soon as I can."
            ]
        },


        academic: {
            clues: [
                "exam",
                "exams",
                "test",
                "tests",
                "assignment",
                "assignments",
                "college",
                "university",
                "semester",
                "professor",
                "teacher",
                "lecturer",
                "marks",
                "grades",
                "grade",
                "cgpa",
                "gpa",
                "backlog",
                "attendance",
                "viva",
                "lab",
                "project",
                "presentation",
                "deadline",
                "study",
                "studying",
                "course",
                "subject",
                "failed my exam",
                "failed the exam",
                "failed a test",
                "failed my test"
            ],

            responses: [
                "Academic chaos. Naturally. Because apparently one deadline at a time would've been too peaceful. I've got your message, and I'll get back to you as soon as I can.",

                "Okay, you've got a lot happening with college. I've got the details, and I'll get back to you as soon as possible.",

                "Right. Exams, deadlines, and general academic suffering. I've got your message, and I'll take a closer look as soon as I can."
            ]
        },


        career: {
            clues: [
                "job",
                "work",
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
                "placement",
                "office",
                "salary",
                "promotion",
                "fired",
                "rejected from the job",
                "failed my interview",
                "lost my job"
            ],

            responses: [
                "Okay. Career problems. Humanity really does enjoy making adulthood unnecessarily complicated. I've got your message, and I'll get back to you soon.",

                "That's a rough situation to be dealing with. I've got the details, and I'll look into it as soon as I can.",

                "Right. Something went wrong on the career front. I've got your message, and I'll get back to you as soon as possible."
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
                "family problem",
                "family issue",
                "argument with my parents",
                "fight with my parents",
                "parents won't",
                "parents don't",
                "parents are"
            ],

            responses: [
                "Family stuff can get complicated very quickly. I can see why this is weighing on you. I've got your message, and I'll get back to you as soon as I can.",

                "Okay. This sounds personal. I've got the details, and I'll take a closer look as soon as possible.",

                "Family problems are rarely straightforward. I've got your message, and I'll get back to you soon."
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
                "can't afford",
                "cannot afford",
                "expensive",
                "bill",
                "bills",
                "payment",
                "salary",
                "bank"
            ],

            responses: [
                "Money problems. Humanity's favourite recurring villain. I've got your message, and I'll get back to you as soon as I can.",

                "Okay. Financial problems can pile up quickly. I've got the details, and I'll get back to you soon.",

                "Right. Money is making everything more complicated. I've got your message, and I'll take a closer look as soon as possible."
            ]
        },


        confusion: {
            clues: [
                "confused",
                "confusing",
                "don't know what to do",
                "do not know what to do",
                "don't know what I'm doing",
                "do not know what I'm doing",
                "lost",
                "no idea",
                "not sure",
                "unsure",
                "can't decide",
                "cannot decide",
                "don't understand",
                "do not understand"
            ],

            responses: [
                "Okay. You don't have to have all the answers right now. I've got your message, and I'll get back to you as soon as I can.",

                "Being stuck doesn't mean you're out of options. I've got the details, and I'll get back to you soon.",

                "Right. Things are a little unclear at the moment. I've got your message, and I'll take a closer look as soon as possible."
            ]
        },


        rejection: {
            clues: [
                "rejected",
                "rejection",
                "turned me down",
                "said no",
                "didn't get",
                "did not get",
                "wasn't accepted",
                "was not accepted",
                "didn't choose me",
                "did not choose me",
                "failed the interview",
                "failed my interview"
            ],

            responses: [
                "Getting rejected hurts. Doesn't mean you're finished, though. I've got your message, and I'll get back to you as soon as I can.",

                "Okay. That one stings. Give yourself a minute before deciding it means everything is ruined. I've got the details, and I'll get back to you soon.",

                "That's a rough one. But one rejection doesn't get to write the entire story. I've got your message, and I'll look into it as soon as possible."
            ]
        },


        guilt: {
            clues: [
                "my fault",
                "it's my fault",
                "it is my fault",
                "feel guilty",
                "guilty",
                "feel bad about",
                "regret",
                "regret what I did",
                "messed up",
                "screwed up",
                "ruined everything",
                "hurt someone",
                "let them down",
                "let her down",
                "let him down"
            ],

            responses: [
                "You clearly care about what happened, otherwise you wouldn't be carrying this much guilt. I've got your message, and I'll get back to you as soon as I can.",

                "Okay. You made a mistake, and you're clearly taking it seriously. I've got the details, and I'll get back to you soon.",

                "You don't have to decide you're a terrible person because something went wrong. I've got your message, and I'll take a closer look as soon as possible."
            ]
        },


        safety: {
            clues: [
                "someone is following me",
                "following me",
                "stalking me",
                "threatening me",
                "someone threatened me",
                "someone attacked me",
                "attacked me",
                "someone hurt me",
                "hurt me",
                "hit me",
                "hitting me",
                "abuse",
                "abusive",
                "harassed me",
                "harassment",
                "not safe",
                "unsafe",
                "danger",
                "dangerous",
                "afraid to go home",
                "scared to go home"
            ],

            responses: [
                "Okay. This is serious, and I'm glad you reached out. Please get somewhere safe and contact someone you trust if you're in immediate danger. I've got your message, and I'll get back to you as soon as I can.",

                "I'm taking this one seriously. Your safety comes first, so please get somewhere safe and reach out to someone you trust if you need immediate help. I've got your details, and I'll get back to you as soon as possible."
            ]
        },


        general: {
            clues: [],

            responses: [
                "Okay. I can see why this has been bothering you. I've got your message, and I'll get back to you as soon as I can.",

                "Right. That's clearly been sitting on your mind. I've got the details, and I'll get back to you soon.",

                "Okay. I've got the picture now. I'll take a closer look and get back to you as soon as I can.",

                "I hear you. I've got your message, and I'll get back to you as soon as possible."
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

        if (scores[category] > highestScore) {

            highestScore = scores[category];
            bestCategory = category;

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
    getFinalWraithResponse(text),
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
