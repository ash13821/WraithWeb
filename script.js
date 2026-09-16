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


document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {
            closeChatBox();
        }

    }
);


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

            const site =
                document.getElementById("site");

            if (site) {

                site.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

            openChatBox();

        }, 1200);

    } else {

        const site =
            document.getElementById("site");

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




function addMessage(
    text,
    who = "bot"
) {

    if (!messages) return;

    const div =
        document.createElement("div");

    div.className =
        "msg " + who;

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


function pick(items) {

    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];

}



function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[^\w\s']/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}



function getWraithResponse(text) {

    const message =
        normalizeText(text);


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
                "tests",
                "semester",
                "assignment",
                "assignments",
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
                "we stopped talking",
                "stopped talking to me",
                "not talking to me",
                "ignored me",
                "ignoring me",
                "ghosted me",
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
                "couldn't fix it"

            ],

            responses: [

                "You keep calling it a failure. I'm not convinced that's the whole story. What actually happened?",

                "Okay. Something didn't go according to plan. Tell me what happened.",

                "You messed something up. Join the club. What happened?",

                "Right. Something went wrong. That doesn't tell me why yet."

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

        }

    };


    let bestCategory =
        "general";

    let highestScore = 0;


    for (
        const category in categories
    ) {

        let score = 0;


        for (
            const clue
            of categories[category].clues
        ) {

            if (
                message.includes(clue)
            ) {

                if (
                    clue.includes(" ")
                ) {

                    score += 3;

                } else {

                    score += 1;

                }

            }

        }


        if (
            score > highestScore
        ) {

            highestScore = score;

            bestCategory =
                category;

        }

    }


    if (
        bestCategory === "general"
    ) {

        return pick([

            "Okay. You've got my attention. Tell me a little more.",

            "I'm listening. Start wherever you want.",

            "Right. Something's going on. Give me the details.",

            "Okay. I need the actual story now.",

            "You've clearly got something on your mind. What happened?"

        ]);

    }


    return pick(
        categories[
            bestCategory
        ].responses
    );

}



function getFinalWraithResponse(text) {

    const message =
        normalizeText(text);


    function has(clues) {

        return clues.some(
            clue =>
                message.includes(clue)
        );

    }


    if (
        has([

            "someone is following me",
            "someone is after me",
            "someone threatened me",
            "threatened me",
            "threatening me",
            "following me",
            "stalking me",
            "attacked me",
            "someone attacked me",
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

        ])
    ) {

        return pick([

            "Okay. This is serious, and I'm glad you reached out. Please get somewhere safe and contact someone you trust if you're in immediate danger. I've got your message, and I'll get back to you as soon as I can.",

            "I'm taking this one seriously. Your safety comes first, so please get somewhere safe and reach out to someone you trust if you need immediate help. I've got your details, and I'll get back to you as soon as possible."

        ]);

    }


  

    if (
        has([

            "betrayed me",
            "betray me",
            "betrayed",
            "betrayal",
            "betrayal by",
            "broke my trust",
            "lost my trust",
            "can't trust",
            "cannot trust",
            "don't trust them",
            "do not trust them",
            "don't trust her",
            "don't trust him",
            "do not trust her",
            "do not trust him",
            "went behind my back",
            "backstabbed me",
            "backstab",
            "deceived me"

        ])
    ) {

        if (
            has([

                "friend",
                "my friend",
                "best friend",
                "bestie",
                "friendship"

            ])
        ) {

            return pick([

                "I can see why that felt like a betrayal. When it's someone you trust, even a strange or seemingly small lie can hit harder than you'd expect. I've got your message, and I'll get back to you as soon as I can.",

                "Okay, I get why this got under your skin. It's not just what happened, it's the fact that it came from someone you trusted. I've got the details, and I'll get back to you as soon as possible.",

                "Yeah, I can see why you're calling it a betrayal. When a friend breaks your trust, suddenly you're left wondering what else wasn't true. I've got your message, and I'll get back to you soon."

            ]);

        }


        return pick([

            "I can see why that felt like a betrayal. When someone breaks your trust, it can make everything else feel questionable. I've got your message, and I'll get back to you as soon as I can.",

            "Yeah, I understand why you're hurt. It's not just the situation, it's the trust behind it. I've got the details, and I'll get back to you as soon as possible.",

            "That's a pretty serious hit to your trust. I've got your message, and I'll take a closer look and get back to you soon."

        ]);

    }


    if (
        has([

            "lied to me",
            "lied about",
            "lied",
            "lying",
            "told me a lie",
            "not telling the truth",
            "wasn't telling the truth",
            "was not telling the truth",
            "made up a story",
            "made something up",
            "fake excuse",
            "hid it from me",
            "kept it from me"

        ])
    ) {

        if (
            has([

                "friend",
                "my friend",
                "best friend",
                "bestie",
                "friendship"

            ])
        ) {

            return pick([

                "Okay, so someone decided honesty was optional. I can see why that would bother you, especially when it's a friend. I've got your message, and I'll get back to you as soon as I can.",

                "Right. Your friend wasn't exactly honest with you, and that clearly didn't sit well. I've got the details, and I'll get back to you soon.",

                "I can see why the lie is bothering you. When it comes from someone you trust, it can make a simple situation feel much bigger. I've got your message, and I'll get back to you as soon as possible."

            ]);

        }


        return pick([

            "Okay, so someone decided honesty was optional. That's frustrating. I've got the details, and I'll get back to you as soon as I can.",

            "Right. Someone wasn't exactly honest with you. I can see why that would bother you. I've got your message, and I'll get back to you soon.",

            "That's a pretty strange thing to have to deal with, especially when you were expecting the truth. I've got your message, and I'll look into it as soon as I can."

        ]);

    }


    

    if (
        has([

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
            "study",
            "studying",
            "subject",
            "failed my exam",
            "failed the exam",
            "failed a test",
            "failed my test",
            "failed the subject"

        ])
    ) {

        if (
            has([

                "stressed",
                "stress",
                "overwhelmed",
                "too much",
                "can't handle",
                "cannot handle",
                "burnt out",
                "burned out",
                "exhausted"

            ])
        ) {

            return pick([

                "Okay, you've clearly got a lot happening at once. College has a lovely habit of turning one problem into five. I've got your message, and I'll get back to you as soon as I can.",

                "That sounds like a lot to juggle at once. I've got the details, and I'll take a closer look and get back to you soon."

            ]);

        }


        return pick([

            "Okay, you've got a lot happening on the academic side. I've got your message, and I'll get back to you as soon as I can.",

            "Right. Exams, deadlines, marks, and the general academic circus. I've got the details, and I'll get back to you soon.",

            "That sounds like something we should actually look at instead of letting it spiral in your head. I've got your message, and I'll get back to you as soon as possible."

        ]);

    }


  
    if (
        has([

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
            "placement",
            "office",
            "salary",
            "promotion",
            "fired",
            "got fired",
            "lost my job"

        ])
    ) {

        return pick([

            "Okay. Something has clearly gone sideways on the career front. I've got your message, and I'll get back to you as soon as I can.",

            "Right. Work has decided to become a problem. I've got the details, and I'll get back to you soon.",

            "Career problems are rarely as simple as they look. I've got your message, and I'll take a closer look and get back to you as soon as possible."

        ]);

    }


   

    if (
        has([

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
            "family member",
            "argument with my parents",
            "fight with my parents"

        ])
    ) {

        return pick([

            "Family situations can get complicated very quickly. I can see why this is weighing on you. I've got your message, and I'll get back to you as soon as I can.",

            "Okay. This sounds personal, and clearly it matters to you. I've got the details, and I'll get back to you soon.",

            "Family problems aren't always easy to explain, but I understand why you reached out. I've got your message, and I'll get back to you as soon as possible."

        ]);

    }



    if (
        has([

            "money",
            "broke",
            "debt",
            "loan",
            "rent",
            "fees",
            "tuition",
            "financial",
            "finance",
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

        ])
    ) {

        return pick([

            "Money problems have an annoying habit of making everything else feel heavier. I've got your message, and I'll get back to you as soon as I can.",

            "Okay. Financial problems can pile up quickly. I've got the details, and I'll get back to you soon.",

            "Right. Money is involved. Because apparently nothing can ever be simple. I've got your message, and I'll get back to you as soon as possible."

        ]);

    }


   

    if (
        has([

            "really sad",
            "very sad",
            "crying",
            "been crying",
            "feel empty",
            "feel numb",
            "heartbroken",
            "miserable",
            "feel terrible",
            "feel awful",
            "feel horrible",
            "feel hopeless",
            "feel alone",
            "feel lonely",
            "lonely",
            "sadness"

        ])
    ) {

        return pick([

            "Hey. I'm sorry you're dealing with that. You don't have to make it sound smaller than it feels. I've got your message, and I'll get back to you as soon as I can.",

            "That sounds like a lot to carry around on your own. I'm glad you reached out. I've got the details, and I'll get back to you soon.",

            "You don't have to pretend you're okay just to explain what's happening. I've got your message, and I'll get back to you as soon as possible."

        ]);

    }


    

    if (
        has([

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
            "made me angry",
            "made me mad"

        ])
    ) {

        return pick([

            "Okay, you're definitely angry about this. I can see why. I've got your message, and I'll get back to you as soon as I can.",

            "Someone has clearly managed to get under your skin. I've got the details, and I'll get back to you soon.",

            "Right. You're angry, and I'm guessing there's a reason for that. I've got your message, and I'll get back to you as soon as possible."

        ]);

    }


  

    if (
        has([

            "stressed",
            "stress",
            "overwhelmed",
            "too much",
            "can't handle",
            "cannot handle",
            "too many things",
            "everything at once",
            "under pressure",
            "pressure",
            "burnt out",
            "burned out",
            "exhausted"

        ])
    ) {

        return pick([

            "Okay. You've clearly got too much happening at once. You don't need to solve everything in one go. I've got your message, and I'll get back to you as soon as I can.",

            "That's a lot to carry at once. I've got the details, and I'll get back to you soon.",

            "Sounds like everything decided to happen at the same time. I've got your message, and I'll take a closer look and get back to you as soon as possible."

        ]);

    }


   
    if (
        has([

            "confused",
            "confusing",
            "don't know what to do",
            "do not know what to do",
            "lost",
            "no idea",
            "not sure",
            "unsure",
            "can't decide",
            "cannot decide",
            "don't understand",
            "do not understand"

        ])
    ) {

        return pick([

            "Okay. You don't have to have everything figured out right now. I've got your message, and I'll get back to you as soon as I can.",

            "Being stuck doesn't mean you're out of options. I've got the details, and I'll get back to you soon.",

            "You don't need to have the answer before you ask for help. I've got your message, and I'll get back to you as soon as possible."

        ]);

    }


    

    if (
        has([

            "rejected",
            "rejection",
            "turned me down",
            "said no",
            "didn't get",
            "did not get",
            "wasn't accepted",
            "was not accepted",
            "didn't choose me",
            "did not choose me"

        ])
    ) {

        return pick([

            "Getting rejected hurts. It doesn't get to decide what happens next, though. I've got your message, and I'll get back to you as soon as I can.",

            "Okay. That one stings. I've got the details, and I'll get back to you soon.",

            "That's disappointing, especially when you actually cared about the outcome. I've got your message, and I'll get back to you as soon as possible."

        ]);

    }


   

    if (
        has([

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
            "let them down"

        ])
    ) {

        return pick([

            "You clearly care about what happened, otherwise you wouldn't be carrying this much guilt. I've got your message, and I'll get back to you as soon as I can.",

            "Okay. Something went wrong, and you're taking it seriously. I've got the details, and I'll get back to you soon.",

            "Whatever happened, you're clearly thinking hard about it. I've got your message, and I'll take a closer look and get back to you as soon as possible."

        ]);

    }



    if (
        has([

            "scared",
            "afraid",
            "terrified",
            "frightened",
            "nervous",
            "worried",
            "panic",
            "panicking",
            "fear"

        ])
    ) {

        return pick([

            "Hey. I can see why you're worried. Whatever's happening, you don't have to pretend it doesn't affect you. I've got your message, and I'll get back to you as soon as I can.",

            "Okay. Take a breath for a second. I've got your message, and I'll take a closer look and get back to you soon.",

            "It's okay to be worried when something matters to you. I've got the details, and I'll get back to you as soon as possible."

        ]);

    }



    if (
        has([

            "friend",
            "my friend",
            "best friend",
            "bestie",
            "friendship",
            "my friends"

        ])
    ) {

        return pick([

            "Yeah, I can see why this is bothering you. Things get complicated when it's someone you actually care about. I've got your message, and I'll get back to you as soon as I can.",

            "Friendship problems are rarely as simple as they look from the outside. I've got the details, and I'll get back to you soon.",

            "Okay. Someone you care about is involved, so I can see why this matters to you. I've got your message, and I'll get back to you as soon as possible."

        ]);

    }



    return pick([

        "Okay. I can see why this has been bothering you. I've got your message, and I'll get back to you as soon as I can.",

        "Right. That's clearly been sitting on your mind. I've got the details, and I'll get back to you soon.",

        "I hear you. I've got your message, and I'll take a closer look and get back to you as soon as possible."

    ]);

}




async function submitGrievance() {

    addMessage(
        "Give me a moment while I send this through.",
        "bot"
    );


    try {

        const response =
            await fetch(
                "https://ashwinams.pythonanywhere.com/submit-grievance",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            visitorData
                        )
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            addMessage(
                "It's been submitted. I've got it from here.",
                "bot"
            );


            conversationComplete =
                true;


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
    "\n\n" + text;


        problemFollowUp =
            false;


        showTyping();


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    800
                )
        );


        removeTyping();


      

        addMessage(
            getFinalWraithResponse(
                visitorData.grievance
            ),
            "bot"
        );


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    600
                )
        );


        await submitGrievance();


        return;

    }


    if (
        currentStep === 1
    ) {

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



    if (
        currentStep === 3
    ) {

        const emailPattern =
            /^[^\s@]+@gmail\.com$/i;


        if (
            !emailPattern.test(text)
        ) {

            addMessage(
                "That doesn't look like a valid Gmail address. Try again.",
                "bot"
            );

            return;

        }

    }


    

    if (
        currentStep <
        fields.length
    ) {

        visitorData[
            fields[currentStep]
        ] = text;

    }


    currentStep++;


    showTyping();


    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                700
            )
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


  
    problemFollowUp =
        true;


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


    if (
        currentStep <
        placeholders.length
    ) {

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
    (event) => {

        document.documentElement.style.setProperty(
            "--mouse-x",
            `${event.clientX}px`
        );


        document.documentElement.style.setProperty(
            "--mouse-y",
            `${event.clientY}px`
        );

    }
);
