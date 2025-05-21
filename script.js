const login = document.getElementById('login');
const signUp = document.getElementById('signUp');

// Alert functions
function showElegantAlert(title, message) {
  const alertOverlay = document.createElement('div');
  alertOverlay.className = 'elegant-alert-overlay';
  alertOverlay.innerHTML = `
    <div class="elegant-alert-box">
      <div class="elegant-alert-header">
        <svg class="elegant-alert-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
        </svg>
        <h3>${title}</h3>
      </div>
      <div class="elegant-alert-body">
        <p>${message}</p>
      </div>
      <div class="elegant-alert-footer">
        <button class="elegant-alert-button">Mengerti</button>
      </div>
    </div>
  `;
  document.body.appendChild(alertOverlay);
  
  // Close functionality
  const confirmBtn = alertOverlay.querySelector('.elegant-alert-button');
  const closeAlert = () => {
    alertOverlay.style.opacity = '0';
    setTimeout(() => alertOverlay.remove(), 200);
  };
  
  confirmBtn.addEventListener('click', closeAlert);
  alertOverlay.addEventListener('click', (e) => {
    if (e.target === alertOverlay) closeAlert();
  });
}

// Implementasi
login.addEventListener('click', function(e) {
  e.preventDefault();
  showElegantAlert(
    'Fitur Belum Tersedia', 
    'Mohon maaf, fitur login sedang dalam pengembangan.\n\nAnda dapat melakukan pemesanan langsung melalui WhatsApp kami.'
  );
});

signUp.addEventListener('click', function(e) {
  e.preventDefault();
  showElegantAlert(
    'Fitur Belum Tersedia', 
    'Mohon maaf, fitur login sedang dalam pengembangan.\n\nAnda dapat melakukan pemesanan langsung melalui WhatsApp kami.'
  );
});

document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('searchForm');
  const productContainer = document.getElementById('productContainer');
  const allProducts = document.querySelectorAll('.product-item');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navbarToggler = document.querySelector('.navbar-toggler');
  
  // Create Rubik's cube loading element
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading-overlay';
  loadingElement.innerHTML = `
    <div class="rubik-container">
      <div class="rubik-cube">
        <div class="rubik-face front"></div>
        <div class="rubik-face back"></div>
        <div class="rubik-face right"></div>
        <div class="rubik-face left"></div>
        <div class="rubik-face top"></div>
        <div class="rubik-face bottom"></div>
      </div>
      <div class="loading-text">Mencari Produk...</div>
    </div>
  `;
  document.body.appendChild(loadingElement);

  function showLoading() {
    loadingElement.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hideLoading() {
    loadingElement.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
      loadingElement.style.display = 'none';
      loadingElement.style.animation = '';
      document.body.style.overflow = '';
    }, 300);
  }

  // Simpan HTML asli
  const originalHTML = productContainer.innerHTML;
  let notFoundMessage = null;

  function restoreOriginalState() {
    // Hapus pesan not found jika ada
    if (notFoundMessage) {
      notFoundMessage.remove();
      notFoundMessage = null;
    }
    
    // Tampilkan semua produk
    const products = document.querySelectorAll('.product-item');
    products.forEach(product => {
      product.style.display = 'block';
    });
  }

  function scrollToElement(element, offset = 30) {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  searchForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    showLoading();
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Tutup navbar di mobile
    if (navbarCollapse.classList.contains('show')) {
      navbarToggler.click();
    }
    
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
      restoreOriginalState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      hideLoading();
      return;
    }
    
    // Hapus pesan not found sebelumnya jika ada
    if (notFoundMessage) {
      notFoundMessage.remove();
      notFoundMessage = null;
    }
    
    // Filter produk
    const products = document.querySelectorAll('.product-item');
    let hasVisibleProducts = false;
    let firstVisibleProduct = null;
    
    products.forEach(product => {
      const productName = product.getAttribute('data-product-name').toLowerCase();
      const productCategory = product.getAttribute('data-category').toLowerCase();
      const isVisible = productName.includes(searchTerm) || productCategory.includes(searchTerm);
      
      if (isVisible) {
        hasVisibleProducts = true;
        if (!firstVisibleProduct) {
          firstVisibleProduct = product;
        }
      }
      
      product.style.display = isVisible ? 'block' : 'none';
    });
    
    // Handle hasil pencarian
    if (!hasVisibleProducts) {
      const notFoundHTML = `
        <div class="not-found-container" id="notFoundMessage">
          <h4>Produk "${searchTerm}" tidak ditemukan</h4>
          <button class="btn btn-primary mt-3" id="showAllBtn">
            Tampilkan Semua Produk
          </button>
        </div>`;
      
      // Buat elemen not found
      notFoundMessage = document.createElement('div');
      notFoundMessage.innerHTML = notFoundHTML;
      productContainer.appendChild(notFoundMessage);
      
      // Tambahkan event listener untuk tombol
      document.getElementById('showAllBtn').addEventListener('click', function() {
        restoreOriginalState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      
      // Scroll ke pesan tidak ditemukan setelah rendering
      setTimeout(() => {
        scrollToElement(notFoundMessage, 100);
      }, 50);
    } else {
      // Scroll ke produk pertama yang ditemukan
      setTimeout(() => {
        if (firstVisibleProduct) {
          scrollToElement(firstVisibleProduct);
          firstVisibleProduct.classList.add('highlight');
          setTimeout(() => firstVisibleProduct.classList.remove('highlight'), 1500);
        }
      }, 50);
    }
    
    hideLoading();
  });
});