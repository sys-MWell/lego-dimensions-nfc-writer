var readline = require('readline');
var fs = require('fs');

var CharCrypto = require('../src/lib/CharCrypto');
var PWDGen = require('../src/lib/PWDGen');


const ENABLE_PAD = false;
if (ENABLE_PAD) {
    var pad = require('pad');
}

process.stdout.write('\u001B[2J\u001B[0;0f');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter NFC's UID: ", (uid) => {
    rl.question("Enter character or vehicle ID ( [Character or Vehicle ID] or [C] for all Characters or [V] for all Vehicles ): ", (cvid) => {
        if (uid == "") {
            console.log("");
            console.log("No valid NFC's UID");
        } else if (cvid == "") {
            console.log("");
            console.log("No valid character or vehicle ID");
        } else {
            var cc = new CharCrypto();
            var pwd = ENABLE_PAD ? pad(8, PWDGen(uid).toString(16), '0') : PWDGen(uid).toString(16).padStart(8, '0');

            var characters = JSON.parse(fs.readFileSync('./data/charactermap.json', 'utf8'));
            var vehicles = ENABLE_PAD ? JSON.parse(fs.readFileSync('./data/vehiclesmap.json', 'utf8')) : [];

            console.log("");
            console.log("");

            if (cvid == "C") {
                console.log("... [Page  35] [Page  36] [Page  37] [Page  38] ... [Page  43]");
                console.log("... [    0x23] [    0x24] [    0x25] [    0x26] ... [    0x2B]");

                for (character in characters) {
                    var characterCode = ENABLE_PAD ? pad(16, cc.encrypt(uid, characters[character].id).toString("hex"), '0') : cc.encrypt(uid, characters[character].id).toString("hex").padStart(16, '0');

                    console.log(
                        "... [00000000] [" + characterCode.substring(0, 8).toUpperCase() + "] [" + characterCode.substring(8, 16).toUpperCase() + "] [00000000] ... [" + pwd.toUpperCase() + "] " + characters[character].name
                    );
                }
            } else if (cvid == "V" && ENABLE_PAD) {
                console.log("... [Page  35] [Page  36] [Page  37] [Page  38] ... [Page  43]");
                console.log("... [    0x23] [    0x24] [    0x25] [    0x26] ... [    0x2B]");

                for (vehicle in vehicles) {
                    var vehicleCode = vehicles[vehicle].line36.toString("hex");

                    console.log(
                        "... [00000000] [" + vehicleCode + "] [00000000] [00010000] ... [" + pwd.toUpperCase() + "] " + vehicles[vehicle].name
                    );
                }
            } else {
                var characterCode = ENABLE_PAD ? pad(16, cc.encrypt(uid, cvid).toString("hex"), '0') : cc.encrypt(uid, cvid).toString("hex").padStart(16, '0');

                if (cvid.length == 4 && ENABLE_PAD) {
                    console.log("... [Page  35] [Page  36] [Page  37] [Page  38] ... [Page  43]");
                    console.log("... [    0x23] [    0x24] [    0x25] [    0x26] ... [    0x2B]");

                    for (vehicle in vehicles) {
                        var vehicleId = vehicles[vehicle].id;
                        var vehicleCode = vehicles[vehicle].line36.toString("hex");

                        if (vehicleId == cvid) {
                            console.log(
                                "... [00000000] [" + vehicleCode + "] [00000000] [00010000] ... [" + pwd.toUpperCase() + "] " + vehicles[vehicle].name
                            );
                        }
                    }
                } else {
                    console.log("... [Page  35] [Page  36] [Page  37] [Page  38] ... [Page  43]");
                    console.log("... [    0x23] [    0x24] [    0x25] [    0x26] ... [    0x2B]");

                    console.log(
                        "... [00000000] [" + characterCode.substring(0, 8).toUpperCase() + "] [" + characterCode.substring(8, 16).toUpperCase() + "] [00000000] ... [" + pwd.toUpperCase() + "] "
                    );
                }
            }

            console.log("");
            console.log("");
        }

        rl.close();
    });
});