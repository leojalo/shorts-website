const feed = document.querySelector(".feed");

/* VIDEO FILES (EDIT COUNT IF NEEDED) */
const videos = [];
for (let i = 1; i <= 8; i++) {
  videos.push(`video${i}.mp4`);
}

/* BRAINROT TEXTS */
const brainrotTexts = [
  "bro thinks he's him",
  "npc behavior",
  "ain’t no way 💀",
  "this goes hard for no reason",
  "unhinged content",
  "brain officially rotted",
  "internet was a mistake"
];

/* PREVENT REPEATS */
let lastVideos = [];
const MAX_HISTORY = 3;

/* SHUFFLE ONCE */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(videos);

/* PICK RANDOM VIDEO (NO RECENT REPEAT) */
function getRandomVideo() {
  let available = videos.filter(v => !lastVideos.includes(v));

  if (available.length === 0) {
    available = [...videos];
  }

  const chosen = available[Math.floor(Math.random() * available.length)];

  lastVideos.push(chosen);
  if (lastVideos.length > MAX_HISTORY) {
    lastVideos.shift();
  }

  return chosen;
}

/* OBSERVER: PLAY ONLY VISIBLE VIDEO */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const short = entry.target;
      const video = short.querySelector("video");
      const progress = short.querySelector(".progress-fill");
      const brainrot = short.querySelector(".brainrot");

      if (entry.isIntersecting) {
        video.play();
        brainrot.textContent =
          brainrotTexts[Math.floor(Math.random() * brainrotTexts.length)];
      } else {
        video.pause();
        video.currentTime = 0;
        progress.style.width = "0%";
      }
    });
  },
  { threshold: 0.6 }
);

/* CREATE ONE SHORT */
function createShort() {
  const short = document.createElement("div");
  short.className = "short";

  const videoSrc = getRandomVideo();

  short.innerHTML = `
    <div class="progress">
      <div class="progress-fill"></div>
    </div>

    <video src="${videoSrc}" autoplay muted></video>
    <div class="brainrot"></div>
  `;

  feed.appendChild(short);

  const video = short.querySelector("video");
  const progress = short.querySelector(".progress-fill");

  observer.observe(short);

  video.addEventListener("loadedmetadata", () => {
    video.addEventListener("timeupdate", () => {
      if (!isNaN(video.duration)) {
        progress.style.width =
          (video.currentTime / video.duration) * 100 + "%";
      }
    });
  });
}

/* INITIAL LOAD */
for (let i = 0; i < 3; i++) {
  createShort();
}

/* INFINITE SCROLL */
feed.addEventListener("scroll", () => {
  if (feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 200) {
    createShort();
  }
});
