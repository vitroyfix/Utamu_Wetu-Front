// lib/searchUtils.ts

/**
 * Enhanced Smart Search with Keyword Estimation
 * Handles typos (lomon -> lemon) and keywords (steak -> Meat & Poultry)
 */
export const handleSmartSearch = (
  query: string,
  categories: any[],
  router: any,
  setIsSearchOpen: (val: boolean) => void,
  setSearchQuery: (val: string) => void
) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length > 1) {
    // 1. FUZZY MATCHING / ESTIMATION
    const matchedCategory = categories.find((cat: any) => {
      const catName = cat.name.toLowerCase();
      
      // Check A: Does the category contain the query? (e.g., "steak" in "Meat & Steak")
      const isDirectMatch = catName.includes(normalizedQuery);
      
      // Check B: Typo Tolerance (First 3 letters match - handles "lomon" vs "lemon")
      const isTypoMatch = catName.substring(0, 3) === normalizedQuery.substring(0, 3);

      // Check C: Keyword Associations (Manual overrides for common searches)
      const associations: Record<string, string[]> = {
        "meat": ["steak", "beef", "chicken", "mutton"],
        "fruits": ["lomon", "lemon", "apple", "mango"],
        "dairy": ["milk", "cheese", "yogurt"]
      };

      const isAssociated = associations[catName]?.some(keyword => 
        normalizedQuery.includes(keyword) || keyword.includes(normalizedQuery)
      );

      return isDirectMatch || isTypoMatch || isAssociated;
    });

    if (matchedCategory) {
      // If we estimated a category, redirect to that department
      router.push(`/shop?category=${matchedCategory.name}`);
      setSearchQuery(""); 
      setIsSearchOpen(false); 
      return true; 
    }
  }
  return false; // Proceed to standard product title search
};