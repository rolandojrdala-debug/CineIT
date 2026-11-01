// ==========================================

    // THEME TOGGLE LOGIC

    // ==========================================

    const themeToggle = document.getElementById("themeToggle");

    let currentTheme = localStorage.getItem("cineit-theme") || "dark";



    function applyTheme() {

      document.documentElement.setAttribute("data-theme", currentTheme);

      themeToggle.textContent = currentTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

    }



    applyTheme();



    themeToggle.addEventListener("click", () => {

      currentTheme = currentTheme === "dark" ? "light" : "dark";

      localStorage.setItem("cineit-theme", currentTheme);

      applyTheme();

    });



    // ==========================================

    // AUTH TABS LOGIC

    // ==========================================

    const tabBtns = document.querySelectorAll('.tab-btn');

    const authForms = document.querySelectorAll('.auth-form');



    tabBtns.forEach(btn => {

      btn.addEventListener('click', () => {

        // Remove active class from all

        tabBtns.forEach(b => b.classList.remove('active'));

        authForms.forEach(f => f.classList.remove('active'));



        // Add active class to clicked tab and corresponding form

        btn.classList.add('active');

        document.getElementById(btn.dataset.target).classList.add('active');

      });

    });



    // ==========================================

    // CAROUSEL LOGIC

    // ==========================================

    const track = document.getElementById('track');

    const slides = document.querySelectorAll('.carousel-slide');

    const prevBtn = document.getElementById('prevBtn');

    const nextBtn = document.getElementById('nextBtn');

    const dots = document.querySelectorAll('.dot');

    const carouselContainer = document.getElementById('carousel');



    let currentIndex = 0;

    let autoPlayInterval;



    function updateCarousel() {

      // Move track

      track.style.transform = \`translateX(-${currentIndex * 100}%)\`;



      // Update dots

      dots.forEach(dot => dot.classList.remove('active'));

      dots[currentIndex].classList.add('active');

    }



    function nextSlide() {

      currentIndex = (currentIndex + 1) % slides.length;

      updateCarousel();

    }



    function prevSlide() {

      currentIndex = (currentIndex - 1 + slides.length) % slides.length;

      updateCarousel();

    }



    // Event Listeners for Controls

    nextBtn.addEventListener('click', nextSlide);

    prevBtn.addEventListener('click', prevSlide);



    dots.forEach(dot => {

      dot.addEventListener('click', (e) => {

        currentIndex = parseInt(e.target.dataset.index);

        updateCarousel();

      });

    });



    // Auto-play feature

    function startAutoPlay() {

      autoPlayInterval = setInterval(nextSlide, 4000); // 4 seconds

    }



    function stopAutoPlay() {

      clearInterval(autoPlayInterval);

    }



    // Pause on hover

    carouselContainer.addEventListener('mouseenter', stopAutoPlay);

    carouselContainer.addEventListener('mouseleave', startAutoPlay);



    // Initialize auto-play

    startAutoPlay();
