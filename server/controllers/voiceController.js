/**
 * Voice Agronomy Advisory Controller
 * Lead Architect: Chief Natural Language & Speech Processing Architect
 */

const voiceAgronomyEngine = require('../services/voiceAgronomyEngine');

const getVoiceAdvisory = (req, res) => {
  const { langCode = 'hi', cropName = 'tomato', diseaseDetected = 'Early Bacterial Blight' } = req.body;
  const advisory = voiceAgronomyEngine.synthesizeVoiceAdvisory({
    langCode,
    cropName,
    diseaseDetected,
  });

  return res.status(200).json(advisory);
};

module.exports = {
  getVoiceAdvisory,
};
