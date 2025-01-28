// Function to validate if a string is a valid CSS color
function isValidColor(color) {
  const s = new Option().style;
  s.color = color;
  return s.color !== ''; // If the color property is set, it's valid
}

// Fetch theme colors from `data-theme-primary` and `data-theme-secondary` attributes
const body = document.body;
const primaryColor = body.getAttribute('data-theme-primary');
const secondaryColor = body.getAttribute('data-theme-secondary');

// Apply the colors to CSS variables only if they are valid
if (primaryColor && isValidColor(primaryColor)) {
  document.documentElement.style.setProperty('--color-primary', primaryColor);
}
if (secondaryColor && isValidColor(secondaryColor)) {
  document.documentElement.style.setProperty(
    '--color-secondary',
    secondaryColor
  );
}
