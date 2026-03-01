


document.addEventListener('DOMContentLoaded', function() {
    // ===== Mobile Navigation FIXED =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Close menu when clicking any link
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (
            navLinks && 
            navLinks.classList.contains('nav-active') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
        }
    });

    // Reset menu on resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            if (navLinks) navLinks.classList.remove('nav-active');
            if (hamburger) hamburger.classList.remove('toggle');
        }
    });

    // ===== Donation Modal =====
    const modal = document.getElementById("qrModal");
    const donateBtn = document.getElementById("donateBtn");
    const closeBtn = document.querySelector(".close");

    // Function to open modal
    function openDonateModal(e) {
        e.preventDefault();
        if (modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }

    // Add to your existing ID button
    if (donateBtn) {
        donateBtn.addEventListener("click", openDonateModal);
    }

    // Close modal
    function closeModal() {
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Close when clicking outside modal
    window.addEventListener("click", function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close with Escape key
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && modal && modal.style.display === "block") {
            closeModal();
        }
    });

    // Tab functionality
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(tab => {
                tab.classList.remove("active");
            });
            
            // Add active class to clicked button and corresponding tab
            this.classList.add("active");
            const tabId = this.getAttribute("data-tab");
            const tabElement = document.getElementById(tabId);
            if (tabElement) {
                tabElement.classList.add("active");
            }
        });
    });

    // Copy functionality
    const copyButtons = document.querySelectorAll(".copy-btn");
    copyButtons.forEach(button => {
        button.addEventListener("click", function() {
            const textToCopy = this.getAttribute("data-text");
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = this.textContent;
                    this.textContent = "Copied!";
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error("Failed to copy:", err);
                    alert("Failed to copy text");
                });
            }
        });
    });

    // ===== Gallery Filter with Proper Load More =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'load-more-btn';
    loadMoreBtn.textContent = 'Load More';
    
    // Insert the load more button after the gallery grid
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        galleryGrid.parentNode.insertBefore(loadMoreBtn, galleryGrid.nextSibling);
    }

    // Configuration
    const itemsPerLoad = 3;
    let visibleItems = 6;
    let currentFilter = 'all';

    // Function to shuffle array (for initial random 6 images)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to update gallery visibility
    function updateGalleryVisibility() {
        // Get all items matching current filter
        const matchingItems = Array.from(galleryItems).filter(item => {
            return currentFilter === 'all' || 
                   item.getAttribute('data-category') === currentFilter;
        });

        // For initial load with 'all' filter, shuffle to show random 6
        if (currentFilter === 'all' && visibleItems === 6) {
            shuffleArray(matchingItems);
        }

        // Hide all items first
        galleryItems.forEach(item => {
            item.style.display = 'none';
            item.classList.add('hidden');
        });

        // Show the allowed number of items
        matchingItems.slice(0, visibleItems).forEach(item => {
            item.style.display = 'block';
            item.classList.remove('hidden');
        });

        // Show/hide load more button
        if (loadMoreBtn) {
            loadMoreBtn.style.display = visibleItems < matchingItems.length ? 'block' : 'none';
        }
    }

    // Load more items
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleItems += itemsPerLoad;
            updateGalleryVisibility();
        });
    }

    // Filter functionality
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Set new filter and reset visible items
                currentFilter = this.getAttribute('data-filter') || 'all';
                visibleItems = 6;
                
                // Update visibility
                updateGalleryVisibility();
            });
        });
    }
    
    // Initialize the gallery with 6 random images
    if (galleryItems.length > 0) {
        updateGalleryVisibility();
    }

    // ===== IMPROVED COUNTER ANIMATION =====
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const animationDuration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count') || '0');
            const totalFrames = Math.round(animationDuration / frameDuration);
            let frame = 0;
            
            // Create an animation loop
            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const currentValue = Math.round(target * progress);
                
                // Update the displayed number
                stat.textContent = currentValue;
                
                // Stop the animation when we reach the target
                if (frame === totalFrames) {
                    stat.textContent = target;
                    clearInterval(counter);
                }
            }, frameDuration);
        });
    }

    // Initialize counters when impact section is in view
    const impactSection = document.querySelector('.impact-section');
    if (impactSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });
        observer.observe(impactSection);
    }

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('nav-active')) {
                    navLinks.classList.remove('nav-active');
                    if (hamburger) hamburger.classList.remove('toggle');
                }
            }
        });
    });

    // ===== Newspaper Items Load More =====
    const newsItems = document.querySelectorAll('.newspaper-item');
    const newsLoadMoreBtn = document.getElementById('loadMoreBtn');

    if (newsItems.length > 0 && newsLoadMoreBtn) {
        let currentNewsIndex = 0;
        const newsItemsPerLoad = 6;

        function showNewsItems() {
            for (let i = currentNewsIndex; i < currentNewsIndex + newsItemsPerLoad && i < newsItems.length; i++) {
                newsItems[i].style.display = 'block';
            }
            currentNewsIndex += newsItemsPerLoad;

            if (currentNewsIndex >= newsItems.length) {
                newsLoadMoreBtn.style.display = 'none';
            }
        }

        // Hide all items initially
        newsItems.forEach(item => {
            item.style.display = 'none';
        });

        // Show the first set of items
        showNewsItems();

        newsLoadMoreBtn.addEventListener('click', showNewsItems);
    }

    // ===== IMPROVED CONTACT FORM HANDLER (Using IDs) =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        console.log("✓ Contact form found and handler attached");
        contactForm.addEventListener('submit', handleContactSubmit);
    } else {
        console.error("✗ Contact form not found! Make sure the form has id='contactForm'");
    }

    // ===== Load Works from Firebase =====
    loadWorksFromFirebase();
});

// ===== HANDLE CONTACT FORM SUBMISSION (Improved version) =====
async function handleContactSubmit(e) {
    e.preventDefault();
    console.log("📝 Form submission started");
    
    // Get form elements by ID
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Check if elements exist
    if (!nameInput || !emailInput || !messageInput || !submitBtn) {
        console.error("Form elements not found:", { nameInput, emailInput, messageInput, submitBtn });
        showFormMessage('Form error. Please refresh and try again.', 'error');
        return;
    }
    
    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput.value.trim();
    
    console.log("Form data:", { name, email, subject, message });
    
    // Validate form
    if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address!', 'error');
        return;
    }
    
    // Show loading state
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'not-allowed';
    
    try {
        // Save to Firebase Firestore
        const docRef = await db.collection("messages").add({
            name: name,
            email: email,
            subject: subject || 'No Subject',
            message: message,
            createdAt: new Date().toISOString(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            isRead: false
        });
        
        console.log("✅ Message saved successfully with ID:", docRef.id);
        
        // Success message
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        
        // Clear form
        document.getElementById('contactForm').reset();
        
    } catch (error) {
        console.error("❌ Error saving message:", error);
        showFormMessage('Failed to send message. Please check your connection and try again.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
}

// ===== EMAIL VALIDATION HELPER =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== SHOW FORM MESSAGE (Improved version) =====
function showFormMessage(message, type) {
    // Remove any existing message
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create message element
    const msgElement = document.createElement('div');
    msgElement.className = `form-message ${type}`;
    msgElement.textContent = message;
    msgElement.style.cssText = `
        padding: 12px 20px;
        margin-top: 15px;
        border-radius: 8px;
        font-size: 14px;
        text-align: center;
        animation: slideUp 0.3s ease;
        font-weight: 500;
        ${type === 'success' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
        }
    `;
    
    // Add to form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.appendChild(msgElement);
        
        // Scroll to message
        msgElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Auto remove after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            if (msgElement.parentNode) {
                msgElement.style.animation = 'slideDown 0.3s ease';
                setTimeout(() => msgElement.remove(), 300);
            }
        }, 5000);
    }
}

// ===== LOAD WORKS FROM FIREBASE =====
async function loadWorksFromFirebase() {
    const galleryGrid = document.getElementById("galleryGrid");
    if (!galleryGrid) {
        console.error("Gallery grid not found");
        return;
    }

    try {
        console.log("Loading works from Firebase...");
        const snapshot = await db.collection("works")
            .orderBy("createdAt", "desc")
            .get();

        galleryGrid.innerHTML = "";

        if (snapshot.empty) {
            galleryGrid.innerHTML = '<p class="no-works">No works found.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const category = data.category || 'uncategorized';
            const title = data.title || 'Untitled';
            const imageUrl = data.imageUrl || '';

            galleryGrid.innerHTML += `
                <div class="gallery-item" data-category="${category.toLowerCase()}">
                    <img src="${imageUrl}" class="gallery-img" alt="${title}" loading="lazy">
                    <div class="gallery-overlay">
                        <h3 class="gallery-title">${title}</h3>
                        <span class="gallery-category">${category}</span>
                    </div>
                </div>
            `;
        });

        console.log(`✅ Loaded ${snapshot.size} works`);
        
        // Re-initialize gallery filters after loading new items
        setTimeout(() => {
            initializeGalleryFilters();
        }, 500);
        
    } catch (error) {
        console.error("Error loading works:", error);
        galleryGrid.innerHTML = '<p class="error-message">Error loading works. Please refresh.</p>';
    }
}

// ===== INITIALIZE GALLERY FILTERS =====
function initializeGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length && galleryItems.length) {
        console.log("Initializing gallery filters with", galleryItems.length, "items");
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter') || 'all';
                
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

// ===== UPI PAYMENT FUNCTIONS =====
function initiateUPIPayment() {
    window.location.href = "upi://pay?pa=jjfoundation.62573776@hdfcbank&pn=JJFoundation&am=&tn=Donation";
    
    setTimeout(function(){
        if(!document.hidden) {
            const fallback = document.getElementById('upi-fallback');
            if (fallback) {
                fallback.style.display = 'block';
            }
        }
    }, 2000);
}

function copyUpiId() {
    const upiId = document.getElementById('upi-id');
    if (upiId) {
        upiId.select();
        document.execCommand('copy');
        alert("UPI ID copied: " + upiId.value);
    }
}

// ===== ADD ANIMATIONS =====
if (!document.querySelector('#slide-animations')) {
    const slideAnimations = document.createElement('style');
    slideAnimations.id = 'slide-animations';
    slideAnimations.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideDown {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(10px);
            }
        }
        
        .no-works, .error-message {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 16px;
        }
        
        .form-message {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(slideAnimations);
}