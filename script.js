// ==================== Firebase ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

//BG MUSIK
document.addEventListener("click", () => {
  const audio = document.getElementById("bg-music");
  audio.muted = false; // aktifkan suara setelah user klik
});
const bgMusic = document.getElementById("bg-music");
const toggleBtn = document.getElementById("music-toggle");

// aktifkan suara setelah ada interaksi pertama
document.addEventListener(
  "click",
  () => {
    if (bgMusic.muted) {
      bgMusic.muted = false;
      bgMusic.play().catch((err) => console.log("Autoplay gagal:", err));
    }
  },
  { once: true }
);

// Toggle musik manual
toggleBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    toggleBtn.textContent = "🔊"; // icon nyala
  } else {
    bgMusic.pause();
    toggleBtn.textContent = "🔇"; // icon mati
  }
});

// GANTI dengan config Firebase-mu
const firebaseConfig = {
  apiKey: "AIzaSyAaMCQeaHor_YwzudAjj1MOhYG5IOnmrGw",
  authDomain: "undangan-aqiqah-bd7be.firebaseapp.com",
  projectId: "undangan-aqiqah-bd7be",
  storageBucket: "undangan-aqiqah-bd7be.firebasestorage.app",
  messagingSenderId: "303640164111",
  appId: "1:303640164111:web:c627a45acc95e6a3c6f07a",
  measurementId: "G-4BN7CXRJVN",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==================== Guestbook ====================
const guestForm = document.getElementById("guestForm");
const nameInput = document.getElementById("name");
const statusInput = document.getElementById("status");
const messageInput = document.getElementById("message");
const entriesEl = document.getElementById("entries");
const loader = document.getElementById("loader");
const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

const colRef = collection(db, "guestbook_entries");

// Tambah entri
guestForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  const status = statusInput.value; // ambil status

  if (!name || !message || !status) return;

  try {
    await addDoc(colRef, {
      name,
      message,
      status, // simpan status
      createdAt: serverTimestamp(),
    });
    nameInput.value = "";
    messageInput.value = "";
    statusInput.value = "";
  } catch (err) {
    console.error("Gagal kirim:", err);
    alert("Terjadi kesalahan. Coba lagi.");
  }
});

// Listener realtime
const q = query(colRef, orderBy("createdAt", "desc"), limit(100));
onSnapshot(q, (snapshot) => {
  loader.style.display = "none";
  entriesEl.innerHTML = "";
  if (snapshot.empty) {
    entriesEl.innerHTML = "<li>Tidak ada entri.</li>";
    return;
  }
  snapshot.forEach((doc) => {
    const data = doc.data();
    const t =
      data.createdAt && data.createdAt.toDate
        ? data.createdAt.toDate()
        : new Date();
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="meta">${escapeHtml(
        data.name || "Tamu"
      )} · ${t.toLocaleString()}
       <br><small>Status: ${escapeHtml(
         data.status || "Tidak diketahui"
       )}</small>
       </div>
      <div class="msg">${escapeHtml(data.message || "")}</div>
    `;
    entriesEl.appendChild(li);
  });
});

// XSS protection
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("\n", "<br>");
}

// ==================== Countdown ====================
// === Countdown (module-safe) ===
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Gunakan konstruktor numeric agar konsisten: monthIndex dimulai 0 => 9 = Oktober
    const countdownDate = new Date(2025, 9, 11, 13, 0, 0).getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
      console.warn(
        "Countdown: salah satu elemen (days/hours/minutes/seconds) tidak ditemukan."
      );
      return;
    }

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function updateCountdown() {
      const now = Date.now();
      const distance = countdownDate - now;

      if (distance <= 0) {
        daysEl.textContent = "0";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        // Optional: lakukan sesuatu saat waktu tercapai
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = String(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    updateCountdown(); // update langsung
    const timerId = setInterval(updateCountdown, 1000);
  } catch (err) {
    console.error("Countdown error (module):", err);
  }
});



