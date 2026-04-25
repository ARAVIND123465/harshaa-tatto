/* ============================================================
   HARSHA TATTOO STUDIO — main.js
   ============================================================ */



/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MOBILE HAMBURGER ── */
(function () {
  const ham = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!ham || !navLinks) return;
  ham.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    ham.querySelector('span:nth-child(1)').style.transform =
      navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
    ham.querySelector('span:nth-child(2)').style.opacity =
      navLinks.classList.contains('open') ? '0' : '1';
    ham.querySelector('span:nth-child(3)').style.transform =
      navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
})();

/* ── SCROLL REVEAL ── */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ── BOOKING FORM ── */
const form = document.getElementById('bookingForm');
const notif = document.getElementById('notif');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Change button text while sending
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('http://localhost:3000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Show notification on success
      notif.classList.add('show');
      setTimeout(() => notif.classList.remove('show'), 4000);
      form.reset();
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to send booking request. Please try again later.');
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

/* ── GALLERY LIGHTBOX (simple fade modal) ── */
(function () {
  const imgs = document.querySelectorAll('.gallery-img img');
  if (!imgs.length) return;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9000;
    background:rgba(0,0,0,0.92);backdrop-filter:blur(10px);
    display:flex;align-items:center;justify-content:center;
    opacity:0;pointer-events:none;transition:opacity 0.35s ease;
  `;
  const img = document.createElement('img');
  img.style.cssText = `max-width:90vw;max-height:90vh;object-fit:contain;
    border:1px solid rgba(204,163,94,0.3);
    box-shadow:0 20px 60px rgba(0,0,0,0.5);
    transition:transform 0.35s ease;transform:scale(0.92);`;
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  imgs.forEach(i => {
    i.style.cursor = 'zoom-in';
    i.addEventListener('click', () => {
      img.src = i.src;
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      setTimeout(() => { img.style.transform = 'scale(1)'; }, 10);
    });
  });
  overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    img.style.transform = 'scale(0.92)';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      img.style.transform = 'scale(0.92)';
    }
  });
})();

/* ── AI ASSISTANT WIDGET ── */
(function () {
  const aiBtn = document.getElementById('ai-floating-btn');
  const aiWindow = document.getElementById('ai-chat-window');
  const aiClose = document.getElementById('ai-close-btn');
  const aiInput = document.getElementById('ai-chat-input');
  const aiSend = document.getElementById('ai-send-btn');
  const aiBody = document.getElementById('ai-chat-body');
  const aiPopMsg = document.getElementById('ai-pop-msg');

  if (!aiBtn || !aiWindow) return;

  // Toggle chat
  aiBtn.addEventListener('click', () => {
    aiWindow.classList.remove('ai-chat-hidden');
    if (aiPopMsg) aiPopMsg.classList.add('hidden');
    aiBtn.style.transform = 'scale(0) translateY(20px)';
    aiBtn.style.opacity = '0';
    aiBtn.style.pointerEvents = 'none';
    setTimeout(() => aiInput.focus(), 300);
  });

  aiClose.addEventListener('click', () => {
    aiWindow.classList.add('ai-chat-hidden');
    aiBtn.style.transform = '';
    aiBtn.style.opacity = '1';
    aiBtn.style.pointerEvents = 'auto';
  });

  // Handle send message
  const sendMessage = () => {
    const text = aiInput.value.trim();
    if (!text) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message ai-sent';
    userMsg.textContent = text;
    aiBody.appendChild(userMsg);
    aiInput.value = '';

    aiBody.scrollTo({ top: aiBody.scrollHeight, behavior: 'smooth' });

    // Smart AI response logic based on data.ts
    const lowerText = text.toLowerCase();
    let responseText = "Thanks for reaching out! A studio artist will review your request. You can also securely fill out our <a href='#booking' style='color:var(--gold);text-decoration:underline;'>booking form</a>.";

    if (lowerText.includes("location") || lowerText.includes("where") || lowerText.includes("address")) {
      responseText = "We are located at Shivalaiya Mahal Auditorium Kalyana Mandapam, 98, 1, Ramamurthy Rd, Selvapuram, Coimbatore — 641026.";
    } else if (lowerText.includes("hour") || lowerText.includes("time") || lowerText.includes("open") || lowerText.includes("close")) {
      responseText = "We are open daily from 11:00 AM to 11:00 PM.";
    } else if (lowerText.includes("phone") || lowerText.includes("contact") || lowerText.includes("call") || lowerText.includes("number")) {
      responseText = "You can call or message us directly at 090251 60201.";
    } else if (lowerText.includes("owner") || lowerText.includes("founder") || lowerText.includes("akash")) {
      responseText = "Harsha Tattoo Studio is founded by Akash Ganeshan, an artist driven by deep passion and artistic excellence with over 8 years of experience.";
    } else if (lowerText.includes("style") || lowerText.includes("type") || lowerText.includes("kind")) {
      responseText = "Our primary styles include Custom Design, Blackwork & Geometric, Color Realism, Cover Up & Rework, Lettering & Script, Japanese / Irezumi, and Traditional.";
    } else if (lowerText.includes("parking") || lowerText.includes("park")) {
      responseText = "Yes, parking is available directly at the venue premises.";
    } else if (lowerText.includes("payment") || lowerText.includes("card") || lowerText.includes("upi") || lowerText.includes("cash")) {
      responseText = "We accept Cash, UPI, and all major cards for your convenience.";
    } else if (lowerText.includes("age") || lowerText.includes("old") || lowerText.includes("18") || lowerText.includes("minor")) {
      responseText = "You must be 18 years and above to get a tattoo. A valid government-issued ID is required.";
    } else if (lowerText.includes("walk in") || lowerText.includes("walk-in") || lowerText.includes("appointment") || lowerText.includes("book")) {
      responseText = "Walk-ins are welcome, but appointments are highly preferred. We offer free design consultations before every session!";
    } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("charge")) {
      responseText = "Pricing depends heavily on the complexity, size, and placement of your desired piece. We recommend a free consultation to give you an accurate quote!";
    } else if (lowerText.includes("safe") || lowerText.includes("hygiene") || lowerText.includes("needle")) {
      responseText = "100% sterile equipment! All our needles are single-use and sterile. Strict hygiene protocols are maintained at all times.";
    }

    // Bot typing delay effect
    setTimeout(() => {
      const resp = document.createElement('div');
      resp.className = 'ai-message ai-received';
      resp.innerHTML = responseText;
      aiBody.appendChild(resp);
      aiBody.scrollTo({ top: aiBody.scrollHeight, behavior: 'smooth' });
    }, 600);
  };

  aiSend.addEventListener('click', sendMessage);
  aiInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });
})();
