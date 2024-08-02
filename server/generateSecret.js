const crypto = require('crypto');

function generateJWTSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

const newJWTSecret = generateJWTSecret();
console.log('New JWT_SECRET:', newJWTSecret);

// Remember to add this to your .env file:
console.log('Add this line to your .env file:');
console.log(`JWT_SECRET=${newJWTSecret}`);