const generateOTP = async () => {
  try {
    return (otp = `${Math.floor(10000 + Math.random() * 90000)}`);
  } catch (err) {
    console.log("Error generating OTP - ", getDate(), "\n---\n", err);
    throw err;
  }
};

module.exports = generateOTP;
