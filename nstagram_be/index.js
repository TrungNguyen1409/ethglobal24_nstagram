const express = require('express');
const multer = require('multer');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Dummy smart contract interaction
async function mintNFT(filePath, userId) {
  // Set up your provider and wallet (this is a simplified example)
  const provider = new ethers.providers.JsonRpcProvider('https://your_rpc_provider_url');
  const wallet = new ethers.Wallet('your_private_key', provider);

  // Smart contract interaction
  const contractAddress = 'your_smart_contract_address';
  const abi = [ /* Your contract ABI */ ];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Minting logic (simplified)
  const tx = await contract.mintNFT(userId, filePath);
  await tx.wait();

  console.log('NFT minted:', tx);
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    // Move file to a permanent location if necessary
    const permanentPath = path.join(__dirname, 'uploads', file.originalname);
    fs.renameSync(file.path, permanentPath);

    // Mint NFT with the file path and user ID
    await mintNFT(permanentPath, userId);

    res.status(200).send('File uploaded and NFT minted successfully!');
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).send('Failed to upload file and mint NFT.');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});