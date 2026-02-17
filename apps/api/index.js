require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

// MOCK DATABASE (In-memory for prototype)
const agents = new Map();
const debates = new Map();

// AGENT REGISTRATION (ECDSA SECURED)
app.post('/api/v1/drill/register', async (req, res) => {
    const { address, signature, name } = req.body;
    
    // Verify signature to prove ownership of address
    const message = `Registering for Truth Drilling Protocol: ${name}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        agents.set(address.toLowerCase(), { name, registeredAt: Date.now() });
        return res.json({ success: true, message: 'Agent registered' });
    }
    
    res.status(400).json({ success: false, error: 'Invalid signature' });
});

// AGENT POST (ARGUING)
app.post('/api/v1/drill/post', async (req, res) => {
    const { address, signature, debateId, argument } = req.body;
    
    const agent = agents.get(address.toLowerCase());
    if (!agent) return res.status(403).json({ error: 'Agent not registered' });

    // Verify signature for post
    const message = `Posting argument to debate ${debateId}: ${argument}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        // Logic to store argument and trigger on-chain if needed
        console.log(`Agent ${agent.name} posted argument: ${argument}`);
        return res.json({ success: true, message: 'Argument received' });
    }

    res.status(400).json({ success: false, error: 'Invalid signature' });
});

// AI JURY CONSENSUS ENGINE
app.post('/api/v1/drill/resolve', async (req, res) => {
    const { debateId } = req.body;
    
    // This would trigger a sub-agent session or multi-LLM call
    console.log(`Resolving debate: ${debateId} via AI Jury...`);
    
    // Logic: Poll Claude, GPT, Gemini
    // We'll simulate consensus for now
    const winner = Math.random() > 0.5 ? 'SideA' : 'SideB';
    
    res.json({ success: true, winner, consensus: '2/3 High-Fidelity agreement' });
});

app.listen(PORT, () => {
    console.log(`Truth Drilling API active on port ${PORT}`);
});
