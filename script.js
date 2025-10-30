        // Code 2 JS adapted
        const spheres = [];
        let draggedSphere = null;
        let offsetX = 0;
        let offsetY = 0;
        let isTransitioning = false;
        let gravity = 0;
        let selectedSphere = null;
        let animationId = null;
        // Create sphere with 3D lighting effect
        function createSphere(x, y, size, hue) {
            const sphere = document.createElement('div');
            sphere.className = 'sphere';
            sphere.style.width = size + 'px';
            sphere.style.height = size + 'px';
            sphere.style.left = x + 'px';
            sphere.style.top = y + 'px';
            // Create 3D sphere effect with radial gradient
            sphere.style.background = `radial-gradient(circle at 30% 30%, hsl(${hue}, 80%, 80%), hsl(${hue}, 70%, 60%) 30%, hsl(${hue}, 60%, 40%) 60%, hsl(${hue}, 50%, 20%) 100%)`;
            sphere.style.boxShadow = 
                `inset -10px -10px 30px rgba(0, 0, 0, 0.3),
                inset 5px 5px 20px rgba(255, 255, 255, 0.2),
                0 15px 40px rgba(0, 0, 0, 0.3)`;
            document.body.appendChild(sphere);
            const sphereData = {
                element: sphere,
                x: x,
                y: y,
                size: size,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                hue: hue
            };
            spheres.push(sphereData);
            // Mouse events for dragging
            sphere.addEventListener('mousedown', (e) => startDrag(e, sphereData));
            sphere.addEventListener('touchstart', (e) => startDrag(e.touches[0], sphereData));
            return sphereData;
        }
        function startDrag(e, sphereData) {
            if (!isTransitioning) {
                // Trigger transition
                isTransitioning = true;
                document.body.style.background = '#000000';
                document.getElementById('info').style.opacity = '0';
                gravity = 0.5;
                selectedSphere = sphereData;
                // Stop all other spheres from bouncing
                spheres.forEach(s => {
                    if (s !== sphereData) {
                        s.vx = 0;
                    }
                });
            }
            draggedSphere = sphereData;
            offsetX = e.clientX - sphereData.x;
            offsetY = e.clientY - sphereData.y;
            sphereData.element.style.transition = 'none';
            // Add glow effect
            const glowColor = `hsl(${sphereData.hue}, 100%, 50%)`;
            sphereData.element.style.setProperty('--glow-color', glowColor);
            sphereData.element.classList.add('glowing');
            e.preventDefault();
        }
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            if (draggedSphere) {
                draggedSphere.x = e.clientX - offsetX;
                draggedSphere.y = e.clientY - offsetY;
                draggedSphere.element.style.left = draggedSphere.x + 'px';
                draggedSphere.element.style.top = draggedSphere.y + 'px';
            }
        });
        document.addEventListener('touchmove', (e) => {
            if (draggedSphere) {
                draggedSphere.x = e.touches[0].clientX - offsetX;
                draggedSphere.y = e.touches[0].clientY - offsetY;
                draggedSphere.element.style.left = draggedSphere.x + 'px';
                draggedSphere.element.style.top = draggedSphere.y + 'px';
            }
        });
        // Mouse up handler
        document.addEventListener('mouseup', (e) => {
            if (draggedSphere) {
                draggedSphere.element.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
                draggedSphere.element.classList.remove('glowing');
                // Make the released ball fall too
                if (selectedSphere) {
                    selectedSphere.vx = 0;
                    selectedSphere.vy = 0;
                }
                // Create "wush" glow flash effect from ball position
                if (selectedSphere) {
                    const glowColor = `hsl(${selectedSphere.hue}, 100%, 50%)`;
                    const flash = document.createElement('div');
                    flash.className = 'glow-flash';
                    flash.style.setProperty('--glow-color', glowColor);
                    // Calculate position as percentage
                    const flashX = ((selectedSphere.x + selectedSphere.size / 2) / window.innerWidth * 100) + '%';
                    const flashY = ((selectedSphere.y + selectedSphere.size / 2) / window.innerHeight * 100) + '%';
                    flash.style.setProperty('--flash-x', flashX);
                    flash.style.setProperty('--flash-y', flashY);
                    document.body.appendChild(flash);
                    setTimeout(() => flash.remove(), 1200);
                    // Transition background to black (already set) and show content
                    setTimeout(() => {
                        document.body.style.background = '#000000';
                        // Show landing page content after transition
                        setTimeout(() => {
                            document.getElementById('landingContent').classList.add('visible');
                            document.body.classList.add('landing-active');
                            document.body.style.overflow = 'visible';
                            document.body.style.cursor = 'default';
                        }, 500);
                    }, 400);
                }
                draggedSphere = null;
            }
        });
        document.addEventListener('touchend', (e) => {
            if (draggedSphere) {
                draggedSphere.element.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
                draggedSphere.element.classList.remove('glowing');
                if (selectedSphere) {
                    selectedSphere.vx = 0;
                    selectedSphere.vy = 0;
                }
                if (selectedSphere) {
                    const glowColor = `hsl(${selectedSphere.hue}, 100%, 50%)`;
                    const flash = document.createElement('div');
                    flash.className = 'glow-flash';
                    flash.style.setProperty('--glow-color', glowColor);
                    const flashX = ((selectedSphere.x + selectedSphere.size / 2) / window.innerWidth * 100) + '%';
                    const flashY = ((selectedSphere.y + selectedSphere.size / 2) / window.innerHeight * 100) + '%';
                    flash.style.setProperty('--flash-x', flashX);
                    flash.style.setProperty('--flash-y', flashY);
                    document.body.appendChild(flash);
                    setTimeout(() => flash.remove(), 1200);
                    setTimeout(() => {
                        document.body.style.background = '#000000';
                        setTimeout(() => {
                            document.getElementById('landingContent').classList.add('visible');
                            document.body.classList.add('landing-active');
                            document.body.style.overflow = 'visible';
                            document.body.style.cursor = 'default';
                        }, 500);
                    }, 400);
                }
                draggedSphere = null;
            }
        });
        // Physics - spheres bounce off edges and each other
        function animate() {
            spheres.forEach(sphere => {
                if (sphere === draggedSphere) return;
                // Apply gravity when transitioning (ALL spheres fall now, including the released one)
                if (isTransitioning) {
                    sphere.vy += gravity;
                    sphere.y += sphere.vy;
                    // Remove sphere if it falls off screen
                    if (sphere.y > window.innerHeight + sphere.size) {
                        sphere.element.style.opacity = '0';
                    }
                    sphere.element.style.left = sphere.x + 'px';
                    sphere.element.style.top = sphere.y + 'px';
                    return;
                }
                // Normal physics (only if not transitioning)
                sphere.x += sphere.vx;
                sphere.y += sphere.vy;
                // Bounce off walls
                if (sphere.x < 0 || sphere.x > window.innerWidth - sphere.size) {
                    sphere.vx *= -1;
                    sphere.x = Math.max(0, Math.min(window.innerWidth - sphere.size, sphere.x));
                }
                if (sphere.y < 0 || sphere.y > window.innerHeight - sphere.size) {
                    sphere.vy *= -1;
                    sphere.y = Math.max(0, Math.min(window.innerHeight - sphere.size, sphere.y));
                }
                // Check collision with other spheres
                spheres.forEach(other => {
                    if (sphere === other) return;
                    const dx = other.x - sphere.x;
                    const dy = other.y - sphere.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDist = (sphere.size + other.size) / 2;
                    if (distance < minDist) {
                        // Collision detected - bounce
                        const angle = Math.atan2(dy, dx);
                        const targetX = sphere.x + Math.cos(angle) * minDist;
                        const targetY = sphere.y + Math.sin(angle) * minDist;
                        const ax = (targetX - other.x) * 0.1;
                        const ay = (targetY - other.y) * 0.1;
                        sphere.vx -= ax;
                        sphere.vy -= ay;
                        other.vx += ax;
                        other.vy += ay;
                    }
                });
                // Apply friction
                sphere.vx *= 0.99;
                sphere.vy *= 0.99;
                // Update DOM
                sphere.element.style.left = sphere.x + 'px';
                sphere.element.style.top = sphere.y + 'px';
            });
            // Check if all spheres are off-screen during transition; stop animation if so
            if (isTransitioning) {
                const allOffScreen = spheres.every(sphere => sphere.y > window.innerHeight + sphere.size);
                if (allOffScreen) {
                    spheres.forEach(s => s.element.remove());
                    spheres.length = 0;
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                    return;
                }
            }
            animationId = requestAnimationFrame(animate);
        }
        // Reset function
        function resetScene() {
            // Hide landing content
            document.getElementById('landingContent').classList.remove('visible');
            document.body.classList.remove('landing-active');
            document.body.style.overflow = 'hidden';
            document.body.style.cursor = 'move';
            // Remove all existing spheres
            spheres.forEach(s => s.element.remove());
            spheres.length = 0;
            // Reset state
            isTransitioning = false;
            gravity = 0;
            selectedSphere = null;
            draggedSphere = null;
            // Cancel any ongoing animation
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            // Reset background and info
            document.body.style.background = 'linear-gradient(135deg, #00AEEF 0%, #0088CC 100%)';
            document.getElementById('info').style.opacity = '1';
            // Create new spheres
            const colors = [180, 190, 200, 210, 220];
            for (let i = 0; i < 8; i++) {
                const size = 60 + Math.random() * 80;
                const x = Math.random() * (window.innerWidth - size);
                const y = Math.random() * (window.innerHeight - size);
                const hue = colors[Math.floor(Math.random() * colors.length)];
                createSphere(x, y, size, hue);
            }
            // Restart animation
            animate();
        }
        // Create initial spheres
        const colors = [180, 190, 200, 210, 220];
        for (let i = 0; i < 8; i++) {
            const size = 60 + Math.random() * 80;
            const x = Math.random() * (window.innerWidth - size);
            const y = Math.random() * (window.innerHeight - size);
            const hue = colors[Math.floor(Math.random() * colors.length)];
            createSphere(x, y, size, hue);
        }
        // Start animation
        animate();
        // Add sphere on click (when not dragging)
        let clickStart = null;
        document.addEventListener('mousedown', (e) => {
            clickStart = {x: e.clientX, y: e.clientY, time: Date.now()};
        });
        document.addEventListener('mouseup', (e) => {
            if (!clickStart) return;
            const dx = e.clientX - clickStart.x;
            const dy = e.clientY - clickStart.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const timeDiff = Date.now() - clickStart.time;
            // If it was a quick click (not a drag), add new sphere
            if (distance < 5 && timeDiff < 200 && !draggedSphere && !isTransitioning) {
                const size = 60 + Math.random() * 80;
                const hue = Math.random() * 360;
                createSphere(e.clientX - size/2, e.clientY - size/2, size, hue);
            }
            clickStart = null;
        });
        // Cursor follower effect
        const heroSection = document.getElementById('hero-section');
        const cursorFollower = document.getElementById('cursorFollower');
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cursorFollower.style.left = x + 'px';
            cursorFollower.style.top = y + 'px';
        });
        heroSection.addEventListener('mouseenter', () => {
            cursorFollower.style.opacity = '1';
        });
        heroSection.addEventListener('mouseleave', () => {
            cursorFollower.style.opacity = '0';
        });
        function autoScroll() {
            const productsSection = document.getElementById('products');
            productsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        function toggleFAQ(element) {
            const faqItem = element.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').classList.remove('active');
                }
            });
            // Toggle current FAQ
            faqItem.classList.toggle('active');
            answer.classList.toggle('active');
        }
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        // Add scroll reveal animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        document.querySelectorAll('.feature-card, .use-case-item, .faq-item, .pricing-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
        // Pricing counter animation
        function animateCounters() {
            document.querySelectorAll('.counter').forEach(counterEl => {
                const target = parseInt(counterEl.dataset.target);
                let current = 0;
                const duration = 2000; // 2s animation
                const startTime = performance.now();
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    current = target * progress;
                    counterEl.textContent = Math.floor(current).toLocaleString(); // Add comma separators for large numbers
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counterEl.textContent = target.toLocaleString();
                    }
                }
                requestAnimationFrame(updateCounter);
            });
        }
        // Observer for pricing animation trigger
        const pricingSection = document.querySelector('.pricing-section');
        if (pricingSection) {
            const pricingObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        pricingObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            pricingObserver.observe(pricingSection);
        }
