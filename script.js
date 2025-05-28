
    document.addEventListener('DOMContentLoaded', function() {
        // ===== Gallery Filter with Proper Load More =====
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.textContent = 'Load More';
        
        // Insert the load more button after the gallery grid
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.parentNode.insertBefore(loadMoreBtn, galleryGrid.nextSibling);
    
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
            loadMoreBtn.style.display = visibleItems < matchingItems.length ? 'block' : 'none';
        }
    
        // Load more items
        loadMoreBtn.addEventListener('click', function() {
            visibleItems += itemsPerLoad;
            updateGalleryVisibility();
        });
    
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
        updateGalleryVisibility();
    
        // ===== Counter Animation (Your Original Code) =====
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
    
        // ===== Smooth Scrolling (Your Original Code) =====
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
                }
            });
        });
    });
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
        upiId.select();
        document.execCommand('copy');
        alert("Copied: " + upiId.value);
      }