//  * ALFA HUBS - CUSTOM JAVASCRIPT
//  * @author Mohammed Sabry (Mohammedsabry13)
//  * @github https://github.com/Mohammedsabry13
//  * @copyright 2026 Mohammed Sabry. All rights reserved.
//  * Pure JavaScript with Bootstrap 5

document.addEventListener("DOMContentLoaded", () => {
  // Dark Mode Toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const icon = darkModeToggle.querySelector("i");

  // Check for saved user preference
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    body.classList.add("dark-mode");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    icon.classList.add("text-warning");
  }

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      icon.classList.add("text-warning");
      localStorage.setItem("theme", "dark");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.remove("text-warning");
      icon.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    }
  });

  // Scroll Animation Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // Particle Animation System
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationFrameId;

  // Resize canvas to full window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = body.classList.contains("dark-mode")
        ? `rgba(76, 175, 80, ${this.opacity})`
        : `rgba(76, 175, 80, ${this.opacity * 0.6})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  function initParticles() {
    particles = [];
    const particleCount = Math.min(
      100,
      Math.floor((canvas.width * canvas.height) / 15000),
    );
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Animation loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Connect nearby particles
    connectParticles();

    animationFrameId = requestAnimationFrame(animateParticles);
  }

  // Connect particles with lines
  function connectParticles() {
    const maxDistance = 150;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;
          ctx.strokeStyle = body.classList.contains("dark-mode")
            ? `rgba(76, 175, 80, ${opacity})`
            : `rgba(76, 175, 80, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Mouse interaction with particles
  let mouse = {
    x: null,
    y: null,
    radius: 150,
  };

  canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;

    // Push particles away from mouse
    particles.forEach((particle) => {
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        particle.x += Math.cos(angle) * force * 3;
        particle.y += Math.sin(angle) * force * 3;
      }
    });
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Start particle animation
  initParticles();
  animateParticles();

  // Navbar scroll effect
  let lastScroll = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
      navbar.style.padding = "0.5rem 0";
    } else {
      navbar.style.boxShadow = "";
      navbar.style.padding = "";
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add typing effect to hero title
  const heroTitle = document.querySelector(".hero-bg h1");
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = "";
    let charIndex = 0;

    function typeWriter() {
      if (charIndex < text.length) {
        heroTitle.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50);
      }
    }

    // Start typing after a short delay
    setTimeout(() => {
      typeWriter();
    }, 500);
  }

  // Add floating animation to category icons
  const categoryIcons = document.querySelectorAll(".category-icon i");
  categoryIcons.forEach((icon, index) => {
    icon.style.animation = `float 3s ease-in-out ${index * 0.5}s infinite`;
  });

  // Create floating animation keyframes dynamically
  const style = document.createElement("style");
  style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
  document.head.appendChild(style);

  // Search functionality placeholder
  const searchButton = document.querySelector(".input-group .btn-success");
  const searchInput = document.querySelector(".input-group input");

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        console.log("Searching for:", searchTerm);
        // Add your search logic here
      }
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchButton.click();
      }
    });
  }

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add ripple styles
  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(rippleStyle);

  console.log("eetrade website loaded with enhanced animations!");
});
