document.addEventListener("DOMContentLoaded", () => {
    // Role typing animation
    const roles = ["Web and Mobile application Developer", "Software Engineer", "Full-Stack Developer"];
    const roleElement = document.getElementById('role');
    let roleIndex = 0;
    let letterIndex = 0;
    let typingInterval;

    function typeRole() {
        roleElement.style.opacity = 0;
        setTimeout(() => {
            roleElement.textContent = "";
            letterIndex = 0;

            typingInterval = setInterval(() => {
                if (letterIndex < roles[roleIndex].length) {
                    roleElement.textContent += roles[roleIndex].charAt(letterIndex);
                    letterIndex++;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(() => {
                        roleIndex = (roleIndex + 1) % roles.length;
                        typeRole();
                    }, 1000);
                }
            }, 150);
            roleElement.style.opacity = 1;
        }, 500);
    }
    typeRole();

    // Dark/Light mode toggle
    const darkLightBtn = document.querySelector('.dark-light-btn');
    darkLightBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            darkLightBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
        } else {
            darkLightBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.project-list li');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Testimonial System
    const testimonialForm = document.getElementById('testimonialForm');
    const testimonialsContainer = document.querySelector('.testimonials-container');

    // Initialize testimonial form if it exists
    if (testimonialForm) {
        // Star rating functionality
        document.querySelectorAll('.rating-stars i').forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                document.getElementById('clientRating').value = rating;

                // Update star display
                document.querySelectorAll('.rating-stars i').forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('fa-regular');
                        s.classList.add('fa-solid', 'active');
                    } else {
                        s.classList.remove('fa-solid', 'active');
                        s.classList.add('fa-regular');
                    }
                });
            });
        });

        // Form submission
        testimonialForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const role = document.getElementById('clientRole').value.trim();
            const testimonial = document.getElementById('clientTestimonial').value.trim();
            const rating = document.getElementById('clientRating').value;

            // Validation
            if (!name || !testimonial) {
                showMessage('Please fill in all required fields', 'error');
                return;
            }

            if (rating === '0') {
                showMessage('Please provide a rating', 'error');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/testimonials', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        role: role || 'Client',
                        testimonial,
                        rating: parseInt(rating)
                    })
                });

                if (response.ok) {
                    showMessage('Thank you for your testimonial!', 'success');
                    testimonialForm.reset();
                    resetStarRating();
                    await loadTestimonials();
                } else {
                    throw new Error(await response.text());
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('There was an error submitting your testimonial. Please try again.', 'error');
            }
        });

        // Helper function to reset star rating
        function resetStarRating() {
            document.getElementById('clientRating').value = '0';
            document.querySelectorAll('.rating-stars i').forEach(star => {
                star.classList.remove('fa-solid', 'active');
                star.classList.add('fa-regular');
            });
        }

        // Helper function to show messages
        function showMessage(message, type) {
            // Remove existing messages
            const existingMsg = document.querySelector('.form-message');
            if (existingMsg) existingMsg.remove();

            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${type}`;
            messageDiv.textContent = message;
            testimonialForm.appendChild(messageDiv);

            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 500);
            }, 3000);
        }

        // Load testimonials on page load
        loadTestimonials();
    }

    // Function to load testimonials from the server
    async function loadTestimonials() {
        try {
            const response = await fetch('http://localhost:5000/api/testimonials');
            if (!response.ok) throw new Error('Failed to fetch testimonials');

            const testimonials = await response.json();
            renderTestimonials(testimonials);
        } catch (error) {
            console.error('Error loading testimonials:', error);
            if (testimonialsContainer) {
                testimonialsContainer.innerHTML = `
                    <div class="error-message">
                        Could not load testimonials. Please try again later.
                    </div>
                `;
            }
        }
    }

    // Function to render testimonials
    function renderTestimonials(testimonials) {
        if (!testimonialsContainer) return;

        if (testimonials.length === 0) {
            testimonialsContainer.innerHTML = `
                <div class="no-testimonials">
                    No testimonials yet. Be the first to share your experience!
                </div>
            `;
            return;
        }

        testimonialsContainer.innerHTML = testimonials
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(testimonial => `
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        <div class="testimonial-text">
                            <p>${testimonial.testimonial}</p>
                            <div class="rating-display">
                                ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                            </div>
                        </div>
                        <div class="testimonial-author">
                            <div class="author-image">
                                <img src="image/default-avatar.jpg" alt="${testimonial.name}" onerror="this.src='image/default-avatar.jpg'">
                            </div>
                            <div class="author-info">
                                <h5>${testimonial.name}</h5>
                                <span>${testimonial.role || 'Client'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
    }
});