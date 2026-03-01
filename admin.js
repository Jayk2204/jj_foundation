// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5r-HDvo34yuuF7YDGkmzieQ7YudUDNeU",
  authDomain: "jj-foundation-d54aa.firebaseapp.com",
  projectId: "jj-foundation-d54aa",
  storageBucket: "jj-foundation-d54aa.firebasestorage.app",
  messagingSenderId: "1009301813580",
  appId: "1:1009301813580:web:2bb7c7864b78718821b7e9",
  measurementId: "G-NYN1QD7RJ5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const IMGBB_API_KEY = "c2a57968ac9e3f5cf23caea37d08df2e";

// Admin Password
const ADMIN_PASSWORD = "jj@admin123";

// Global Variables
let currentWorkId = null;
let messageBadge = document.getElementById('messageBadge');
let unreadMessages = 0;

// Date Time Update
function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  const dateTimeElement = document.getElementById('dateTime');
  if (dateTimeElement) {
    dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
  }
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Last Login Update
function updateLastLogin() {
  const lastLoginElement = document.getElementById('lastLogin');
  if (lastLoginElement) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    lastLoginElement.textContent = `Today at ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }
}

// Login Function
function checkPassword() {
  const input = document.getElementById("adminPassword").value;
  const error = document.getElementById("loginError");
  const loginBtn = document.querySelector('.login-btn');

  if (input === ADMIN_PASSWORD) {
    // Add loading state
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;

    setTimeout(() => {
      document.getElementById("loginScreen").classList.add("hidden");
      document.getElementById("adminPanel").classList.remove("hidden");
      updateLastLogin();
      showSection('dashboard', null);
      loadWorks();
      loadMessages();
      showToast('Login successful! Welcome back, Admin!', 'success');
    }, 1000);
  } else {
    error.innerText = "Incorrect password! Please try again.";
    error.style.color = "#ef4444";
    document.getElementById("adminPassword").value = '';
    
    // Shake animation for wrong password
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      loginCard.style.animation = '';
    }, 500);
  }
}

// Shake animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);

// Logout Function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    showToast('Logging out...', 'success');
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}

// Toggle Sidebar
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// Toggle Mobile Sidebar
function toggleMobileSidebar() {
  document.getElementById('sidebar').classList.toggle('show');
}

// Show Section
function showSection(section, event) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(el => {
    el.classList.remove('active-section');
  });

  // Show selected section
  if (section === 'dashboard') {
    document.getElementById('dashboardSection').classList.add('active-section');
    document.getElementById('pageTitle').textContent = 'Dashboard';
    document.getElementById('breadcrumbCurrent').textContent = 'Dashboard';
    updateDashboardStats();
  } 
  else if (section === 'works') {
    document.getElementById('worksSection').classList.add('active-section');
    document.getElementById('pageTitle').textContent = 'Works';
    document.getElementById('breadcrumbCurrent').textContent = 'Works Management';
    loadWorks();
  } 
  else if (section === 'messages') {
    document.getElementById('messagesSection').classList.add('active-section');
    document.getElementById('pageTitle').textContent = 'Messages';
    document.getElementById('breadcrumbCurrent').textContent = 'Contact Messages';
    loadMessages();
  } 
  else if (section === 'analytics') {
    document.getElementById('analyticsSection').classList.add('active-section');
    document.getElementById('pageTitle').textContent = 'Analytics';
    document.getElementById('breadcrumbCurrent').textContent = 'Analytics Overview';
    loadAnalytics();
  }
  else if (section === 'settings') {
    document.getElementById('settingsSection').classList.add('active-section');
    document.getElementById('pageTitle').textContent = 'Settings';
    document.getElementById('breadcrumbCurrent').textContent = 'Settings';
  }

  // Update active nav link
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
  });

  if (event) {
    event.currentTarget.classList.add('active');
  } else {
    // Find and activate the correct nav item based on section
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.getAttribute('onclick')?.includes(section)) {
        el.classList.add('active');
      }
    });
  }

  // Close mobile sidebar after selection
  if (window.innerWidth <= 992) {
    document.getElementById('sidebar').classList.remove('show');
  }
}

// Toggle Add Form
function toggleAddForm() {
  const form = document.getElementById('addWorkForm');
  form.classList.toggle('hidden');
  if (!form.classList.contains('hidden')) {
    document.getElementById('title').focus();
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Image Preview
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('imagePreview');
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 12px; margin-top: 16px;">`;
      
      // Add animation
      const img = preview.querySelector('img');
      img.style.animation = 'fadeIn 0.3s ease';
    }
    reader.readAsDataURL(file);
    
    // Update upload area text
    const uploadContent = document.querySelector('.upload-content h4');
    if (uploadContent) {
      uploadContent.textContent = file.name;
    }
  }
}

// Add Work
async function addWork() {
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!title || !category || !imageFile) {
    showToast('Please fill all fields and select an image!', 'error');
    return;
  }

  // Validate file type
  if (!imageFile.type.match('image.*')) {
    showToast('Please select a valid image file!', 'error');
    return;
  }

  // Validate file size (max 5MB for ImageBB free tier)
  if (imageFile.size > 5 * 1024 * 1024) {
    showToast('Image size should be less than 5MB!', 'error');
    return;
  }

  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading to ImageBB...';
  submitBtn.disabled = true;

  try {
    // Create FormData for ImageBB
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', imageFile);
    formData.append('name', title.replace(/\s+/g, '-').toLowerCase());

    // Upload to ImageBB
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      // Get image URLs from ImageBB response
      const imageUrl = data.data.url;
      const thumbnailUrl = data.data.thumb.url;
      const mediumUrl = data.data.medium?.url || imageUrl;
      const displayUrl = data.data.display_url || imageUrl;

      // Add to Firestore with ImageBB URLs
      await db.collection("works").add({
        title,
        category,
        imageUrl: displayUrl,
        thumbnailUrl: thumbnailUrl,
        mediumUrl: mediumUrl,
        deleteUrl: data.data.delete_url,
        imagebbData: {
          id: data.data.id,
          title: data.data.title,
          time: data.data.time,
          size: data.data.size
        },
        createdAt: new Date().toISOString(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Reset form
      document.getElementById("title").value = '';
      document.getElementById("category").value = '';
      document.getElementById("image").value = '';
      document.getElementById('imagePreview').innerHTML = '';
      
      // Reset upload area text
      const uploadContent = document.querySelector('.upload-content h4');
      if (uploadContent) {
        uploadContent.textContent = 'Click to Upload';
      }
      
      toggleAddForm();
      loadWorks();
      showToast('Work added successfully with ImageBB!', 'success');
      
      // Switch to works section to show new item
      showSection('works', null);
    } else {
      throw new Error(data.error?.message || 'ImageBB upload failed');
    }
  } catch (error) {
    console.error("Error uploading to ImageBB:", error);
    showToast('Error uploading image: ' + error.message, 'error');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Load Works
async function loadWorks() {
  const worksList = document.getElementById("worksList");
  if (!worksList) return;
  
  worksList.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const snapshot = await db.collection("works").orderBy("createdAt", "desc").get();
    
    if (snapshot.empty) {
      worksList.innerHTML = '<div class="no-data">No works found. Click "Add New Work" to create your first project!</div>';
      return;
    }

    worksList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const date = new Date(data.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      worksList.innerHTML += `
        <div class="work-card" data-id="${doc.id}">
          <div class="work-image">
            <img src="${data.imageUrl}" alt="${data.title}" loading="lazy">
            <div class="work-overlay">
              <button onclick="editWork('${doc.id}')" title="Edit Work">
                <i class="fas fa-edit"></i>
              </button>
              <button onclick="deleteWork('${doc.id}')" title="Delete Work">
                <i class="fas fa-trash"></i>
              </button>
              <button onclick="viewWork('${doc.id}')" title="View Details">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <div class="work-info">
            <h4>${data.title}</h4>
            <span class="work-category">${data.category}</span>
            <div class="work-date">Added: ${date}</div>
          </div>
        </div>
      `;
    });

    updateDashboardStats();
  } catch (error) {
    console.error("Error loading works:", error);
    worksList.innerHTML = '<div class="error-message">Error loading works. Please refresh the page.</div>';
  }
}

// Delete from ImageBB
async function deleteFromImageBB(deleteUrl) {
  try {
    if (deleteUrl) {
      await fetch(deleteUrl, { method: 'GET' });
      return true;
    }
  } catch (error) {
    console.error("Error deleting from ImageBB:", error);
    return false;
  }
}

// Delete Work
async function deleteWork(id) {
  if (confirm('Are you sure you want to delete this work? This action cannot be undone.')) {
    const deleteBtn = event.currentTarget;
    const originalHTML = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    deleteBtn.disabled = true;

    try {
      // Get the work data first to get deleteUrl
      const workDoc = await db.collection("works").doc(id).get();
      const workData = workDoc.data();
      
      // Delete from ImageBB if deleteUrl exists
      if (workData.deleteUrl) {
        await deleteFromImageBB(workData.deleteUrl);
      }
      
      // Delete from Firestore
      await db.collection("works").doc(id).delete();
      
      // Remove card with animation
      const card = document.querySelector(`.work-card[data-id="${id}"]`);
      if (card) {
        card.style.animation = 'scaleOut 0.3s ease forwards';
        setTimeout(() => {
          loadWorks();
        }, 300);
      } else {
        loadWorks();
      }
      
      showToast('Work deleted successfully!', 'success');
    } catch (error) {
      console.error("Error deleting work:", error);
      showToast('Error deleting work. Please try again.', 'error');
    } finally {
      deleteBtn.innerHTML = originalHTML;
      deleteBtn.disabled = false;
    }
  }
}

// Add scaleOut animation
const scaleOutStyle = document.createElement('style');
scaleOutStyle.textContent = `
  @keyframes scaleOut {
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }
`;
document.head.appendChild(scaleOutStyle);

// Edit Work
async function editWork(id) {
  try {
    const workDoc = await db.collection("works").doc(id).get();
    const workData = workDoc.data();
    
    // Populate form with work data
    document.getElementById("title").value = workData.title;
    document.getElementById("category").value = workData.category;
    
    // Show preview if image exists
    if (workData.imageUrl) {
      const preview = document.getElementById('imagePreview');
      preview.innerHTML = `<img src="${workData.imageUrl}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 12px; margin-top: 16px;">`;
    }
    
    // Show form
    const form = document.getElementById('addWorkForm');
    form.classList.remove('hidden');
    
    // Change submit button text
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Work';
    
    // Store current work ID for update
    currentWorkId = id;
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    showToast('Edit mode activated', 'success');
  } catch (error) {
    console.error("Error editing work:", error);
    showToast('Error loading work data', 'error');
  }
}

// View Work
function viewWork(id) {
  // Implement view details modal or redirect
  showToast('View feature coming soon!', 'success');
}

// Load Messages
async function loadMessages() {
  const contactList = document.getElementById("contactList");
  if (!contactList) return;
  
  contactList.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const snapshot = await db.collection("messages").orderBy("createdAt", "desc").get();
    
    if (snapshot.empty) {
      contactList.innerHTML = '<div class="no-data">No messages yet. They will appear here when someone contacts you.</div>';
      return;
    }

    contactList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const date = data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Date not available';

      // Truncate long messages
      const messagePreview = data.message && data.message.length > 150 
        ? data.message.substring(0, 150) + '...' 
        : data.message || 'No message content';

      contactList.innerHTML += `
        <div class="message-card" data-id="${doc.id}">
          <div class="message-header">
            <div>
              <h4>${data.name || 'Anonymous'}</h4>
              <div class="message-email">
                <i class="fas fa-envelope"></i>
                ${data.email || 'No email provided'}
              </div>
            </div>
            <span class="message-date">${date}</span>
          </div>
          <div class="message-content">
            ${messagePreview}
          </div>
          <div class="message-actions">
            <button class="reply-btn" onclick="replyToMessage('${data.email}')">
              <i class="fas fa-reply"></i> Reply
            </button>
            <button class="delete-btn" onclick="deleteMessage('${doc.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
    });

    // Update message badge
    unreadMessages = snapshot.size;
    if (messageBadge) {
      messageBadge.textContent = unreadMessages;
      messageBadge.style.display = unreadMessages > 0 ? 'inline' : 'none';
    }
    
    updateDashboardStats();
  } catch (error) {
    console.error("Error loading messages:", error);
    contactList.innerHTML = '<div class="error-message">Error loading messages. Please refresh the page.</div>';
  }
}

// Delete Message
async function deleteMessage(id) {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      await db.collection("messages").doc(id).delete();
      
      // Remove card with animation
      const card = document.querySelector(`.message-card[data-id="${id}"]`);
      if (card) {
        card.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
          loadMessages();
        }, 300);
      } else {
        loadMessages();
      }
      
      showToast('Message deleted successfully!', 'success');
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast('Error deleting message. Please try again.', 'error');
    }
  }
}

// Add slideOut animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
  @keyframes slideOutRight {
    to {
      opacity: 0;
      transform: translateX(30px);
    }
  }
`;
document.head.appendChild(slideOutStyle);

// Reply to Message
function replyToMessage(email) {
  if (email && email !== 'No email provided' && email !== 'No email') {
    window.location.href = `mailto:${email}`;
    showToast('Opening email client...', 'success');
  } else {
    showToast('No email address available for reply.', 'error');
  }
}

// Filter Messages
function filterMessages(searchTerm) {
  const messages = document.querySelectorAll('.message-card');
  searchTerm = searchTerm.toLowerCase().trim();

  if (searchTerm === '') {
    messages.forEach(message => {
      message.style.display = 'block';
    });
    return;
  }

  messages.forEach(message => {
    const text = message.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      message.style.display = 'block';
      // Highlight matching text (optional)
      message.style.animation = 'pulse 0.3s ease';
      setTimeout(() => {
        message.style.animation = '';
      }, 300);
    } else {
      message.style.display = 'none';
    }
  });
  
  // Show count of visible messages
  const visibleCount = Array.from(messages).filter(m => m.style.display !== 'none').length;
  if (visibleCount === 0) {
    showToast('No messages match your search', 'error');
  }
}

// Update Dashboard Stats
async function updateDashboardStats() {
  try {
    // Get total works
    const worksSnapshot = await db.collection("works").get();
    const totalWorks = worksSnapshot.size;
    const totalWorksElement = document.getElementById('totalWorks');
    if (totalWorksElement) totalWorksElement.textContent = totalWorks;

    // Get total messages
    const messagesSnapshot = await db.collection("messages").get();
    const totalMessages = messagesSnapshot.size;
    const totalMessagesElement = document.getElementById('totalMessages');
    if (totalMessagesElement) totalMessagesElement.textContent = totalMessages;

    // Get this month's works
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthWorksSnapshot = await db.collection("works")
      .where("createdAt", ">=", startOfMonth)
      .get();
    const monthWorksElement = document.getElementById('monthWorks');
    if (monthWorksElement) monthWorksElement.textContent = monthWorksSnapshot.size;

    // Get unique categories
    const categories = new Set();
    worksSnapshot.forEach(doc => {
      categories.add(doc.data().category);
    });
    const totalCategoriesElement = document.getElementById('totalCategories');
    if (totalCategoriesElement) totalCategoriesElement.textContent = categories.size;

    // Update recent activity
    updateRecentActivity();
    
    // Update chart bars (simple animation)
    updateChartBars();
  } catch (error) {
    console.error("Error updating stats:", error);
  }
}

// Update Chart Bars
function updateChartBars() {
  const bars = document.querySelectorAll('.bar');
  if (bars.length) {
    bars.forEach((bar, index) => {
      // Random heights for demo - replace with actual data
      const heights = [40, 65, 30, 80, 55, 70, 45];
      setTimeout(() => {
        bar.style.height = heights[index] + 'px';
      }, index * 100);
    });
  }
}

// Update Recent Activity
async function updateRecentActivity() {
  const activityList = document.getElementById('recentActivity');
  if (!activityList) return;
  
  try {
    // Get recent works
    const worksSnapshot = await db.collection("works")
      .orderBy("createdAt", "desc")
      .limit(3)
      .get();

    // Get recent messages
    const messagesSnapshot = await db.collection("messages")
      .orderBy("createdAt", "desc")
      .limit(3)
      .get();

    let activities = [];

    worksSnapshot.forEach(doc => {
      const data = doc.data();
      activities.push({
        type: 'work',
        title: `New work added: "${data.title}"`,
        time: data.createdAt,
        icon: 'fa-briefcase',
        color: '#6366f1'
      });
    });

    messagesSnapshot.forEach(doc => {
      const data = doc.data();
      activities.push({
        type: 'message',
        title: `New message from ${data.name || 'Anonymous'}`,
        time: data.createdAt,
        icon: 'fa-envelope',
        color: '#ec4899'
      });
    });

    // Sort by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    activities = activities.slice(0, 5);

    if (activities.length === 0) {
      activityList.innerHTML = '<div class="no-data">No recent activity</div>';
      return;
    }

    activityList.innerHTML = activities.map((activity, index) => {
      const time = activity.time ? new Date(activity.time).toLocaleDateString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      }) : 'Just now';
      
      return `
        <div class="activity-item" style="animation-delay: ${index * 0.1}s">
          <div class="activity-icon" style="background: ${activity.color}20; color: ${activity.color}">
            <i class="fas ${activity.icon}"></i>
          </div>
          <div class="activity-details">
            <p>${activity.title}</p>
            <small><i class="far fa-clock"></i> ${time}</small>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error("Error updating activity:", error);
  }
}

// Load Analytics
async function loadAnalytics() {
  try {
    const worksSnapshot = await db.collection("works").get();
    const messagesSnapshot = await db.collection("messages").get();
    
    // Calculate category distribution
    const categories = {};
    worksSnapshot.forEach(doc => {
      const category = doc.data().category;
      categories[category] = (categories[category] || 0) + 1;
    });
    
    // Update category list in analytics
    const categoryList = document.querySelector('.category-list');
    if (categoryList) {
      categoryList.innerHTML = Object.entries(categories)
        .map(([category, count]) => `
          <div class="category-item">
            <span>${category}</span>
            <span class="category-count">${count}</span>
          </div>
        `).join('');
    }
    
    showToast('Analytics loaded successfully', 'success');
  } catch (error) {
    console.error("Error loading analytics:", error);
  }
}

// Change Password
function changePassword() {
  const currentPass = document.getElementById('currentPass').value;
  const newPass = document.getElementById('newPass').value;
  const confirmPass = document.getElementById('confirmPass').value;

  if (!currentPass || !newPass || !confirmPass) {
    showToast('Please fill all fields!', 'error');
    return;
  }

  if (newPass !== confirmPass) {
    showToast('New passwords do not match!', 'error');
    return;
  }

  if (currentPass !== ADMIN_PASSWORD) {
    showToast('Current password is incorrect!', 'error');
    return;
  }

  if (newPass.length < 8) {
    showToast('Password must be at least 8 characters long!', 'error');
    return;
  }

  // Simulate password update
  showToast('Password updated successfully! (Demo - no actual changes)', 'success');
  
  // Clear fields
  document.getElementById('currentPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
}

// Toast Notification
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Auto-refresh data every 30 seconds
setInterval(() => {
  if (!document.getElementById('loginScreen')?.classList.contains('hidden')) {
    return; // Don't refresh if not logged in
  }
  
  const activeSection = document.querySelector('.content-section.active-section');
  if (activeSection) {
    if (activeSection.id === 'dashboardSection') {
      updateDashboardStats();
    } else if (activeSection.id === 'worksSection') {
      loadWorks();
    } else if (activeSection.id === 'messagesSection') {
      loadMessages();
    } else if (activeSection.id === 'analyticsSection') {
      loadAnalytics();
    }
  }
}, 30000);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl + L to focus login input
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
      passwordInput.focus();
    }
  }
  
  // Escape key to close forms
  if (e.key === 'Escape') {
    const addForm = document.getElementById('addWorkForm');
    if (addForm && !addForm.classList.contains('hidden')) {
      if (confirm('Close form? Any unsaved changes will be lost.')) {
        toggleAddForm();
      }
    }
  }
  
  // Ctrl + N to add new work (when in works section)
  if (e.ctrlKey && e.key === 'n') {
    e.preventDefault();
    const worksSection = document.getElementById('worksSection');
    if (worksSection && worksSection.classList.contains('active-section')) {
      toggleAddForm();
    }
  }
});

// Handle window resize
window.addEventListener('resize', function() {
  if (window.innerWidth > 992) {
    document.getElementById('sidebar')?.classList.remove('show');
  }
});

// Click outside to close mobile sidebar
document.addEventListener('click', function(e) {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (window.innerWidth <= 992 && 
      sidebar && 
      sidebar.classList.contains('show') && 
      !sidebar.contains(e.target) && 
      !menuToggle?.contains(e.target)) {
    sidebar.classList.remove('show');
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if already logged in (optional - could check session storage)
  const loginScreen = document.getElementById('loginScreen');
  const adminPanel = document.getElementById('adminPanel');
  
  if (loginScreen && adminPanel) {
    // Add fade-in animation to cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      card.style.animationDelay = `${0.1 * index}s`;
    });
  }
  
  // Update notification badge
  if (messageBadge) {
    messageBadge.style.display = 'none';
  }
});