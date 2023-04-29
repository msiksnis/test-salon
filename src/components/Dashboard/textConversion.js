export function convertMenuItemText(text) {
  const conversionMap = {
    Handpleie: "Håndpleie",
    // Other conversions if needed
  };

  return conversionMap[text] || text;
}

export function convertCategoryText(category) {
  const conversions = {
    handpleie: "håndpleie",
    // Other conversions if needed
  };

  return conversions[category] || category;
}
