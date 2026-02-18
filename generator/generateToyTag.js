var fs = require('fs');
var CharCrypto = require('../src/lib/CharCrypto');
var PWDGen = require('../src/lib/PWDGen');


const ENABLE_PAD = false;
if (ENABLE_PAD) {
    var pad = require('pad');
}

function generateToyTagData(uid, cvid) {
    if (cvid === undefined || cvid === null) {
        return { error: "Invalid cvid: cvid is undefined or null." };
    }
    var cc = new CharCrypto();
    var pwd = ENABLE_PAD ? pad(8, PWDGen(uid).toString(16), '0') : PWDGen(uid).toString(16).padStart(8, '0');

    try {
        var characters = JSON.parse(fs.readFileSync('./data/charactermap.json', 'utf8'));
        var vehicles = JSON.parse(fs.readFileSync('./data/vehiclesmap.json', 'utf8'));

        var result = [];

        var pages = ["[Page 35]", "[Page 36]", "[Page 37]", "[Page 38]", "[Page 43]"];
        var nfcLocations = ["[0x23]", "[0x24]", "[0x25]", "[0x26]", "[0x2B]"];

        if (cvid === "C") {
            for (const character of Object.values(characters)) {
                var characterCode = ENABLE_PAD
                    ? pad(16, cc.encrypt(uid, character.id).toString("hex"), '0')
                    : cc.encrypt(uid, character.id).toString("hex").padStart(16, '0');

                var hexCodes = [
                    "00000000",
                    characterCode.substring(0, 8).toUpperCase(),
                    characterCode.substring(8, 16).toUpperCase(),
                    "00000000",
                    pwd.toUpperCase()
                ];

                result.push({
                    pages,
                    nfcLocations,
                    hexCodes,
                    characterdetails: { id: character.id, name: character.name, world: character.world, type: 'character' }
                });
            }
        } else if (cvid === "V") {
            for (const vehicle of Object.values(vehicles)) {
                var vehicleCode = vehicle.line36.toString("hex").toUpperCase();

                var hexCodes = [
                    "00000000",
                    vehicleCode,
                    "00000000",
                    "00010000",
                    pwd.toUpperCase()
                ];

                result.push({
                    pages,
                    nfcLocations,
                    hexCodes,
                    vehicledetails: { id: vehicle.id, name: vehicle.name, type: vehicle.type || 'vehicle' }
                });
            }
        } else if (cvid.length === 4) {
            // Single Vehicle
            var vehicleCode = cvid.toString("hex").toUpperCase();
            var vehicleDetails = Object.values(vehicles).find(veh => String(veh.id) === String(cvid)) || { id: cvid, name: "Unknown Vehicle", type: "Unknown Type" };

            var hexCodes = [
                "00000000",
                vehicleCode,
                "00000000",
                "00010000",
                pwd.toUpperCase()
            ];

            result.push({
                pages,
                nfcLocations,
                hexCodes,
                vehicledetails: { ...vehicleDetails, type: vehicleDetails.type || 'vehicle' }
            });
        } else {
            // Single Character
            var characterCode = cc.encrypt(uid, cvid).toString("hex").padStart(16, '0');
            var characterDetails = Object.values(characters).find(char => String(char.id) === String(cvid)) || { id: cvid, name: "Unknown Character", world: "Unknown World" };

            var hexCodes = [
                "00000000",
                characterCode.substring(0, 8).toUpperCase(),
                characterCode.substring(8, 16).toUpperCase(),
                "00000000",
                pwd.toUpperCase()
            ];

            result.push({
                pages,
                nfcLocations,
                hexCodes,
                characterdetails: { ...characterDetails, type: 'character' }
            });
        }

        return result;
    } catch (error) {
        console.error("Error in generateToyTagData:", error);
        return null;
    }
}

module.exports = { generateToyTagData };