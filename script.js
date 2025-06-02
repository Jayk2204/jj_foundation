document.addEventListener('DOMContentLoaded', function() {
    // ===== Mobile Navigation =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }

    if (navItems) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
            });
        });
    }

    // ===== Donation Modal =====
    const modal = document.getElementById("qrModal");
    const donateBtn = document.getElementById("donateBtn");
    const closeBtn = document.querySelector(".close");

    // Function to open modal
    function openDonateModal(e) {
        e.preventDefault();
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    // Add to your existing ID button
    if (donateBtn) {
        donateBtn.addEventListener("click", openDonateModal);
    }

    // Close modal
    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
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
        if (e.key === "Escape" && modal.style.display === "block") {
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
            document.getElementById(tabId).classList.add("active");
        });
    });

    // Copy functionality
    const copyButtons = document.querySelectorAll(".copy-btn");
    copyButtons.forEach(button => {
        button.addEventListener("click", function() {
            const textToCopy = this.getAttribute("data-text");
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.textContent;
                this.textContent = "Copied!";
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            });
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
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Set new filter and reset visible items
            currentFilter = this.getAttribute('data-filter');
            visibleItems = 6;
            
            // Update visibility
            updateGalleryVisibility();
        });
    });
    
    // Initialize the gallery with 6 random images
    if (galleryItems.length > 0) {
        updateGalleryVisibility();
    }

    // ===== Counter Animation =====
    const statNumbers = document.querySelectorAll('.stat-number');
    const speed = 200;

    function animateCounters() {
        statNumbers.forEach(number => {
            const target = +number.getAttribute('data-count');
            const count = +number.innerText;
            const increment = target / speed;
            
            if (count < target) {
                number.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                number.innerText = target;
            }
        });
    }

    // Initialize counters when section is in view
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(aboutSection);
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
                    hamburger.classList.remove('toggle');
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
});

// ===== UPI Payment Functions =====
function initiateUPIPayment() {
    // Try to open UPI app directly
    window.location.href = "upi://pay?pa=jjfoundation.62573776@hdfcbank&pn=JJFoundation&am=&tn=Donation";
    
    // Show fallback if UPI app not found (after 2 seconds)
    setTimeout(function(){
        if(!document.hidden) {
            document.getElementById('upi-fallback').style.display = 'block';
        }
    }, 2000);
}

function copyUpiId() {
    const upiId = document.getElementById('upi-id');
    if (upiId) {
        upiId.select();
        document.execCommand('copy');
        alert("Copied: " + upiId.value);
    }
}