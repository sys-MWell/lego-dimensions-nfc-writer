const TEA = require('./TEA');

class CharCrypto {
  genkey(uid) {
    return Buffer.from(
      this.scramble(uid, 3) +
        this.scramble(uid, 4) +
        this.scramble(uid, 5) +
        this.scramble(uid, 6),
      'hex'
    );
  }

  encrypt(uid, charid) {
    const tea = new TEA();
    tea.key = this.genkey(uid);
    const buf = Buffer.alloc(8);
    buf.writeUInt32LE(charid, 0);
    buf.writeUInt32LE(charid, 4);
    return tea.encrypt(buf).toString('hex');
  }

  scramble(uid, cnt) {
    const base = Buffer.from([
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xb7, 0xd5, 0xd7, 0xe6, 0xe7,
      0xba, 0x3c, 0xa8, 0xd8, 0x75, 0x47, 0x68, 0xcf, 0x23, 0xe9, 0xfe, 0xaa,
    ]);
    uid = Buffer.from(uid, 'hex');
    uid.copy(base);
    base[cnt * 4 - 1] = 0xaa;

    let v2 = 0;
    for (let i = 0; i < cnt; i++) {
      const v4 = (v2 >>> 25) | (v2 << (32 - 25));
      const v5 = (v2 >>> 10) | (v2 << (32 - 10));
      const b = base.readUInt32LE(i * 4);
      v2 = (b + v4 + v5 - v2) >>> 0;
    }

    const b = Buffer.alloc(4);
    b.writeUInt32LE(v2, 0);
    return b.toString('hex');
  }
}

module.exports = CharCrypto;