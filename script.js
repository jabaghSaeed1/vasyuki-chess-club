document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. PARTICIPANT CAROUSEL (Infinite + 4s Autoplay)
    // =========================================
    const track = document.getElementById('participantTrack');
    const cards = document.querySelectorAll('.participant-card');
    
    const prevBtnDesktop = document.getElementById('prevBtnDesktop');
    const nextBtnDesktop = document.getElementById('nextBtnDesktop');
    const prevBtnMobile = document.getElementById('prevBtnMobile');
    const nextBtnMobile = document.getElementById('nextBtnMobile');
    
    const fractionDesktop = document.getElementById('fractionDesktop');
    const carouselDots = document.getElementById('carouselDots');

    let currentIndex = 0;
    const totalCards = cards.length;
    let cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    let autoplayTimer; // Variable to hold our 4-second timer

    // Create Mobile Dots
    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoplay(); // Reset timer on manual click
        });
        carouselDots.appendChild(dot);
    }
    const dots = document.querySelectorAll('#carouselDots .dot');

    function updateCarousel() {
        const maxIndex = totalCards - cardsPerView;
        
        // Infinite Loop wrapping
        if (currentIndex > maxIndex) currentIndex = 0; 
        else if (currentIndex < 0) currentIndex = maxIndex;

        const cardWidth = 100 / cardsPerView;
        track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;

        // Update fraction (e.g., "3 / 6")
        let displayEnd = currentIndex + cardsPerView;
        if(fractionDesktop) fractionDesktop.textContent = `${displayEnd} / ${totalCards}`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Next/Prev Logic
    function nextSlide() {
        currentIndex++;
        updateCarousel();
    }
    function prevSlide() {
        currentIndex--;
        updateCarousel();
    }

    // Attach click listeners with Autoplay Resets
    if(prevBtnDesktop) prevBtnDesktop.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
    if(prevBtnMobile) prevBtnMobile.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
    if(nextBtnDesktop) nextBtnDesktop.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if(nextBtnMobile) nextBtnMobile.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

    // Autoplay Functions
    function startAutoplay() {
        autoplayTimer = setInterval(nextSlide, 4000); // Changes slide every 4 seconds
    }
    function resetAutoplay() {
        clearInterval(autoplayTimer); // Stop current timer
        startAutoplay(); // Start a fresh 4 seconds
    }

    // Handle Window Resize
    window.addEventListener('resize', () => {
        cardsPerView = window.innerWidth <= 768 ? 1 : 3;
        updateCarousel();
    });

    // Initialize Carousel and start the 4-second loop
    updateCarousel();
    startAutoplay();


    // =========================================
    // 2. STEPS MOBILE SCROLL TRACKER (No Autoplay, No Loop)
    // =========================================
    const stepsSlider = document.getElementById('stepsSlider');
    const stepsGroups = document.querySelectorAll('.step-group');
    const stepsDotsContainer = document.getElementById('stepsDots');
    const prevStepBtn = document.getElementById('prevStepBtnMobile');
    const nextStepBtn = document.getElementById('nextStepBtnMobile');
    
    if(stepsSlider && stepsDotsContainer) {
        stepsGroups.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            stepsDotsContainer.appendChild(dot);
        });
        
        const stepDots = document.querySelectorAll('#stepsDots .dot');

        // Allow buttons to scroll the cards
        const scrollSteps = (direction) => {
            const cardWidth = stepsSlider.offsetWidth;
            stepsSlider.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
        };

        if(prevStepBtn) prevStepBtn.addEventListener('click', () => scrollSteps(-1));
        if(nextStepBtn) nextStepBtn.addEventListener('click', () => scrollSteps(1));

        // Update dots and button states on manual scroll
        stepsSlider.addEventListener('scroll', () => {
            if (window.innerWidth > 768) return; 
            
            let scrollPos = stepsSlider.scrollLeft;
            let cardWidth = stepsSlider.offsetWidth;
            let activeIndex = Math.round(scrollPos / cardWidth);
            
            stepDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });

            // Disable buttons if at the start or end of the steps (Strictly enforces NO LOOP)
            if(prevStepBtn) prevStepBtn.disabled = activeIndex === 0;
            if(nextStepBtn) nextStepBtn.disabled = activeIndex === stepDots.length - 1;
        });
    }

    // =========================================
    // 3. SCROLL REVEAL ANIMATIONS
    // =========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); 
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" 
    });

    revealElements.forEach(el => revealObserver.observe(el));
});