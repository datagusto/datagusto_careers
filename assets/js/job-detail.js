    // ---- prevent auto-scroll / enforce top on initial page load ----
    if (!window.location.hash) {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
      window.addEventListener('load', () => {
        window.scrollTo(0, 0);
      });
    }

    // ---- role accordion ----
    document.querySelectorAll('.role-head').forEach(h => {
      h.addEventListener('click', () => {
        const b = h.parentElement, body = b.querySelector('.role-body');
        const open = b.classList.contains('open');
        if (open) { b.classList.remove('open'); body.style.maxHeight = null; }
        else { b.classList.add('open'); body.style.maxHeight = body.scrollHeight + 'px'; }
      });
    });
    // pre-open first role block
    document.querySelectorAll('.role-block.open .role-body').forEach(b => {
      b.style.maxHeight = b.scrollHeight + 'px';
    });

    // ---- faq accordion ----
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const it = q.parentElement, a = it.querySelector('.faq-a');
        const open = it.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o => {
          if (o !== it) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; }
        });
        if (open) { it.classList.remove('open'); a.style.maxHeight = null; }
        else { it.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });

    // ---- scroll reveal ----
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 0.08 + 's';
      io.observe(el);
    });

    // ---- floating cta + nav hide on scroll ----
    const fc = document.getElementById('floatCta'), nav = document.getElementById('nav');
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 620) fc.classList.add('show'); else fc.classList.remove('show');
      if (y > lastY && y > 200) nav.style.transform = 'translateY(-100%)';
      else nav.style.transform = 'translateY(0)';
      lastY = y;
    });

    // ---- member tab switching logic ----
    const tabButtons = document.querySelectorAll('.member-tab-btn');
    const containers = document.querySelectorAll('.interview-story-container');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const member = btn.getAttribute('data-member');

        // Update buttons active class
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update containers active class
        containers.forEach(c => {
          if (c.id === `member-${member}`) {
            c.classList.add('active');
            // Reset its carousel to first slide
            const slides = c.querySelector('.story-slides');
            if (slides) {
              slides.style.transform = 'translateX(0%)';
            }
            const dots = c.querySelectorAll('.story-dot');
            dots.forEach((dot, idx) => {
              if (idx === 0) dot.classList.add('active');
              else dot.classList.remove('active');
            });
          } else {
            c.classList.remove('active');
          }
        });
      });
    });

    // ---- storyboard carousel logic (generic) ----
    document.querySelectorAll('.story-carousel').forEach(carousel => {
      const slides = carousel.querySelector('.story-slides');
      const dotsContainer = carousel.querySelector('.story-dots');
      const prevBtn = carousel.querySelector('.prev-story-btn');
      const nextBtn = carousel.querySelector('.next-story-btn');
      const allSlides = carousel.querySelectorAll('.story-slide');
      const totalSlides = allSlides.length;
      let currentSlide = 0;

      // Clear and Create dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('div');
          dot.classList.add('story-dot');
          if (i === 0) dot.classList.add('active');
          dot.addEventListener('click', () => goToSlide(i));
          dotsContainer.appendChild(dot);
        }
      }

      const dots = carousel.querySelectorAll('.story-dot');

      function updateCarousel() {
        if (slides) slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
          if (index === currentSlide) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }

      function goToSlide(n) {
        currentSlide = n;
        updateCarousel();
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          updateCarousel();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentSlide = (currentSlide + 1) % totalSlides;
          updateCarousel();
        });
      }
    });

    // ---- youtube timestamp jump ----
    document.querySelectorAll('.timestamp-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const seconds = link.getAttribute('data-time');
        const iframe = document.getElementById('interviewVideo');
        if (iframe) {
          iframe.src = `https://www.youtube.com/embed/M7lc1UVf-VE?start=${seconds}&autoplay=1&enablejsapi=1`;
        }
      });
    });
