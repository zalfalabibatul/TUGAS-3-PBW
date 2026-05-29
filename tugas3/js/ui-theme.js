/* ================================================
   UI THEME CONFIGURATION
   Navy Blue Vibes & Enhanced Typography
   ================================================ */

(function() {
    // Update CSS Variables for Navy Blue Theme
    const themeStyles = `
    :root {
      /* Navy Blue Color Palette */
      --primary-navy: #001a4d;
      --primary-navy-light: #0033a0;
      --primary-navy-lighter: #004ccc;
      --secondary-navy: #1a4d7f;
      --tertiary-navy: #2a5fa6;
      --accent-gold: #ffc107;
      --accent-gold-light: #ffca28;
      
      /* Text Colors */
      --text-primary: #0a1929;
      --text-secondary: #3a5578;
      --text-muted: #667085;
      
      /* Background Colors */
      --bg-primary: #f5f7fa;
      --bg-secondary: #ffffff;
      --bg-overlay: rgba(0, 26, 77, 0.95);
      
      /* Borders & Shadows */
      --border-navy: #1a4d7f;
      --shadow-navy: 0 4px 20px rgba(0, 26, 77, 0.15);
      --shadow-navy-lg: 0 8px 32px rgba(0, 26, 77, 0.2);
      
      /* Enhanced Typography */
      --font-family: 'Segoe UI', 'Roboto', 'Poppins', sans-serif;
      --font-size-base: 15px;
      --font-weight-regular: 400;
      --font-weight-medium: 500;
      --font-weight-semibold: 600;
      --font-weight-bold: 700;
      --font-weight-extrabold: 800;
      
      /* Transitions */
      --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;

    // Apply theme styles
    const styleElement = document.createElement('style');
    styleElement.textContent = themeStyles;
    document.head.appendChild(styleElement);

    // Apply enhanced typography to body
    const bodyStyle = `
    body {
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-regular);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `;
    const bodyStyleEl = document.createElement('style');
    bodyStyleEl.textContent = bodyStyle;
    document.head.appendChild(bodyStyleEl);

    window.UITheme = {
        initialized: true,
        brandName: 'SITTA'
    };
})();