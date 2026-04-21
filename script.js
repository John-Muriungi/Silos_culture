// NAV scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Set min dates
const today = new Date().toISOString().split('T')[0];
['qb-checkin', 'qb-checkout', 'checkin', 'checkout'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.min = today;
});

// Scroll to booking
function scrollToBooking() {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// Quick search bar
function quickSearch() {
  const pkg = document.getElementById('qb-package').value;
  const checkin = document.getElementById('qb-checkin').value;
  scrollToBooking();
  if (checkin) {
    setTimeout(() => {
      document.getElementById('checkin').value = checkin;
      const co = document.getElementById('qb-checkout').value;
      if (co) document.getElementById('checkout').value = co;
      updatePrice();
    }, 600);
  }
}

// Package selection from cards
function selectPackage(name, price) {
  scrollToBooking();
  setTimeout(() => {
    const options = document.querySelectorAll('.pkg-option');
    options.forEach(opt => {
      opt.classList.remove('selected');
      if (opt.querySelector('strong').textContent.includes(name.split(' ')[1] || name)) {
        opt.classList.add('selected');
      }
    });
    currentPackage = name;
    currentPrice = price;
    updatePrice();
  }, 600);
}

let currentPackage = 'Day Visit';
let currentPrice = 800;

function choosePackage(el, name, price) {
  document.querySelectorAll('.pkg-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  currentPackage = name;
  currentPrice = price;
  updatePrice();
}

function updatePrice() {
  const adults = parseInt(document.getElementById('adults').value) || 2;
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  let nights = 1;
  if (checkin && checkout) {
    const d1 = new Date(checkin), d2 = new Date(checkout);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    if (diff > 0) nights = diff;
  }
  const isDay = currentPackage === 'Day Visit';
  const total = isDay ? currentPrice * adults : currentPrice * nights;
  document.getElementById('sum-pkg').textContent = currentPackage;
  document.getElementById('sum-guests').textContent = adults + ' Adult(s)';
  document.getElementById('sum-nights').textContent = isDay ? '1 Day' : nights + ' night(s)';
  document.getElementById('sum-total').textContent = 'KSh ' + total.toLocaleString();
}

// Listen for changes
['adults', 'checkin', 'checkout'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', updatePrice);
});

// Submit booking
function submitBooking() {
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const checkin = document.getElementById('checkin').value;

  if (!fname || !lname) { alert('Please enter your full name.'); return; }
  if (!phone) { alert('Please enter your phone number.'); return; }
  if (!checkin) { alert('Please select a check-in date.'); return; }

  // Generate booking reference
  const ref = 'SCM-' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('booking-ref').textContent = ref;
  document.getElementById('success-modal').classList.add('active');

  // Reset form
  ['fname', 'lname', 'phone', 'email', 'checkin', 'checkout', 'notes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  updatePrice();
}

function closeModal() {
  document.getElementById('success-modal').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('success-modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// Initial price calc
updatePrice();