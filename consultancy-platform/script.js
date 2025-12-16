// In-memory data storage
const db = {
    users: [],
    consultants: [],
    bookings: [],
    reviews: [],
    payments: [],
    categories: [
        { id: 'legal', name: 'Legal', icon: 'fa-gavel' },
        { id: 'business', name: 'Business', icon: 'fa-chart-line' },
        { id: 'technical', name: 'Technical', icon: 'fa-code' },
        { id: 'financial', name: 'Financial', icon: 'fa-coins' },
        { id: 'healthcare', name: 'Healthcare', icon: 'fa-heartbeat' },
        { id: 'education', name: 'Education', icon: 'fa-graduation-cap' }
    ]
};

// Sample consultant data
const sampleConsultants = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        email: "sarah.j@example.com",
        expertise: "legal",
        experience: 10,
        description: "Corporate lawyer specializing in business law",
        rate: 150,
        rating: 4.8,
        availability: ["2024-01-15", "2024-01-16", "2024-01-17"]
    },
    {
        id: 2,
        name: "Michael Chen",
        email: "m.chen@example.com",
        expertise: "business",
        experience: 8,
        description: "Business strategist with Fortune 500 experience",
        rate: 200,
        rating: 4.9,
        availability: ["2024-01-15", "2024-01-18", "2024-01-19"]
    },
    {
        id: 3,
        name: "David Wilson",
        email: "d.wilson@example.com",
        expertise: "technical",
        experience: 12,
        description: "Software architecture and cloud solutions expert",
        rate: 180,
        rating: 4.7,
        availability: ["2024-01-16", "2024-01-17", "2024-01-20"]
    },
    {
        id: 4,
        name: "Emma Rodriguez",
        email: "e.rodriguez@example.com",
        expertise: "financial",
        experience: 15,
        description: "CFA with expertise in investment strategies",
        rate: 250,
        rating: 4.9,
        availability: ["2024-01-15", "2024-01-19", "2024-01-20"]
    },
    {
        id: 5,
        name: "Dr. James Miller",
        email: "j.miller@example.com",
        expertise: "healthcare",
        experience: 20,
        description: "Healthcare consultant with hospital management experience",
        rate: 175,
        rating: 4.8,
        availability: ["2024-01-17", "2024-01-18", "2024-01-21"]
    },
    {
        id: 6,
        name: "Lisa Thompson",
        email: "l.thompson@example.com",
        expertise: "education",
        experience: 7,
        description: "Educational consultant and career counselor",
        rate: 120,
        rating: 4.6,
        availability: ["2024-01-16", "2024-01-19", "2024-01-22"]
    }
];

// Sample admin user
db.users.push({
    id: 100,
    name: "Admin User",
    email: "admin@consulthub.com",
    password: "admin123",
    type: "admin"
});

// Add sample consultants to db
sampleConsultants.forEach(consultant => {
    db.consultants.push(consultant);
    db.users.push({
        id: consultant.id,
        name: consultant.name,
        email: consultant.email,
        password: "password123",
        type: "consultant"
    });
});

// Current user state
let currentUser = null;
let currentPage = 'home';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Populate consultants
    populateConsultants();
    
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
    }
});

// Modal Functions
function showLogin() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('registerModal').style.display = 'none';
    showSection('home');
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'flex';
    document.getElementById('loginModal').style.display = 'none';
    showSection('home');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function toggleConsultantFields() {
    const userType = document.getElementById('regUserType').value;
    const consultantFields = document.getElementById('consultantFields');
    consultantFields.classList.toggle('hidden', userType !== 'consultant');
}

// Section Navigation
function showSection(section) {
    document.getElementById('categoriesSection').classList.add('hidden');
    document.getElementById('consultantsSection').classList.add('hidden');
    document.getElementById('aboutSection').classList.add('hidden');
    
    if (section === 'categories') {
        document.getElementById('categoriesSection').classList.remove('hidden');
    } else if (section === 'consultants') {
        document.getElementById('consultantsSection').classList.remove('hidden');
    } else if (section === 'about') {
        document.getElementById('aboutSection').classList.remove('hidden');
    }
    
    currentPage = section;
}

function showConsultants() {
    showSection('consultants');
}

function showCategories() {
    showSection('categories');
}

function showAbout() {
    showSection('about');
}

// User Registration
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const userType = document.getElementById('regUserType').value;
    
    // Check if user already exists
    const existingUser = db.users.find(user => user.email === email);
    if (existingUser) {
        alert('User with this email already exists!');
        return;
    }
    
    const newUser = {
        id: db.users.length + 1,
        name,
        email,
        password,
        type: userType
    };
    
    db.users.push(newUser);
    
    // If registering as consultant, add to consultants list
    if (userType === 'consultant') {
        const expertise = document.getElementById('regExpertise').value;
        const experience = document.getElementById('regExperience').value;
        
        const newConsultant = {
            id: newUser.id,
            name,
            email,
            expertise,
            experience: parseInt(experience) || 0,
            description: `Professional ${expertise} consultant`,
            rate: 100 + Math.floor(Math.random() * 150),
            rating: 4.5 + (Math.random() * 0.5),
            availability: generateAvailability()
        };
        
        db.consultants.push(newConsultant);
    }
    
    alert('Registration successful! Please login.');
    showLogin();
    
    // Reset form
    event.target.reset();
}

// User Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    const user = db.users.find(u => 
        u.email === email && 
        u.password === password && 
        u.type === userType
    );
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        alert(`Welcome back, ${user.name}!`);
        closeModal('loginModal');
        
        // Redirect based on user type
        if (user.type === 'admin') {
            window.location.href = 'admin.html';
        } else if (user.type === 'consultant') {
            window.location.href = 'consultant-dashboard.html';
        } else {
            window.location.href = 'client-dashboard.html';
        }
    } else {
        alert('Invalid credentials or user type!');
    }
    
    event.target.reset();
}

// Populate Consultants
function populateConsultants(filter = '') {
    const consultantsGrid = document.getElementById('consultantsGrid');
    if (!consultantsGrid) return;
    
    consultantsGrid.innerHTML = '';
    
    let filteredConsultants = db.consultants;
    
    if (filter) {
        filteredConsultants = db.consultants.filter(consultant => 
            consultant.expertise === filter ||
            consultant.name.toLowerCase().includes(filter.toLowerCase()) ||
            consultant.description.toLowerCase().includes(filter.toLowerCase())
        );
    }
    
    filteredConsultants.forEach(consultant => {
        const category = db.categories.find(c => c.id === consultant.expertise);
        const consultantCard = document.createElement('div');
        consultantCard.className = 'consultant-card';
        consultantCard.innerHTML = `
            <div class="consultant-header">
                <h3>${consultant.name}</h3>
                <p>${consultant.description}</p>
            </div>
            <div class="consultant-body">
                <span class="expertise">${category ? category.name : consultant.expertise}</span>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${consultant.rating.toFixed(1)}</span>
                    <span>(${consultant.experience} years experience)</span>
                </div>
                <p><i class="fas fa-clock"></i> Available: ${consultant.availability.slice(0, 3).join(', ')}</p>
            </div>
            <div class="consultant-footer">
                <div class="price">$${consultant.rate}/hour</div>
                <button class="btn-book" onclick="bookConsultation(${consultant.id})">Book Now</button>
            </div>
        `;
        consultantsGrid.appendChild(consultantCard);
    });
}

// Filter by Category
function filterByCategory(category) {
    populateConsultants(category);
}

// Search Consultants
function searchConsultants() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        populateConsultants(searchInput.value);
    }
}

// Book Consultation
function bookConsultation(consultantId) {
    if (!currentUser) {
        alert('Please login to book a consultation!');
        showLogin();
        return;
    }
    
    const consultant = db.consultants.find(c => c.id === consultantId);
    if (!consultant) return;
    
    // Store consultant in session for booking page
    sessionStorage.setItem('selectedConsultant', JSON.stringify(consultant));
    
    // Redirect to booking page
    window.location.href = 'booking.html';
}

// Generate random availability
function generateAvailability() {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (Math.random() > 0.3) { // 70% chance of being available
            dates.push(date.toISOString().split('T')[0]);
        }
    }
    return dates;
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    if (currentUser) {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const loginItem = navMenu.querySelector('a[onclick="showLogin()"]');
            const registerItem = navMenu.querySelector('a[onclick="showRegister()"]');
            
            if (loginItem) loginItem.style.display = 'none';
            if (registerItem) registerItem.style.display = 'none';
            
            // Add profile link
            const profileItem = document.createElement('li');
            profileItem.innerHTML = `<a href="#" class="nav-link">Welcome, ${currentUser.name}</a>`;
            navMenu.appendChild(profileItem);
        }
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}