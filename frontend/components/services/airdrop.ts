import axios from 'axios';

// Define the API base URL
const API_BASE_URL = '/api/airdrop';

// Function to get eligible users for an airdrop
export async function getEligibleUsers() {
  try {
    const response = await axios.get(`${API_BASE_URL}?action=eligible-users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching eligible users:', error);
    throw new Error('Unable to fetch eligible users');
  }
}

// Function to get pending claims for a specific airdrop
export async function getPendingClaims(airdropId: number) {
  try {
    const response = await axios.get(`${API_BASE_URL}?action=pending-claims&airdropId=${airdropId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending claims:', error);
    throw new Error('Unable to fetch pending claims');
  }
}

// Function to update claim status
export async function updateClaimStatus(claimId: number, newStatus: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}`, {
      action: 'update-claim-status',
      claimId,
      newStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw new Error('Unable to update claim status');
  }
}

// Function to get airdrop statistics
export async function getAirdropStats() {
  try {
    const response = await axios.get(`${API_BASE_URL}?action=airdrop-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching airdrop statistics:', error);
    throw new Error('Unable to fetch airdrop statistics');
  }
}
