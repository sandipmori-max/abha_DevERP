import forge from 'node-forge';

export const encryptData = (
  value: string,
  publicKeyBase64: string,
) => {
  try {
    console.log('===== RSA ENCRYPT START =====');

    console.log('Input Value:', value);
    console.log('Input Value Length:', value?.length);

    console.log(
      'Public Key Exists:',
      !!publicKeyBase64,
    );

    console.log(
      'Public Key Length:',
      publicKeyBase64?.length,
    );

    console.log(
      'Public Key First 50 Chars:',
      publicKeyBase64?.substring(0, 50),
    );

    console.log(
      'Public Key Last 50 Chars:',
      publicKeyBase64?.substring(
        publicKeyBase64.length - 50,
      ),
    );

    const pem = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----`;

    console.log('PEM Generated');
    console.log('PEM Length:', pem.length);

    console.log(
      'Parsing Public Key...'
    );

    const publicKey =
      forge.pki.publicKeyFromPem(pem);

    console.log(
      'Public Key Parsed Successfully'
    );

    console.log(
      'Starting RSA Encryption...'
    );

    const encrypted =
      publicKey.encrypt(
        value,
        'RSA-OAEP',
        {
          md: forge.md.sha1.create(),
          mgf1: {
            md: forge.md.sha1.create(),
          },
        },
      );

    console.log(
      'Encryption Success'
    );

    const encryptedBase64 =
      forge.util.encode64(
        encrypted,
      );

    console.log(
      'Encrypted Length:',
      encryptedBase64.length,
    );

    console.log(
      'Encrypted First 50 Chars:',
      encryptedBase64.substring(
        0,
        50,
      ),
    );

    console.log(
      '===== RSA ENCRYPT END ====='
    );

    return encryptedBase64;
  } catch (error: any) {
    console.log(
      '===== RSA ENCRYPT ERROR ====='
    );

    console.log(
      'Error Message:',
      error?.message,
    );

    console.log(
      'Error Stack:',
      error?.stack,
    );

    console.log(
      'Public Key Length:',
      publicKeyBase64?.length,
    );

    console.log(
      'Public Key Sample:',
      publicKeyBase64?.substring(
        0,
        100,
      ),
    );

    throw error;
  }
};