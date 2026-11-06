const gate = document.querySelector("#gate");
const gateImage = document.querySelector("#gate-image");
const dialogueText = document.querySelector("#dialogue-text");
const nameForm = document.querySelector("#name-form");
const humanName = document.querySelector("#human-name");
const verificationStatus = document.querySelector("#verification-status");
const success = document.querySelector("#success");
const proceedButton = document.querySelector("#proceed-invite");
const successName = document.querySelector("#success-name");
const videoFailure = document.querySelector("#video-failure");
const failureVideo = document.querySelector("#failure-video");
const replayButton = document.querySelector("#replay-invite");
const musicButton = document.querySelector("#music-toggle");
const musicLabel = document.querySelector("#music-label");
const invitation = document.querySelector("#invitation");
const storyCard = document.querySelector(".card");
const storyIntro = document.querySelector("#story-intro");
const storyBody = document.querySelector("#story-body");
const storyShout = document.querySelector("#story-shout");
const storyQuestion = document.querySelector("#story-question");
const choices = document.querySelector("#choices");
const choiceResponse = document.querySelector("#choice-response");
const choiceFollowup = document.querySelector("#choice-followup");
const detailsToggle = document.querySelector("#details-toggle");
const detailsIcon = document.querySelector(".details-icon");
const inviteLetter = document.querySelector("#invite-letter");
const closeDetails = document.querySelector("#close-details");
const fallingIcons = document.querySelector("#falling-icons");
const choiceButtons = document.querySelectorAll("[data-choice]");

let audioContext;
let musicPlaying = false;
const musicTrack = Math.floor(Math.random() * 7) + 1;
const musicAudio = new Audio(`assets/track_${String(musicTrack).padStart(3, "0")}.mp3`);
musicAudio.loop = true;
let storyRun = 0;
let verificationTimer;

function playChime() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext = audioContext || new AudioContext();
  const now = audioContext.currentTime;
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.0001, now + index * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.07, now + index * 0.1 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.1 + 1.2);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now + index * 0.1);
    oscillator.stop(now + index * 0.1 + 1.25);
  });

}

function toggleMusic() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext = audioContext || new AudioContext();
  if (musicPlaying) {
    musicAudio.pause();
    musicPlaying = false;
    musicLabel.textContent = "play some tunes";
    musicButton.setAttribute("aria-pressed", "false");
    return;
  }
  musicPlaying = true;
  musicLabel.textContent = "stop playing";
  musicButton.setAttribute("aria-pressed", "true");
  musicAudio.play().catch(() => {
    musicPlaying = false;
    musicLabel.textContent = "play some tunes";
    musicButton.setAttribute("aria-pressed", "false");
  });
}

window.setTimeout(() => {
  dialogueText.hidden = true;
  nameForm.hidden = false;
  humanName.focus();
}, 3000);

function showFailure() {
  gate.hidden = true;
  videoFailure.hidden = false;
  failureVideo.muted = false;
  failureVideo.play().catch(() => {
    failureVideo.muted = true;
    failureVideo.play().catch(() => {});
  });
}

function openInvitation() {
  gate.hidden = true;
  invitation.hidden = false;
  invitation.setAttribute("aria-hidden", "false");
  invitation.classList.add("visible");
  typeStory();
}

function typeText(element, text, run, delay = 42) {
  return new Promise((resolve) => {
    let index = 0;
    const typeNext = () => {
      if (run !== storyRun) {
        resolve();
        return;
      }
      element.textContent += text[index];
      index += 1;
      if (index >= text.length) {
        resolve();
        return;
      }
      window.setTimeout(typeNext, delay);
    };
    typeNext();
  });
}

async function typeStory() {
  storyRun += 1;
  const run = storyRun;
  storyIntro.textContent = "";
  storyBody.textContent = "";
  storyShout.textContent = "";
  storyQuestion.textContent = "";
  choices.hidden = true;
  choiceResponse.textContent = "";
  choiceFollowup.textContent = "";
  detailsToggle.hidden = true;
  inviteLetter.hidden = true;
  detailsIcon.setAttribute("aria-expanded", "false");
  detailsIcon.setAttribute("aria-expanded", "false");
  await typeText(storyIntro, "The story of this bday's commemoration is an unlucky one ⁽ᵒʳ ᶦˢ ᶦᵗᵗᵗᵗ⁾.", run);
  await typeText(storyBody, "Due to scheduling conflicts, it was first pushed from the 3rd to the 5th, then from the 5th to the 7th. And then yours truly came to their senses and remembered:", run);
  if (run !== storyRun) return;
  await typeText(storyShout, "ENDSEMS ARE BASICALLY HERE.", run, 180);
  await typeText(storyQuestion, "So, a change was made in the plans . . . can you guess what they shall be now?", run);
  if (run === storyRun) choices.hidden = false;
}

function replayInvitation() {
  storyRun += 1;
  invitation.classList.remove("visible");
  invitation.hidden = true;
  invitation.setAttribute("aria-hidden", "true");
  gate.hidden = false;
  document.body.classList.remove("allowed");
  gateImage.src = "assets/stop.png";
  dialogueText.hidden = false;
  nameForm.hidden = true;
  success.hidden = true;
  verificationStatus.hidden = true;
  humanName.disabled = false;
  nameForm.querySelector("button").disabled = false;
  nameForm.querySelector("label").hidden = false;
  humanName.hidden = false;
  nameForm.querySelector("button").hidden = false;
  window.clearInterval(verificationTimer);
  humanName.value = "";
  choices.hidden = true;
  choiceResponse.textContent = "";
  choiceFollowup.textContent = "";
  detailsToggle.hidden = true;
  inviteLetter.hidden = true;
  window.setTimeout(() => {
    dialogueText.hidden = true;
    nameForm.hidden = false;
    humanName.focus();
  }, 3000);
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const allowedNames = ["jujhar", "jesika", "vanshika", "ankila", "aditi", "pragati", "devansh", "virat", "aditya",
                        "jujhar singh", "jesika poonia", "vanshika agarwal", "ankila bajaj", "aditi srivastava", "pragati jain", "devansh tandon", "virat sahlot", "aditya kalra",
                        "jujhi", "jesu", "vanshi", "anki", "adeetee", "pragga", "litchi", "veera", "kalra"];
  const firstName = humanName.value.trim().split(/\s+/)[0];
  const submitButton = nameForm.querySelector("button");
  const nameLabel = nameForm.querySelector("label");
  let dots = 1;

  humanName.disabled = true;
  submitButton.disabled = true;
  nameLabel.hidden = true;
  humanName.hidden = true;
  submitButton.hidden = true;
  verificationStatus.hidden = false;
  verificationStatus.textContent = ".";
  verificationTimer = window.setInterval(() => {
    dots += 1;
    verificationStatus.textContent = ".".repeat(dots);
    if (dots === 3) {
      window.clearInterval(verificationTimer);
    }
  }, 350);

  window.setTimeout(() => {
    window.clearInterval(verificationTimer);
    verificationStatus.hidden = true;
    if (!allowedNames.includes(firstName.toLowerCase())) {
      showFailure();
      return;
    }
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    successName.textContent = formattedName;
    document.body.classList.add("allowed");
    gateImage.src = "assets/happyjesus1.png";
    dialogueText.hidden = true;
    nameForm.hidden = true;
    success.hidden = false;
    proceedButton.focus();
  }, 1400);
});

proceedButton.addEventListener("click", openInvitation);
replayButton.addEventListener("click", replayInvitation);
musicButton.addEventListener("click", toggleMusic);

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.choice === "diwali") {
      choiceResponse.innerHTML = "Yeeeep that's right!";
      choiceButtons.forEach((choiceButton) => {
        choiceButton.disabled = true;
      });
      const run = storyRun;
      choiceFollowup.innerHTML = 'I shall be <s id="hijack-word"></s><span id="followup-rest"></span>';
      typeText(document.querySelector("#hijack-word"), "hijacking", run).then(() => {
        return typeText(document.querySelector("#followup-rest"), " merging my bday revelries with those of our lovely festival this Sunday.", run);
      }).then(() => {
        if (run === storyRun) detailsToggle.hidden = false;
      });
      return;
    }
    choiceFollowup.textContent = "";
    choiceResponse.textContent = "Come on don't be silly- try againnnn";
  });
});

detailsIcon.addEventListener("click", () => {
  inviteLetter.hidden = !inviteLetter.hidden;
  detailsIcon.setAttribute("aria-expanded", String(!inviteLetter.hidden));
  if (!inviteLetter.hidden) {
    createFallingIcons();
    closeDetails.focus();
  }
});

closeDetails.addEventListener("click", () => {
  inviteLetter.hidden = true;
  detailsIcon.setAttribute("aria-expanded", "false");
  detailsIcon.focus();
});

function createFallingIcons() {
  fallingIcons.replaceChildren();
  const icons = [
    "🎂", "🪔", "🎈", "🪔", "🎂", "🪔", "🎈",
    "🎂", "🪔", "🎈", "🪔", "🎂", "🎈",
    "🪔", "🎂", "🎈", "🪔", "🎂", "🪔", "🎈",
    "🪔", "🎂", "🎈", "🪔", "🎂", "🎈"
  ];
  icons.forEach((icon, index) => {
    const element = document.createElement("span");
    element.className = "falling-icon";
    element.textContent = icon;
    element.style.left = `${4 + (index * 17) % 94}%`;
    element.style.setProperty("--fall-delay", `${(index % 6) * 0.7}s`);
    element.style.setProperty("--fall-duration", `${5 + (index % 4)}s`);
    element.style.setProperty("--fall-drift", `${index % 2 ? 35 : -35}px`);
    fallingIcons.append(element);
  });
}
