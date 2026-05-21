function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  const logoPath = window.location.pathname === "/" ? "./assets/images/logo/logo.png" : "/assets/images/logo/logo.png";

  footer.innerHTML = `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-logo">
          <img src="${logoPath}" alt="Clinic Management System Logo">
          <p>&copy; Copyright 2025. All Rights Reserved by Clinic Management System.</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div class="footer-column">
            <h4>Support</h4>
            <a href="#">Account</a>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
          </div>
          <div class="footer-column">
            <h4>Legals</h4>
            <a href="#">Terms</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Licensing</a>
          </div>
        </div>
      </div>
    </footer>`;
}

renderFooter();
