const cryptoJs = require('crypto-js')

class EncryptionUtil {
  static encrypt (content, key) {
    const cryptoInfo = cryptoJs.AES
      .encrypt(JSON.stringify({ content }), key)
      .toString()
    return cryptoInfo
  }

  static decrypt (content, key) {
    try {
      const decryptedData = cryptoJs.AES
        .decrypt(content, key)
        .toString(cryptoJs.enc.Utf8)
      const originalContent = JSON.parse(decryptedData)
      return originalContent
    } catch (error) {
      console.error('Decryption error:', error.message)
      throw new Error('Decryption failed')
    }
  }
}

module.exports = EncryptionUtil
