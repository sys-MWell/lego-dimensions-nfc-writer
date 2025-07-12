class TEA {
    encrypt(buffer) {
      if (!this.key) throw new Error('Set key before using');
      const buf = Buffer.alloc(8);
      const d1 = buffer.readInt32LE(0);
      const d2 = buffer.readInt32LE(4);
      const keya = [
        this.key.readUInt32LE(0),
        this.key.readUInt32LE(4),
        this.key.readUInt32LE(8),
        this.key.readUInt32LE(12),
      ];
      const data = this.encipher([d1, d2], keya);
      buf.writeUInt32LE(data[0], 0);
      buf.writeUInt32LE(data[1], 4);
      return buf;
    }
  
    encipher(v, k) {
      let v0 = v[0],
        v1 = v[1],
        sum = 0,
        delta = 0x9e3779b9,
        k0 = k[0],
        k1 = k[1],
        k2 = k[2],
        k3 = k[3];
  
      for (let i = 0; i < 32; i++) {
        sum += delta;
        v0 += (((v1 << 4) + k0) ^ (v1 + sum) ^ ((v1 >>> 5) + k1)) >>> 0;
        v1 += (((v0 << 4) + k2) ^ (v0 + sum) ^ ((v0 >>> 5) + k3)) >>> 0;
      }
  
      return [v0 >>> 0, v1 >>> 0];
    }
  }
  
  module.exports = TEA;