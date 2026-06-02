document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Scroll Spy Navigation & Entrance Animations (Scroll Reveal)
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');

  // Entrance animations using IntersectionObserver - triggers every time a section is scrolled onto
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        // Reset active state when scrolled out of view to allow animation to re-play
        entry.target.classList.remove('active');
      }
    });
  }, {
    threshold: 0.15 // Trigger when 15% of the section is visible
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Active Nav Link Spy on Scroll & Auto-Centering Navigation Pills
  let lastActiveSection = '';
  let isInitialLoad = true;

  const scrollSpy = () => {
    let currentActive = '';
    const scrollPosition = window.scrollY + window.innerHeight * 0.4;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // Checking bounds to see which full-page section is active
      if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
        currentActive = section.getAttribute('id');
      }
    });

    // End of page condition
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60) {
      currentActive = 'contact';
    }

    if (currentActive && currentActive !== lastActiveSection) {
      lastActiveSection = currentActive;

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActive}`) {
          link.classList.add('active');
          
          // Auto-scroll the active link to the center of the viewport on mobile
          link.scrollIntoView({
            behavior: isInitialLoad ? 'auto' : 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      });
      isInitialLoad = false;
    }
  };

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Initial run

  // Nav Links Smooth Scroll - Disable Snap Temporarily during jump for buttery motion
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Disable scroll snapping temporarily to prevent stutter
        document.documentElement.style.scrollSnapType = 'none';
        
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });

        // Re-enable scroll snap after smooth scrolling completes
        setTimeout(() => {
          // Re-enable only if viewport fits full-screen constraints
          if (window.innerWidth > 768 && window.innerHeight >= 700) {
            document.documentElement.style.scrollSnapType = 'y mandatory';
          }
        }, 800);
      }
    });
  });

  /* ==========================================================================
     2. 3D Cursor Parallax Tilt for Cards
     ========================================================================== */
  const applyTiltEffect = (cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; 
      const rotateY = ((x - centerX) / centerX) * 6;  

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  };

  applyTiltEffect('skills-card');

  /* ==========================================================================
     3. Background Elements & Hero Panel Mouse Motion
     ========================================================================== */
  const heroPanel = document.getElementById('hero-skew');
  const heroSection = document.getElementById('hero');
  
  if (heroSection && heroPanel) {
    heroSection.addEventListener('mousemove', (e) => {
      const xOffset = (e.clientX / window.innerWidth - 0.5) * 15;
      const yOffset = (e.clientY / window.innerHeight - 0.5) * 10;
      heroPanel.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
    
    heroSection.addEventListener('mouseleave', () => {
      heroPanel.style.transform = 'translate(0px, 0px)';
    });
  }

  /* ==========================================================================
     4. 3D Perspective Coverflow Carousel (Posters)
     ========================================================================== */
  const carouselStage = document.getElementById('carousel-stage');
  const carouselItems = document.querySelectorAll('.carousel-item');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  let currentCarouselIndex = 1; 
  const totalCarouselItems = carouselItems.length;
  
  // Shared drag safety flag to prevent lightbox click triggers while swiping
  let wasDragging = false;

  const updateCarousel = () => {
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth > 480 && window.innerWidth <= 768;

    let baseTranslate = 150;
    let offsetSpacing = 70;
    let zActive = 100;
    let zBaseInactive = 30;
    let zOffsetInactive = 60;
    let rotateYVal = 32;

    if (isMobile) {
      baseTranslate = 90;
      offsetSpacing = 35;
      zActive = 50;
      zBaseInactive = 10;
      zOffsetInactive = 40;
      rotateYVal = 20;
    } else if (isTablet) {
      baseTranslate = 120;
      offsetSpacing = 50;
      zActive = 80;
      zBaseInactive = 20;
      zOffsetInactive = 50;
      rotateYVal = 26;
    }

    carouselItems.forEach((item, index) => {
      let offset = index - currentCarouselIndex;

      if (offset < -totalCarouselItems / 2) offset += totalCarouselItems;
      else if (offset > totalCarouselItems / 2) offset -= totalCarouselItems;

      const absOffset = Math.abs(offset);

      if (offset === 0) {
        item.style.transform = `translate3d(0, 0, ${zActive}px) rotateY(0deg) scale(1.1)`;
        item.style.zIndex = 100;
        item.style.opacity = 1;
        item.style.pointerEvents = 'auto';
        item.style.filter = 'none';
      } else if (offset < 0) {
        const translateX = -baseTranslate - (absOffset - 1) * offsetSpacing;
        const translateZ = zBaseInactive - absOffset * zOffsetInactive;
        
        item.style.transform = `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateYVal}deg) scale(0.9)`;
        item.style.zIndex = 100 - absOffset;
        item.style.opacity = absOffset > 2 ? 0 : 0.6;
        item.style.pointerEvents = absOffset === 1 ? 'auto' : 'none';
        item.style.filter = 'blur(1px) grayscale(40%)';
      } else {
        const translateX = baseTranslate + (absOffset - 1) * offsetSpacing;
        const translateZ = zBaseInactive - absOffset * zOffsetInactive;
        
        item.style.transform = `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${-rotateYVal}deg) scale(0.9)`;
        item.style.zIndex = 100 - absOffset;
        item.style.opacity = absOffset > 2 ? 0 : 0.6;
        item.style.pointerEvents = absOffset === 1 ? 'auto' : 'none';
        item.style.filter = 'blur(1px) grayscale(40%)';
      }
    });
  };

  const nextCarousel = () => {
    currentCarouselIndex = (currentCarouselIndex + 1) % totalCarouselItems;
    updateCarousel();
  };

  const prevCarousel = () => {
    currentCarouselIndex = (currentCarouselIndex - 1 + totalCarouselItems) % totalCarouselItems;
    updateCarousel();
  };

  if (btnNext) btnNext.addEventListener('click', nextCarousel);
  if (btnPrev) btnPrev.addEventListener('click', prevCarousel);

  // Click adjacent cards to focus
  carouselItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      // Prevent lightbox pop if user was just swiping cards
      if (wasDragging) return;
      
      let offset = index - currentCarouselIndex;
      if (offset < -totalCarouselItems / 2) offset += totalCarouselItems;
      if (offset > totalCarouselItems / 2) offset -= totalCarouselItems;
      
      if (offset === 0) {
        openLightbox(item.dataset.src, item.dataset.title);
      } else if (offset === 1 || offset === -1) {
        currentCarouselIndex = index;
        updateCarousel();
        e.stopPropagation();
      }
    });
  });

  // Carousel touch swipe gestures
  let startX = 0;
  let isDragging = false;

  if (carouselStage) {
    carouselStage.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    carouselStage.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const diffX = e.clientX - startX;
      
      if (Math.abs(diffX) > 10) {
        wasDragging = true; // Drag threshold reached
      }
      
      if (Math.abs(diffX) > 60) {
        if (diffX > 0) prevCarousel();
        else nextCarousel();
        isDragging = false; 
      }
    });

    window.addEventListener('mouseup', () => { 
      isDragging = false; 
      // Safe timing clear of dragging state
      setTimeout(() => { wasDragging = false; }, 80);
    });

    carouselStage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    carouselStage.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diffX = e.touches[0].clientX - startX;
      
      if (Math.abs(diffX) > 10) {
        wasDragging = true;
      }
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) prevCarousel();
        else nextCarousel();
        isDragging = false;
      }
    });

    carouselStage.addEventListener('touchend', () => { 
      isDragging = false; 
      setTimeout(() => { wasDragging = false; }, 80);
    });
  }

  // Initialize Poster Carousel
  updateCarousel();

  /* ==========================================================================
     5. Single-Image Snapping Slider (Banners & Thumbnails)
     ========================================================================== */
  const thumbViewport = document.getElementById('thumb-viewport');
  const thumbTrack = document.getElementById('thumb-track');
  const btnThumbPrev = document.getElementById('btn-thumb-prev');
  const btnThumbNext = document.getElementById('btn-thumb-next');
  const thumbSlides = document.querySelectorAll('.thumbnail-slide');

  let currentThumbIndex = 0;
  const totalThumbSlides = thumbSlides.length;
  let isThumbDragging = false;
  let thumbDragStartX = 0;
  let initialTranslate = 0;
  let dragDiffX = 0;

  const updateThumbnailSlider = () => {
    if (!thumbTrack || !thumbViewport) return;
    
    const viewportWidth = thumbViewport.clientWidth;
    const currentTranslate = -currentThumbIndex * viewportWidth;
    
    thumbTrack.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    thumbTrack.style.transform = `translateX(${currentTranslate}px)`;
  };

  const slideNextThumb = () => {
    currentThumbIndex = (currentThumbIndex + 1) % totalThumbSlides;
    updateThumbnailSlider();
  };

  const slidePrevThumb = () => {
    currentThumbIndex = (currentThumbIndex - 1 + totalThumbSlides) % totalThumbSlides;
    updateThumbnailSlider();
  };

  if (btnThumbNext) btnThumbNext.addEventListener('click', slideNextThumb);
  if (btnThumbPrev) btnThumbPrev.addEventListener('click', slidePrevThumb);

  // Grab to slide horizontal track
  if (thumbViewport) {
    thumbViewport.addEventListener('mousedown', (e) => {
      if (!thumbViewport) return;
      const viewportWidth = thumbViewport.clientWidth;
      
      thumbDragStartX = e.clientX;
      initialTranslate = -currentThumbIndex * viewportWidth;
      isThumbDragging = true;
      dragDiffX = 0;
      thumbTrack.style.transition = 'none'; // Instant drag tracking
    });

    thumbViewport.addEventListener('mousemove', (e) => {
      if (!isThumbDragging) return;
      const diffX = e.clientX - thumbDragStartX;
      dragDiffX = diffX;
      
      if (Math.abs(diffX) > 10) {
        wasDragging = true; // Drag threshold reached
      }
      
      const currentTranslate = initialTranslate + diffX;
      thumbTrack.style.transform = `translateX(${currentTranslate}px)`;
    });

    window.addEventListener('mouseup', () => {
      if (!isThumbDragging) return;
      isThumbDragging = false;
      
      // Snap to slide index
      if (dragDiffX < -60) {
        currentThumbIndex = Math.min(totalThumbSlides - 1, currentThumbIndex + 1);
      } else if (dragDiffX > 60) {
        currentThumbIndex = Math.max(0, currentThumbIndex - 1);
      }
      
      updateThumbnailSlider();
      setTimeout(() => { wasDragging = false; }, 80);
    });

    // Touch support for mobile devices
    thumbViewport.addEventListener('touchstart', (e) => {
      if (!thumbViewport) return;
      const viewportWidth = thumbViewport.clientWidth;
      
      thumbDragStartX = e.touches[0].clientX;
      initialTranslate = -currentThumbIndex * viewportWidth;
      isThumbDragging = true;
      dragDiffX = 0;
      thumbTrack.style.transition = 'none';
    });

    thumbViewport.addEventListener('touchmove', (e) => {
      if (!isThumbDragging) return;
      const diffX = e.touches[0].clientX - thumbDragStartX;
      dragDiffX = diffX;
      
      if (Math.abs(diffX) > 10) {
        wasDragging = true;
      }
      
      const currentTranslate = initialTranslate + diffX;
      thumbTrack.style.transform = `translateX(${currentTranslate}px)`;
    });

    thumbViewport.addEventListener('touchend', () => {
      if (!isThumbDragging) return;
      isThumbDragging = false;
      
      if (dragDiffX < -50) {
        currentThumbIndex = Math.min(totalThumbSlides - 1, currentThumbIndex + 1);
      } else if (dragDiffX > 50) {
        currentThumbIndex = Math.max(0, currentThumbIndex - 1);
      }
      
      updateThumbnailSlider();
      setTimeout(() => { wasDragging = false; }, 80);
    });
  }

  // Initialize Thumbnail Slider Track
  updateThumbnailSlider();

  // Adjust on resizing screen
  window.addEventListener('resize', () => {
    updateThumbnailSlider();
    updateCarousel();
  });

  /* ==========================================================================
     6. Fullscreen Glassmorphic Lightbox System
     ========================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');

  const openLightbox = (src, title) => {
    if (!lightbox || !lightboxImg || !lightboxTitle) return;
    
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    
    lightbox.showModal();
    document.body.style.overflow = 'hidden'; 
    document.documentElement.style.scrollSnapType = 'none'; // Disable snapping so closing is smooth
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    
    lightbox.close();
    document.body.style.overflow = ''; 
    
    // Restore snap if we are on desktop
    if (window.innerWidth > 768 && window.innerHeight >= 700) {
      document.documentElement.style.scrollSnapType = 'y mandatory';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Click zoom for slide track items
  thumbSlides.forEach(slide => {
    slide.addEventListener('click', () => {
      if (wasDragging) return;
      openLightbox(slide.dataset.src, slide.dataset.title);
    });
  });

  // Disable right-click context menu across the entire site
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

});
