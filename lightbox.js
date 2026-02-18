const images = document.querySelectorAll(".galleri img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
const nextBtn = document.querySelector(".right");
const prevBtn = document.querySelector(".left");
const footer = document.getElementById("footer");

let currentIndex = 0;

function showImage(index) {
  currentIndex = index;
  lightboxImg.src = images[currentIndex].src;
  lightbox.style.display = "flex";
  footer.classList.add("hidden");
}

images.forEach((img, index) => {
  img.addEventListener("click", () => showImage(index));
});

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex =
    (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
  footer.classList.remove("hidden");
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
    footer.classList.remove("hidden");
  }
});

document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") {
        lightbox.style.display = "none";
        footer.classList.remove("hidden");
   }
  }
});

document.querySelectorAll("img").forEach(img => {
  img.addEventListener("contextmenu", e => e.preventDefault());
});

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  // hvor langt må du swipe for å trigge
  const threshold = 50;

  if (swipeDistance > threshold) {
    prevImage(); // swipe høyre
  }

  if (swipeDistance < -threshold) {
    nextImage(); // swipe venstre
  }
}

import { doc, getDoc, setDoc, updateDoc, increment }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function updateUniqueVisitors() {

  const today = new Date().toISOString().split("T")[0];
  const storedDate = localStorage.getItem("lastVisitDate");

  const counterRef = doc(db, "siteStats", "uniqueVisitors");
  const snap = await getDoc(counterRef);

  if (storedDate !== today) {

    if (snap.exists()) {
      await updateDoc(counterRef, {
        count: increment(1)
      });
    } else {
      await setDoc(counterRef, {
        count: 1
      });
    }

    localStorage.setItem("lastVisitDate", today);
  }

  const updatedSnap = await getDoc(counterRef);

  if (updatedSnap.exists()) {
    document.getElementById("visitorCount").textContent =
      updatedSnap.data().count;
  }
}

updateUniqueVisitors();



