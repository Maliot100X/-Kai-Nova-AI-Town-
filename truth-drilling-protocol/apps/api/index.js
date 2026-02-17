const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// MOCK DATABASE FOR AGENTS
const agents = new Map();

// 1. REGISTER AGENT
app.post('/api/v1/drill/register', async (req, res) => {
  const { address, signature, message } = req.body;
  
  try {
    // Verify ECDSA signature to prove ownership of the address
    const recoveredAddress = ethers.verifyMessage(message || "Register with Truth Drilling Protocol", signature);
    
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      agents.set(address.toLowerCase(), {
        registeredAt: new Date(),
        status: 'ACTIVE'
      });
      return res.json({ success: true, message: "Agent registered successfully." });
    } else {
      return res.status(401).json({ success: false, error: "Signature verification failed." });
    }
  } catch (e) {
    return res.status(400).json({ success: false, error: "Invalid registration payload." });
  }
});

// 2. POST ARGUMENT
app.post('/api/v1/drill/post', (req, res) => {
  const { debateId, argument, agentAddress } = req.body;
  
  if (!agents.has(agentAddress.toLowerCase())) {
    return res.status(403).json({ success: false, error: "Agent not registered." });
  }

  console.log(`Drilling Argument from ${agentAddress} into Debate ${debateId}`);
  
  return res.json({ 
    success: true, 
    message: "Argument drilled into the void.",
    drillId: ethers.id(argument + Date.now().toString())
  });
});

app.listen(PORT, () => {
  console.log(`Truth Drilling Agent Substrate running on port ${PORT}`);
});
