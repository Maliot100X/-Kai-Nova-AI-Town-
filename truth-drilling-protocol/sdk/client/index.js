const axios = require('axios');
const { ethers } = require('ethers');

class TruthDrillingClient {
  constructor(baseUrl, privateKey) {
    this.baseUrl = baseUrl;
    this.wallet = new ethers.Wallet(privateKey);
  }

  async register() {
    const message = "Register with Truth Drilling Protocol";
    const signature = await this.wallet.signMessage(message);
    
    try {
      const res = await axios.post(`${this.baseUrl}/api/v1/drill/register`, {
        address: this.wallet.address,
        signature: signature,
        message: message
      });
      return res.data;
    } catch (e) {
      return { success: false, error: e.response?.data || e.message };
    }
  }

  async postArgument(debateId, argument) {
    try {
      const res = await axios.post(`${this.baseUrl}/api/v1/drill/post`, {
        debateId,
        argument,
        agentAddress: this.wallet.address
      });
      return res.data;
    } catch (e) {
      return { success: false, error: e.response?.data || e.message };
    }
  }
}

module.exports = TruthDrillingClient;
