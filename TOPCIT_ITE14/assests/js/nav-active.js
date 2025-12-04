// Set active navigation item based on current page and handle clicks
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'course.html';
  const navItems = document.querySelectorAll('.nav-item');
  const STORAGE_KEY = 'activeNavIndex';
  
  // Function to set active nav item
  function setActiveNav(index) {
    navItems.forEach(item => item.classList.remove('nav-item--active'));
    if (navItems[index]) {
      navItems[index].classList.add('nav-item--active');
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, String(index));
    }
  }
  
  // Determine which item should be active based on current page
  let activeIndex = 0;  // Default to home
  
  if (currentPage === 'course.html' || currentPage === '') {
    activeIndex = 0;
  } else if (currentPage.startsWith('course_details')) {
    activeIndex = 1;
  }
  
  // Check if there's a saved active index in localStorage
  const savedIndex = localStorage.getItem(STORAGE_KEY);
  if (savedIndex !== null) {
    activeIndex = parseInt(savedIndex, 10);
  }
  
  // Set initial active state
  setActiveNav(activeIndex);
  
  // Add click handlers to nav items to update on click
  navItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      // Only prevent default if it's not a valid link
      setActiveNav(index);
      // Don't prevent default - let the link navigate
    });
  });
})();
