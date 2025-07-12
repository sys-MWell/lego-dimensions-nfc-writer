var rotr32 = (a, b) => ((a >>> b) | (a << (32 - b))) >>> 0;

function PWDGen(uid) {
  uid = Buffer.from(uid, 'hex');
  const base = Buffer.from("UUUUUUU(c) Copyright LEGO 2014AA");
  uid.copy(base);
  base[30] = base[31] = 0xaa;

  let v2 = 0;
  for (let i = 0; i < 8; i++) {
    const v4 = rotr32(v2, 25);
    const v5 = rotr32(v2, 10);
    const b = base.readUInt32LE(i * 4);
    v2 = (b + v4 + v5 - v2) >>> 0;
  }

  const b = Buffer.alloc(4);
  b.writeUInt32BE(v2, 0);
  return b.readUInt32LE(0);
}

module.exports = PWDGen;