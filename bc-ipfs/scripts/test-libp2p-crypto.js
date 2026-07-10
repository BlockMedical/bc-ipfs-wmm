'use strict';

const assert = require('assert');
const { promisify } = require('util');
const crypto = require('libp2p-crypto');

async function main() {
  const generateKeyPair = promisify(crypto.keys.generateKeyPair);
  const importKey = promisify(crypto.keys.import);
  const key = await generateKeyPair('RSA', 2048);
  const message = Buffer.from('bc-ipfs-wmm node-forge compatibility');
  const sign = promisify(key.sign.bind(key));
  const verify = promisify(key.public.verify.bind(key.public));
  const signature = await sign(message);

  assert.strictEqual(await verify(message, signature), true);
  assert.strictEqual(await verify(Buffer.from('tampered'), signature), false);

  const password = 'local-compatibility-test';
  const encryptedPem = await promisify(key.export.bind(key))(password);
  const imported = await importKey(encryptedPem, password);
  const importedSignature = await promisify(imported.sign.bind(imported))(message);

  assert.strictEqual(
    await promisify(imported.public.verify.bind(imported.public))(message, importedSignature),
    true,
  );
  assert.deepStrictEqual(imported.public.bytes, key.public.bytes);
  process.stdout.write('libp2p RSA generate/export/import/sign/verify: passed\n');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
