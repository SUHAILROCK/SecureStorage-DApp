const connectBtn = document.getElementById("connectBtn");
const storeBtn = document.getElementById("storeBtn");
const verifyBtn = document.getElementById("verifyBtn");
const hashInput = document.getElementById("hashInput");
const resultEl = document.getElementById("result");
const fileInput = document.getElementById("fileInput");
const generatedHashDisplay = document.getElementById("generatedHashDisplay");
const walletStatusEl = document.getElementById("walletStatus");

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "storeDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "verifyDocument",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (!window.ethereum) {
    walletStatusEl.textContent = "MetaMask not found. Please install MetaMask.";
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const walletAddress = await signer.getAddress();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    walletStatusEl.textContent = `Connected: ${walletAddress}`;
  } catch (error) {
    walletStatusEl.textContent = `Connection failed: ${error.message}`;
  }
}

async function storeHash() {
  const hash = hashInput.value.trim();
  if (!hash) {
    resultEl.textContent = "Enter a hash first.";
    return;
  }
  if (!contract) {
    resultEl.textContent = "Connect wallet first.";
    return;
  }

  try {
    resultEl.textContent = "Storing hash...";
    const tx = await contract.storeDocument(hash);
    await tx.wait();
    resultEl.textContent = "Hash stored successfully.";
  } catch (error) {
    resultEl.textContent = `Store failed: ${error.shortMessage || error.message}`;
  }
}

async function verifyHash() {
  const hash = hashInput.value.trim();
  if (!hash) {
    resultEl.textContent = "Enter a hash first.";
    return;
  }
  if (!contract) {
    resultEl.textContent = "Connect wallet first.";
    return;
  }

  try {
    const isValid = await contract.verifyDocument(hash);
    resultEl.textContent = isValid
      ? "Verification result: Hash matches stored value."
      : "Verification result: Hash does not match.";
  } catch (error) {
    resultEl.textContent = `Verify failed: ${error.shortMessage || error.message}`;
  }
}

connectBtn.addEventListener("click", connectWallet);
storeBtn.addEventListener("click", storeHash);
verifyBtn.addEventListener("click", verifyHash);

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    resultEl.textContent = "Reading and hashing file...";
    
    // Read the file entirely as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Check if crypto.subtle is available (it requires HTTPS or localhost)
    if (!crypto || !crypto.subtle) {
        throw new Error("Web Crypto API is not available. This is usually because the site is not served over HTTPS or localhost.");
    }
    
    // Generate SHA-256 hash using the Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    
    // Convert the buffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Display the hash on the screen so user can copy it
    generatedHashDisplay.innerText = `0x${hashHex}`;
    generatedHashDisplay.style.display = 'block';
    resultEl.textContent = `File hashed successfully. File size: ${(file.size / 1024).toFixed(2)} KB`;
  } catch (error) {
    resultEl.textContent = `Hashing failed: ${error.message}`;
  }
});
