'use strict';

/**
 * This is the pun guy. He will tell you puns told from all over the internet.
 * I hope you enjoy.
 */


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Howdy! I am the pun guy! ' +
        'Ask me to tell you a pun and you never know what you will get.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Hard of hearing? Deaf? You should DEAF-initely ask me to tell you a pun!';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleSessionEndRequest(callback) {
    var goodbyePun = ['Have a great day!', 'I hope you have a knife day.', 
    'I hope to see you spoon.', 'remember a pun a day keeps the doctor away.'];
    var num = getRandomInt(0,3);
    const cardTitle = 'Session Ended';
    const speechOutput = 'Leaving so soon? Ask again anytime if you want more, I got a pun of these left and ' + goodbyePun[num];
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


function getPunFromSession(intent, session, callback) {
    var pun = ['There was a newspaper headline about a tightrope walker walking across the river Han in Korea. The headline said... ' + "Skywalker Crosses Han Solo",
    'Leather armor is perfect for sneaking because it is literally made of hide.',
    'Parallel lines have so much in common but it’s a shame they’ll never meet.',
    'Whenever I undress in the bathroom, my shower gets turned on.',
    'Whenever I undress in the bathroom my tub gets all wet.',
    'I tried to catch some fog once, but I mist.',
    'My science class went on a field trip to a pencil factory, but I didnt really see the point.',
    'When eating out with friends, I never order seafood. I dont want to seem shellfish.',
    'When some missionaries visited the tribe of cannibals, the cannibals got their first taste of religion.',
    'Im dating the girl across the street, but I still dont see why some people complain about lawn distance relationships.',
    'My dad got fired from the calendar factory. Apparently, they dont like when people take a day off.',
    'Shout out to anyone wondering what the opposite of in. is.',
    'One atom bumped into another walking down the road. "Oh no!", it said. "Ive lost an electron." "Are you sure?" "Im positive!"',
    'What do you call a circle of iron two ions? A ferrous wheel!',
    'I wanted to tell a chemistry joke but all the good ones argon.',
    'Do you know why you never hear any puns about steak? Steak puns are a rare medium well done.',
    'Did you hear about the police station that had its toilet stolen? The cops have nothing to go on.',
    'Why couldnt the bike stand on its own? Because it was two-tired.',
    'What do you call a cow with two legs? Lean beef. What do you call a cow with no legs? Ground beef.',
    'Im suffering from emotional constipation. I havent given a shit in days.',
    'Lately, Ive been reading about Anti-gravity. The book is impossible to put down.',
    'Ive started working as a porn writer, but its harder than expected. There are just so many holes in the plot.',
    'I learned sign language because I thought knowing it would be pretty handy.',
    'Ive always admired fishermen. Now those are reel men.',
    'Did you hear about the scarecrow who got an award? It was because he was out standing in his field.'];
    var num = getRandomInt(0,24);
    let shouldEndSession = false;
    let speechOutput = pun[num] + 'Would you like another? Ask again! Otherwise, say stop.';
    let repromptText = 'Want another? Ask away.';


    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback({},
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'PunIntent') {
        getPunFromSession(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
