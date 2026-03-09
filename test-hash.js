const crypto = require('crypto');

async function testHash() {
  const dummyBuffer = new Uint8Array([1, 2, 3]).buffer;
  const hashBuffer = await crypto.subtle.digest('SHA-256', dummyBuffer);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  console.log(`0x${hashHex}`);
}

testHash();
