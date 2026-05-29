const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'client', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace white translucent overlays with black translucent for light mode
css = css.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)/g, 'rgba(0, 0, 0, $1)');

// Replace specific dark hardcoded colors (like the navbar)
css = css.replace(/rgba\(\s*10\s*,\s*14\s*,\s*26\s*,\s*([0-9.]+)\s*\)/g, 'rgba(255, 255, 255, $1)');
css = css.replace(/rgba\(\s*17\s*,\s*24\s*,\s*39\s*,\s*([0-9.]+)\s*\)/g, 'rgba(255, 255, 255, $1)');

// The CSS variables for text colors in the light theme were:
// --text-primary: #171717;
// --text-inverse: #ffffff;
// But the buttons use `color: white;` directly.
// Let's replace `color: white;` with `color: var(--text-inverse);`
css = css.replace(/color:\s*white;/g, 'color: var(--text-inverse);');

fs.writeFileSync(cssPath, css);
console.log('CSS colors updated successfully.');
