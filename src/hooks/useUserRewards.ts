function useUserRewards(profileData: any) {
  const user = profileData?.me;
  
  // Immutable data from the server
  const walletBalance = user?.balance || 0;
  const loyaltyPoints = user?.coins || 0;

  // Logic for calculations (e.g., 100 points = KES 10)
  const calculatePointsDiscount = (points: number) => (points / 100) * 10;

  return {
    walletBalance,
    loyaltyPoints,
    calculatePointsDiscount,
    hasWalletFunds: walletBalance > 0,
    hasPoints: loyaltyPoints > 0
  };
}