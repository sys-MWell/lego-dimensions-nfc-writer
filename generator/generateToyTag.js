var fs = require('fs');
var CharCrypto = require('../src/lib/CharCrypto');
var PWDGen = require('../src/lib/PWDGen');


const ENABLE_PAD = false;
if (ENABLE_PAD) {
    var pad = require('pad');
}

function generateToyTagData(uid, cvid) {
    var cc = new CharCrypto();
    var pwd = ENABLE_PAD ? pad(8, PWDGen(uid).toString(16), '0') : PWDGen(uid).toString(16).padStart(8, '0');

    try {
        var characters = JSON.parse(fs.readFileSync('./data/charactermap.json', 'utf8'));
        var vehicles = JSON.parse(fs.readFileSync('./data/vehiclesmap.json', 'utf8'));

        var result = [];

        var pages = ["[Page  35]", "[Page  36]", "[Page  37]", "[Page  38]", "[Page  43]"];
        var nfcLocations = ["[    0x23]", "[    0x24]", "[    0x25]", "[    0x26]", "[    0x2B]"];

        if (cvid === "C") {
            for (const character of Object.values(characters)) {
                var characterCode = ENABLE_PAD
                    ? pad(16, cc.encrypt(uid, character.id).toString("hex"), '0')
                    : cc.encrypt(uid, character.id).toString("hex").padStart(16, '0');

                result.push({
                    pages,
                    nfcLocations,
                    content: `... [00000000] [${characterCode.substring(0, 8).toUpperCase()}] [${characterCode.substring(8, 16).toUpperCase()}] [00000000] ... [${pwd.toUpperCase()}] ${character.name}`
                });
            }
        } else if (cvid === "V") {
            for (const vehicle of Object.values(vehicles)) {
                var vehicleCode = vehicle.line36.toString("hex");

                result.push({
                    pages,
                    nfcLocations,
                    content: `... [00000000] [${vehicleCode}] [00000000] [00010000] ... [${pwd.toUpperCase()}] ${vehicle.name}`
                });
            }
        } else {
            // Vehicle
            if (cvid.length === 4) { 
                var vehicleCode = cvid.toString("hex");

                result.push({
                    pages,
                    nfcLocations,
                    content: `... [00000000] [${vehicleCode}] [00000000] [00010000] ... [${pwd.toUpperCase()}]`
                });
            }
            // Character
            else { 
                var characterCode = cc.encrypt(uid, cvid).toString("hex").padStart(16, '0');

                result.push({
                    pages,
                    nfcLocations,
                    content: `... [00000000] [${characterCode.substring(0, 8).toUpperCase()}] [${characterCode.substring(8, 16).toUpperCase()}] [00000000] ... [${pwd.toUpperCase()}]`
                });
            }
        }

        return result;
    } catch (error) {
        console.error("Error in generateToyTagData:", error);
        return null;
    }
}

module.exports = { generateToyTagData };