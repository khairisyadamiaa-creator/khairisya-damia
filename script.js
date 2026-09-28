/* =====================================================
   MAGICAL GARDEN FENCE
   Created by Khairisya Damia

   Year 5 Mathematics
   DSKP 6.3.1

   Main learning focus:
   - Outside boundary
   - Internal/shared sides
   - Perimeter of combined shapes
   - Equilateral triangle
   - Isosceles triangle
   - Rectangle
===================================================== */


/* =====================================================
   1. GAME VARIABLES
===================================================== */

let currentScreen = "welcomeScreen";

let selectedSides = [];

let perimeterCompleted = false;

let soundEnabled = true;

let gardenShapes = [];

let quizCompleted = false;


/*
   The outside sides of our example garden.

   IMPORTANT:
   These are the mathematical lengths used
   for the learning activity.

   Side 4 is the internal/shared side,
   therefore it is NOT included in the perimeter.
*/

const sideLengths = {
    1: 5,
    2: 5,
    3: 6,
    4: 8,
    5: 8,
    6: 6
};


/*
   Correct outside boundary:

   Side 1 = 5 m
   Side 2 = 5 m
   Side 3 = 6 m
   Side 5 = 8 m
   Side 6 = 6 m

   Perimeter = 5 + 5 + 6 + 8 + 6
             = 30 m
*/

const correctPerimeter = 30;


/* =====================================================
   2. SCREEN NAVIGATION
===================================================== */

function showScreen(screenId) {

    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const selectedScreen = document.getElementById(screenId);

    if (selectedScreen) {
        selectedScreen.classList.add("active");
    }

    currentScreen = screenId;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   3. START GAME
===================================================== */

function startGame() {

    playSound("click");

    showScreen("boundaryScreen");

}


/* =====================================================
   4. LEVEL 1 → LEVEL 2
===================================================== */

function goToFenceLevel() {

    playSound("click");

    showScreen("fenceScreen");

    resetFenceLevel();

}


/* =====================================================
   5. RESET FENCE LEVEL
===================================================== */

function resetFenceLevel() {

    selectedSides = [];

    perimeterCompleted = false;

    const sides = document.querySelectorAll(".clickable-side");

    sides.forEach(side => {

        side.classList.remove("selected");
        side.classList.remove("wrong");

    });


    const feedback = document.getElementById("feedbackMessage");

    if (feedback) {

        feedback.innerHTML =
            "🌿 Look carefully at the garden. Click a side that belongs to the outside boundary.";

        feedback.className = "";

    }


    const selectedList =
        document.getElementById("selectedSidesList");

    if (selectedList) {

        selectedList.innerHTML =
            "None selected yet.";

    }


    const continueButton =
        document.getElementById("continueCalculationButton");

    if (continueButton) {

        continueButton.classList.add("hidden");

    }

}


/* =====================================================
   6. CLICKABLE GARDEN SIDES
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sides =
        document.querySelectorAll(".clickable-side");


    sides.forEach(side => {

        side.addEventListener("click", function () {

            const sideNumber =
                Number(this.dataset.side);

            handleSideSelection(
                this,
                sideNumber
            );

        });

    });


    /*
       Sound button
    */

    const soundButton =
        document.getElementById("soundButton");

    if (soundButton) {

        soundButton.addEventListener(
            "click",
            toggleSound
        );

    }

});


/* =====================================================
   7. HANDLE SIDE SELECTION
===================================================== */

function handleSideSelection(
    sideElement,
    sideNumber
) {


    /*
       INTERNAL SIDE
    */

    if (sideNumber === 4) {

        sideElement.classList.remove("selected");

        sideElement.classList.add("wrong");

        playSound("wrong");

        showFeedback(
            "🚧 Look again! This side is inside the garden. It is a shared side, so it does not need a fence.",
            "wrong"
        );


        /*
           Remove the wrong animation
           after a short time.
        */

        setTimeout(() => {

            sideElement.classList.remove("wrong");

        }, 700);


        return;
    }


    /*
       OUTSIDE SIDE
    */

    if (!selectedSides.includes(sideNumber)) {

        selectedSides.push(sideNumber);

        sideElement.classList.add("selected");

        playSound("correct");

        showFeedback(
            "✨ Great! This side is part of the outside boundary.",
            "correct"
        );

        animateFence(sideElement);

        updateSelectedSides();

    }


    /*
       Check whether all correct outside
       sides have been selected.
    */

    checkFenceCompletion();

}


/* =====================================================
   8. FEEDBACK
===================================================== */

function showFeedback(message, type) {

    const feedback =
        document.getElementById("feedbackMessage");

    if (!feedback) return;

    feedback.innerHTML = message;

    feedback.className = "";

    if (type === "correct") {

        feedback.classList.add(
            "feedback-correct"
        );

    }

    if (type === "wrong") {

        feedback.classList.add(
            "feedback-wrong"
        );

    }

}


/* =====================================================
   9. UPDATE SELECTED SIDES
===================================================== */

function updateSelectedSides() {

    const selectedList =
        document.getElementById(
            "selectedSidesList"
        );

    if (!selectedList) return;


    if (selectedSides.length === 0) {

        selectedList.innerHTML =
            "None selected yet.";

        return;

    }


    /*
       Sort the sides so they appear
       in numerical order.
    */

    const sortedSides =
        [...selectedSides].sort(
            (a, b) => a - b
        );


    const sideText =
        sortedSides.map(side => {

            return `
                <span class="side-tag">
                    Side ${side}: ${sideLengths[side]} m
                </span>
            `;

        }).join(" + ");


    selectedList.innerHTML =
        sideText;

}


/* =====================================================
   10. CHECK FENCE COMPLETION
===================================================== */

function checkFenceCompletion() {

    const correctSides =
        [1, 2, 3, 5, 6];


    const allCorrect =
        correctSides.every(side =>
            selectedSides.includes(side)
        );


    if (!allCorrect) {

        return;

    }


    /*
       Make sure the fence is completed
    */

    perimeterCompleted = true;

    playSound("success");


    showFeedback(
        "🌸 Perfect! You found the complete outside boundary. The whole garden is ready for fencing!",
        "correct"
    );


    /*
       Make all selected fence sides glow.
    */

    const selected =
        document.querySelectorAll(
            ".clickable-side.selected"
        );

    selected.forEach(side => {

        side.classList.add("fence-complete");

    });


    /*
       Show calculation button
    */

    const button =
        document.getElementById(
            "continueCalculationButton"
        );

    if (button) {

        button.classList.remove("hidden");

    }

}


/* =====================================================
   11. FENCE ANIMATION
===================================================== */

function animateFence(sideElement) {

    /*
       Restart the CSS animation
       each time the side is selected.
    */

    sideElement.style.animation = "none";

    void sideElement.offsetWidth;

    sideElement.style.animation =
        "fenceGlow 0.8s ease";

}


/* =====================================================
   12. GO TO CALCULATION
===================================================== */

function goToCalculationLevel() {

    if (!perimeterCompleted) {

        showFeedback(
            "💡 First, find all the outside sides of the garden.",
            "wrong"
        );

        return;

    }


    playSound("click");

    showScreen("calculationScreen");

    prepareCalculation();

}


/* =====================================================
   13. PREPARE CALCULATION
===================================================== */

function prepareCalculation() {

    const expression =
        document.getElementById(
            "calculationSides"
        );

    if (!expression) return;


    /*
       IMPORTANT:
       The game shows the selected side lengths,
       but does NOT calculate the answer for the pupil.

       The pupil must do the addition.
    */

    const sortedSides =
        [...selectedSides].sort(
            (a, b) => a - b
        );


    const lengths =
        sortedSides.map(
            side => `${sideLengths[side]} m`
        );


    expression.innerHTML =
        lengths.join(" + ");


    /*
       Clear previous answer
    */

    const answerInput =
        document.getElementById(
            "perimeterAnswer"
        );

    if (answerInput) {

        answerInput.value = "";

    }


    const feedback =
        document.getElementById(
            "calculationFeedback"
        );

    if (feedback) {

        feedback.innerHTML = "";

    }


    const designButton =
        document.getElementById(
            "designGardenButton"
        );

    if (designButton) {

        designButton.classList.add("hidden");

    }

}


/* =====================================================
   14. CHECK PERIMETER
===================================================== */

function checkPerimeter() {

    const input =
        document.getElementById(
            "perimeterAnswer"
        );


    const feedback =
        document.getElementById(
            "calculationFeedback"
        );


    if (!input || !feedback) return;


    const answer =
        Number(input.value);


    /*
       Empty answer
    */

    if (input.value === "") {

        feedback.innerHTML =
            "💡 Enter your perimeter calculation first.";

        feedback.style.color = "#9a7540";

        return;

    }


    /*
       CORRECT ANSWER
    */

    if (answer === correctPerimeter) {

        playSound("success");


        feedback.innerHTML = `
            🌸✨ Wonderful work!

            <br><br>

            You correctly found the perimeter
            of the outside boundary.

            <br><br>

            The magical fence is complete! 🌷🦋
        `;


        feedback.style.color = "#4c8a54";


        createCelebration();


        const button =
            document.getElementById(
                "designGardenButton"
            );

        if (button) {

            button.classList.remove("hidden");

        }


        input.disabled = true;


        return;

    }


    /*
       WRONG ANSWER
    */

    playSound("wrong");


    feedback.innerHTML = `
        💡 Almost there!

        <br><br>

        Check the side lengths you selected
        and add all the outside sides together.

        <br><br>

        Remember:
        <strong>
        Perimeter is the total distance around
        the outside boundary.
        </strong>
    `;


    feedback.style.color = "#a96a50";

}


/* =====================================================
   15. CELEBRATION
===================================================== */

function createCelebration() {

    const symbols = [
        "🌸",
        "🌷",
        "🦋",
        "✨",
        "🌼"
    ];


    for (let i = 0; i < 12; i++) {

        const element =
            document.createElement("div");


        element.innerHTML =
            symbols[
                Math.floor(
                    Math.random() * symbols.length
                )
            ];


        element.style.position =
            "fixed";

        element.style.left =
            Math.random() * 100 + "%";

        element.style.top =
            "-30px";

        element.style.fontSize =
            "25px";

        element.style.zIndex =
            "999";


        element.style.pointerEvents =
            "none";


        document.body.appendChild(element);


        const duration =
            2000 + Math.random() * 2000;


        element.animate(
            [
                {
                    transform:
                        "translateY(0) rotate(0deg)",
                    opacity: 1
                },

                {
                    transform:
                        `translateY(${window.innerHeight + 100}px) rotate(360deg)`,
                    opacity: 0
                }
            ],
            {
                duration: duration,
                easing: "ease-out"
            }
        );


        setTimeout(() => {

            element.remove();

        }, duration);

    }

}


/* =====================================================
   16. DESIGN YOUR OWN GARDEN
===================================================== */

function goToDesignLevel() {

    playSound("click");

    showScreen("designScreen");

    gardenShapes = [];

    resetGardenDesigner();

}


/* =====================================================
   17. RESET GARDEN DESIGNER
===================================================== */

function resetGardenDesigner() {

    const garden =
        document.getElementById(
            "myGarden"
        );


    if (!garden) return;


    garden.innerHTML = `
        <div class="garden-message">

            🌸

            <p>
                Your magical garden is empty.
            </p>

            <p>
                Choose some shapes to begin!
            </p>

        </div>
    `;


    const feedback =
        document.getElementById(
            "designFeedback"
        );


    if (feedback) {

        feedback.innerHTML = "";

    }


    const finalButton =
        document.getElementById(
            "finalChallengeButton"
        );


    if (finalButton) {

        finalButton.classList.add("hidden");

    }

}


/* =====================================================
   18. ADD SHAPE TO GARDEN
===================================================== */

function addGardenShape(shapeType) {

    playSound("click");


    /*
       Limit the design to TWO shapes.

       This keeps the activity aligned with
       DSKP 6.3.1.
    */

    if (gardenShapes.length >= 2) {

        const feedback =
            document.getElementById(
                "designFeedback"
            );


        feedback.innerHTML =
            "🌿 Your garden already has two shapes. This activity focuses on combining two shapes.";


        feedback.style.color =
            "#a06f42";


        return;

    }


    gardenShapes.push(shapeType);


    renderGarden();


}


/* =====================================================
   19. RENDER GARDEN
===================================================== */

function renderGarden() {

    const garden =
        document.getElementById(
            "myGarden"
        );


    if (!garden) return;


    garden.innerHTML = "";


    gardenShapes.forEach(
        (shape, index) => {


            const element =
                document.createElement("div");


            element.classList.add(
                "design-shape"
            );


            element.dataset.index =
                index;


            if (shape === "rectangle") {

                element.classList.add(
                    "design-rectangle"
                );

                element.innerHTML =
                    "▭";

            }


            if (shape === "equilateral") {

                element.classList.add(
                    "design-equilateral"
                );

                element.innerHTML =
                    "🔺";

            }


            if (shape === "isosceles") {

                element.classList.add(
                    "design-isosceles"
                );

                element.innerHTML =
                    "🔺";

            }


            garden.appendChild(element);

        }
    );


    if (gardenShapes.length === 0) {

        garden.innerHTML = `
            <div class="garden-message">

                🌸

                <p>
                    Your magical garden is empty.
                </p>

            </div>
        `;

    }

}


/* =====================================================
   20. BUILD MY FENCE
===================================================== */

function buildMyFence() {

    if (gardenShapes.length !== 2) {

        const feedback =
            document.getElementById(
                "designFeedback"
            );


        feedback.innerHTML =
            "🌱 Choose exactly two shapes to create your combined magical garden.";

        feedback.style.color =
            "#a06f42";


        playSound("wrong");

        return;

    }


    playSound("success");


    const feedback =
        document.getElementById(
            "designFeedback"
        );


    feedback.innerHTML = `
        ✨ Beautiful garden design!

        <br><br>

        Your garden contains two combined shapes.

        <br><br>

        🌿 Now remember:
        the fence follows the
        <strong>outside boundary</strong>.

        <br><br>

        The shared side between the two shapes
        is inside the garden, so it is
        <strong>not included</strong>
        in the perimeter.
    `;


    feedback.style.color =
        "#4c8a54";


    createCelebration();


    const finalButton =
        document.getElementById(
            "finalChallengeButton"
        );


    if (finalButton) {

        finalButton.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   21. FINAL CHALLENGE
===================================================== */

function goToFinalChallenge() {

    playSound("click");

    showScreen("finalScreen");

}


/* =====================================================
   22. FINAL QUIZ
===================================================== */

function checkQuiz(isCorrect) {

    const feedback =
        document.getElementById(
            "quizFeedback"
        );


    if (!feedback) return;


    if (isCorrect) {

        quizCompleted = true;

        playSound("success");


        feedback.innerHTML = `
            🌷✨ Correct!

            <br><br>

            The perimeter includes
            the <strong>outside boundary</strong>
            of the shape.

            <br><br>

            You are ready to become
            a Magical Garden Master!
        `;


        feedback.style.color =
            "#4c8a54";


        setTimeout(() => {

            showCompletionScreen();

        }, 1800);


        return;

    }


    playSound("wrong");


    feedback.innerHTML = `
        💡 Think about where the fence goes.

        <br><br>

        A fence goes around the
        <strong>outside</strong>
        of the garden.
    `;


    feedback.style.color =
        "#a96a50";

}


/* =====================================================
   23. COMPLETION SCREEN
===================================================== */

function showCompletionScreen() {

    playSound("success");

    showScreen("completionScreen");

    createCelebration();

}


/* =====================================================
   24. RESTART GAME
===================================================== */

function restartGame() {

    playSound("click");

    selectedSides = [];

    gardenShapes = [];

    perimeterCompleted = false;

    quizCompleted = false;


    /*
       Re-enable calculation input
    */

    const input =
        document.getElementById(
            "perimeterAnswer"
        );


    if (input) {

        input.disabled = false;

        input.value = "";

    }


    resetFenceLevel();

    resetGardenDesigner();


    showScreen("welcomeScreen");

}


/* =====================================================
   25. SOUND SYSTEM
===================================================== */

/*
   We use separate audio files.

   Put these files inside:

   sounds/

   File names:

   correct.mp3
   wrong.mp3
   success.mp3
   click.mp3
*/


const sounds = {

    correct:
        new Audio("sounds/correct.mp3"),

    wrong:
        new Audio("sounds/wrong.mp3"),

    success:
        new Audio("sounds/success.mp3"),

    click:
        new Audio("sounds/click.mp3")

};


/*
   Keep sound volume gentle
   for a primary-school learning game.
*/

sounds.correct.volume = 0.45;

sounds.wrong.volume = 0.35;

sounds.success.volume = 0.5;

sounds.click.volume = 0.3;


/* =====================================================
   26. PLAY SOUND
===================================================== */

function playSound(soundName) {

    if (!soundEnabled) return;


    const sound =
        sounds[soundName];


    if (!sound) return;


    /*
       Restart the sound if it is
       already playing.
    */

    sound.currentTime = 0;


    sound.play().catch(() => {

        /*
           Some browsers block audio
           until the user interacts
           with the page.

           This is normal.
        */

    });

}


/* =====================================================
   27. SOUND ON / OFF
===================================================== */

function toggleSound() {

    soundEnabled =
        !soundEnabled;


    const button =
        document.getElementById(
            "soundButton"
        );


    if (!button) return;


    if (soundEnabled) {

        button.innerHTML = "🔊";

        button.title = "Sound ON";

        playSound("click");

    } else {

        button.innerHTML = "🔇";

        button.title = "Sound OFF";

    }

}


/* =====================================================
   28. KEYBOARD SUPPORT
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {


        /*
           Enter key on answer input
        */

        if (
            event.key === "Enter" &&
            currentScreen ===
            "calculationScreen"
        ) {

            checkPerimeter();

        }

    }
);


/* =====================================================
   29. STARTUP MESSAGE
===================================================== */

console.log(
    "🌷 Magical Garden Fence loaded successfully!"
);

console.log(
    "Created by Khairisya Damia"
);

console.log(
    "Year 5 Mathematics — DSKP 6.3.1"
);
