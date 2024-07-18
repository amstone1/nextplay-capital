const express = require('express');
const router = express.Router();

// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/start', async (req, res) => {
  // const { phoneNumber, channel } = req.body;

  try {
    // const verification = await client.verify.services(process.env.TWILIO_VERIFY_SERVICE_SID)
    //   .verifications.create({ to: phoneNumber, channel });
    // res.status(200).json({ message: 'Verification started', verification });
    res.status(200).json({ message: 'Verification started (bypassed)' });
  } catch (error) {
    console.error('Error starting verification:', error);
    res.status(500).json({ message: 'Error starting verification (bypassed)' });
  }
});

router.post('/check', async (req, res) => {
  // const { phoneNumber, code } = req.body;

  try {
    // const verificationCheck = await client.verify.services(process.env.TWILIO_VERIFY_SERVICE_SID)
    //   .verificationChecks.create({ to: phoneNumber, code });

    // if (verificationCheck.status === 'approved') {
    //   res.status(200).json({ message: 'Phone number verified.' });
    // } else {
    //   res.status(400).json({ message: 'Invalid verification code' });
    // }
    res.status(200).json({ message: 'Phone number verified (bypassed).' });
  } catch (error) {
    console.error('Error checking verification:', error);
    res.status(500).json({ message: 'Error checking verification (bypassed)' });
  }
});

module.exports = router;
