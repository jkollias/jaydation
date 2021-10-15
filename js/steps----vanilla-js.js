/* Step Functions */

const steps = ['#step-1', '#step-2', '#step-3', '#step-4'];
const prevBtn = document.querySelector(".previous-btn");
const nextBtn = document.querySelector(".next-btn");
const findMyShade = true;

function currentStep() {
    let currentStep = document.querySelector(".current-step");
    return currentStep.id;
}

function removeCurrentStepFromSteps() {
    for (step of steps) {
        document.querySelector(step).classList.remove("current-step");
    }
}

function findPrevStep() {
    current = currentStep().replace("step-", "");
    current = parseInt(current, 10);
    let prevStep = "step-" + (current - 1);
    prevBtn.setAttribute("data-prev-step", prevStep)
    nextBtn.setAttribute("data-next-step", currentStep());
    return prevStep;
}

function findNextStep() {
    current = currentStep().replace("step-", "");
    current = parseInt(current, 10);
    let nextStep = "step-" + (current + 1);
    prevBtn.setAttribute("data-prev-step", currentStep())
    nextBtn.setAttribute("data-next-step", nextStep);
    return nextStep;
}

function yourOnTheFinalStep() {
    let finalStep = "#" + currentStep() == steps[steps.length - 1];
    return finalStep;
}

function yourOnTheFirstStep() {
    let firstStep = "#" + currentStep() == steps[0];
    return firstStep;
}

function goToFirstStep() {
    removeCurrentStepFromSteps();
    document.querySelector('#step-1').classList.add("current-step");
    console.log("First Step");
}

function goToFinalStep() {
    removeCurrentStepFromSteps();
    document.querySelector('#step-4').classList.add("current-step");
    console.log("Final Step");
}

function goToPrevStep() {
    prevStep = document.querySelector("#" + findPrevStep());
    removeCurrentStepFromSteps();
    prevStep.classList.add("current-step");
}

function goToNextStep() {
    nextStep = document.querySelector("#" + findNextStep());
    removeCurrentStepFromSteps();
    nextStep.classList.add("current-step");
}

nextBtn.addEventListener("click", function() {
    if (findMyShade) {
        if (yourOnTheFinalStep()) {
            console.log("Dont do anything");
        } else {
            goToNextStep();
        }
    } else {
        goToFinalStep();
    }
});


prevBtn.addEventListener("click", function() {
    if (findMyShade) {
        if (yourOnTheFirstStep()) {
            console.log(yourOnTheFirstStep());
            console.log("Dont do anything");
        } else {
            goToPrevStep();
        }

    } else {
        goToFirstStep();
    }
});