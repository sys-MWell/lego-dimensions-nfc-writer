# Lego Dimensions NFC213 Tag Generator

This project is a **Node.js console application** that generates the required **HEX data** to program replacement Toy Tags for the game **Lego Dimensions** using **NFC213 tags**.  
The application takes the **UID from a blank NFC213 tag** and a **Character or Vehicle ID**, and produces the values that need to be written to the NFC tag so it can be used with the Lego Dimensions Toy Pad.

> ⚠️ This project is for educational purposes and to preserve access to Lego Dimensions, a game and hardware ecosystem no longer manufactured. You must supply your own NFC213 tags.

---

## Prerequisites
- Blank **NFC213 tags**  
- The [**Smart NFC**](https://apps.apple.com/us/app/smart-nfc/id1470146079) app (from the iOS App Store)  
- Node.js installed on your computer  

---

## Step 1 — Reading Your NFC213 Tag UID

1. Install and open **Smart NFC** on your iPhone.  
2. Tap on **Advanced** and make sure the protocol is set to **ISO 14443**.  
   - If you don’t do this, you may get an error that the tag does not contain an NDEF message.  
3. Scan your **blank NFC213 tag**.  
4. Scroll down to view the **lines/blocks**.  
   - Copy the first 6 characters of **line 1 (Block 00)** and all 8 characters of **line 2 (Block 01)**.  
   - Combine them into your UID.  
   - Drop the last 2 characters from line 1.  
   - Example:  
     ```
     Line 1 (0x00): ABCDEF01
     Line 2 (0x01): 2345678
     UID = ABCDEF2345678
     ```
---

## Step 2 — Running the Console Application

1. Clone or download this repository.  
2. Install dependencies:
   ```
   git clone https://github.com/sys-MWell/lego-dimensions-nfc-writer.git
   cd lego-dimensions-nfc-writer
   ```
3. In your terminal, run the generator:
   ```
   node generator/generateToyTag.js
   ```
4. The console will prompt you:
   ```
   Enter NFC’s UID:
   ```
   - Enter the UID you obtained from Smart NFC.
5. Next, you’ll be prompted:
   ```
   Enter character or vehicle ID ([Character or Vehicle ID] or [C] for all Characters or [V] for all Vehicles):
   ```
   - Enter a valid Character or Vehicle ID.
   - IDs can be found in charactermap.json and vehiclemap.json.
6. The program will output the required page numbers and HEX values for your NFC tag.
   #### Example Output
   - For UID 1D0D830E960000 and Batman (ID = 1):
   ```
   ... [Page  35] [Page  36] [Page  37] [Page  38] ... [Page  43] 
   ... [    0x23] [    0x24] [    0x25] [    0x26] ... [    0x2B] 
   ... [00000000] [A4027C05] [33217F87] [00000000] ... [4574C79D]
   ```
---

## Step 3 — Writing to Your NFC213 Tag
1. In the Smart NFC app, open the blank tag again.
2. Update only the following lines with the generated values:
   - Line 35 (0x23)
   - Line 36 (0x24)
   - Line 37 (0x25)
   - Line 38 (0x26)
   - Line 43 (0x2B)
3. Rules:
   - **Do not edit any other lines.**
   - Only update one block at a time.
   - After entering new data, tap **WRITE** and scan the tag again.
   - Repeat until all changes are written.
4. Place the tag on the Lego Dimensions Toy Pad.
   - Your character/vehicle should appear in-game from the vortex!
---

## How Character and Vehicle Tag Codes Work
The data written to your tag determines whether it’s a character or vehicle:
   - Line 35 (0x23): Always ```00000000```
   - Lines 36–37: Based on Character/Vehicle ID
      - Characters: Derived from UID + Character ID → unique per tag
      - Vehicles:
         - Line 36 = based solely on Vehicle ID
         - Line 37 = always ```00000000```
   - Line 38 (0x26): Identifies token type
      - Characters = ```00000000```
      - Vehicles = ```00010000```
   - Line 43 (0x2B): Based solely on UID
   ### Example — Vehicle (Bad Cop’s Police Car, Vehicle ID 1000)
   ```
   Line 35 (0x23): 00000000
   Line 36 (0x24): E8030000
   Line 37 (0x25): 00000000
   Line 38 (0x26): 00010000
   Line 43 (0x2B): [Generated from UID]
   ```
---

## Credits
This project is built upon and inspired by community contributions:
   - AlinaNova21 — [**node-ld**](https://github.com/AlinaNova21/node-ld), the Node.js Lego Dimensions Library (provided the base code and character JSON list).
   - iroteta — Provided [**list_of_characters.json**](https://pastebin.com/YWkX6jaV) and [**list_of_vehicles.json**](https://pastebin.com/NHmWs6gb).
   - Reddit threads & tutorials:
      - [**NFC cloning using iOS**](https://www.reddit.com/r/Legodimensions/comments/kq1dcv/nfc_cloning_using_ios/)
      - [**How to make NFC tags for Lego Dimensions**](https://www.reddit.com/r/Legodimensions/comments/1abb147/how_to_make_nfc_tags_for_lego_dimensions_pc_iphone/)
      - [**How to write Lego Dimensions NFC tags with MiFARE++ Ultralight**](https://www.reddit.com/r/Legodimensions/comments/jlk6ne/comment/gar9tak/?utm_source=reddit&utm_medium=web2x&context=3)
      - **Chteupnin’s LD Project Discord** — Community-driven support and development.
         - [**Discord invite**](https://discord.gg/kzsVVYGrW3)
         - [**Chteupnin’s LD Generation Website**](https://chteupnin.sp-it.be/)
---

## Notes
   - This project replicates the functionality of the now-defunct ldcharcrypto site.
   - The console application does not emulate the official Toy Pad, but instead provides raw HEX for use with NFC writing apps like Smart NFC.
   - The project was created as a learning experience in Node.js, debugging, and working with existing open-source code.