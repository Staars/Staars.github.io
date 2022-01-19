# MI32  
  
The MI32-driver focuses on the passive observation of BLE sensors of the Xiaomi/Mijia universe, thus only needing a small memory footprint. This allows to additionally run a dedicated software bridge to Apples HomeKit with very few additional configuration steps. Berry can be used in parallel.

   
## Tasmota and BLE-sensors

Different vendors offer Bluetooth solutions as part of the XIAOMI family often under the MIJIA-brand (while AQUARA is the typical name for a ZigBee sensor).  
The sensors supported by Tasmota use BLE (Bluetooth Low Energy) to transmit the sensor data, but they differ in their accessibilities quite substantially.  
  
Basically all of them use of so-called „MiBeacons“ which are BLE advertisement packets with a certain data structure, which are broadcasted by the devices automatically while the device is not in an active bluetooth connection.  
The frequency of these messages is set by the vendor and ranges from one per 3 seconds to one per hour (for the battery status of the LYWSD03MMC). Motion sensors and BLE remote controls start to send when an event is triggered.  
These packets already contain the sensor data and can be passively received by other devices and will be published regardless if a user decides to read out the sensors via connections or not. Thus the battery life of a BLE sensor is not influenced by reading these advertisements and the big advantage is the power efficiency as no active bi-directional connection has to be established. The other advantage is, that scanning for BLE advertisements can happen nearly parallel (= very quick one after the other), while a direct connection must be established for at least a few seconds and will then block both involved devices for that time.  
This is therefore the preferred option, if technically possible (= for the supported sensors).
  
Most of the „older“ BLE-sensor-devices use unencrypted messages, which can be read by all kinds of BLE-devices or even a NRF24L01. With the arrival of "newer" sensors came the problem of encrypted data in MiBeacons, which can be decrypted in Tasmota.  
Meanwhile it is possible to get the needed "bind_key" without the need to use Xiaomis apps and server infrastructure.  
At least the LYWSD03 allows the use of a simple BLE connection without any encrypted authentication and the reading of the sensor data using normal subscription methods to GATT-services (currently used on the HM-1x). This is more power hungry than the passive reading of BLE advertisements. It is not directly supported by the driver anymore, but can be realized in Berry, i.e. to read the correct battery status.   
Other sensors like the MJYD2S and nearly every newer device are not usable without the "bind_key".  
  
The idea is to provide as many automatic functions as possible. Besides the hardware setup, there are zero or very few things to configure.  
The sensor namings are based on the original sensor names and shortened if appropriate (Flower care -> Flora). A part of the MAC will be added to the name as a suffix.  
All sensors are treated as if they are physically connected to the ESP32 device. For motion and remote control sensors MQTT-messages will be published in (nearly) real time.
  
### Supported Devices

!!! note "It can not be ruled out, that changes in the device firmware may break the functionality of this driver completely!"  

The naming conventions in the product range of bluetooth sensors in XIAOMI-universe can be a bit confusing. The exact same sensor can be advertised under slightly different names depending on the seller (Mijia, Xiaomi, Cleargrass, ...).

 <table>
  <tr>
    <th class="th-lboi">MJ_HT_V1</th>
    <th class="th-lboi">LYWSD02</th>
    <th class="th-lboi">CGG1</th>
    <th class="th-lboi">CGD1</th>
  </tr>
  <tr>
    <td class="tg-lboi"><img src="../_media/bluetooth/mj_ht_v1.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/LYWDS02.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/CGG1.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/CGD1.png" width=200></td>
  </tr>
  <tr>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
  </tr>
    <tr>
    <td class="tg-lboi">passive for all entities, reliable battery value</td>
    <td class="tg-lboi">battery only active, set clock and unit, very frequent data sending</td>
    <td class="tg-lboi">passive for all entities, reliable battery value</td>
    <td class="tg-lboi">battery only active, no reliable battery value, no clock functions</td>
  </tr>
</table>  
  
 <table>
  <tr>
    <th class="th-lboi">MiFlora</th>
    <th class="th-lboi">LYWSD03MMC / ATC</th>
    <th class="th-lboi">NLIGHT</th>
    <th class="th-lboi">MJYD2S</th>
  </tr>
  <tr>
    <td class="tg-lboi"><img src="../_media/bluetooth/miflora.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/LYWSD03MMC.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/nlight.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/mjyd2s.png" width=200></td>
  </tr>
  <tr>
    <td class="tg-lboi">temperature, illuminance, soil humidity, soil fertility, battery, firmware version</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">motion</td>
    <td class="tg-lboi">motion, illuminance, battery, no-motion-time</td>
  </tr>
  <tr>
    <td class="tg-lboi">passive only with newer firmware (>3.0?), battery only active</td>
    <td class="tg-lboi">passive only with decryption or using custom ATC-firmware, no reliable battery value with stock firmware</td>
    <td class="tg-lboi">passive</td>
    <td class="tg-lboi">passive only with decryption</td>
  </tr>
</table>  
  
 <table>
  <tr>
    <th class="th-lboi">YEE RC</th>
    <th class="th-lboi">MHO-C401</th>
    <th class="th-lboi">MHO-C303</th>
    <th class="th-lboi">MCCGQ02HL</th>
  </tr>
  <tr>
    <td class="tg-lboi"><img src="../_media/bluetooth/yeerc.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/MHO-C401.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/MHO-C303.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/MCCGQ02HL.png" width=200></td>
  </tr>
  <tr>
    <td class="tg-lboi">button press (single and long)</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">temperature, humidity, battery</td>
    <td class="tg-lboi">contact opening/closing, battery</td>
  </tr>
     <tr>
    <td class="tg-lboi">passive</td>
    <td class="tg-lboi">equal to the LYWS03MMC</td>
    <td class="tg-lboi">passive for all entities,  set clock and unit, no alarm functions, very frequent data sending</td>
    <td class="tg-lboi">passive only with decryption</td>
  </tr>
</table>

 <table>
  <tr>
    <th class="th-lboi">SJWS01L</th>
  </tr>
  <tr>
    <td class="tg-lboi"><img src="../_media/bluetooth/SJWS01L.png" width=200></td>
  </tr>
  <tr>
    <td class="tg-lboi">button press (single and long), leak alarm, battery</td>
  </tr>
     <tr>
    <td class="tg-lboi">passive only with decryption</td>
  </tr>
</table> 
passive: data is received via BLE advertisments  
active: data is received via bidrectional connection to the sensor  
  
#### Devices with payload encryption  
  
The encrypting devices will start to send advertisements with encrypted sensor data after pairing it with the official Xiaomi app. Out-of-the-box the sensors do only publish a static advertisement.  
It is possible to do a pairing and get the necessary decryption key ("bind_key") right here in the Wiki. This method uses the same code base as the first published working example: https://atc1441.github.io/TelinkFlasher.html  
This project also provides a custom firmware for the LYWSD03MMC, which then becomes an ATC and is supported by Tasmota too. Default ATC-setting will drain the battery more than stock firmware, because of very frequent data sending.  
This key and the corresponding MAC of the sensor can be injected with the MI32key-command (or NRFMJYD2S), but the new and recommended option is tu use a **mi32cfg** file.

It is still possible to save the whole config as RULE like that:  (not recommended anymore!)
  
```haskell
rule1 on System#Boot do backlog MI32key 00112233445566778899AABBCCDDEEFF112233445566; MI32key 00112233445566778899AABBCCDDEEFF112233445566 endon
```  
(key for two sensors)  
   
  
## MI32 Configuration
  
There are several ways to manage ad save your configuration. 

1. Do it on the device
Starting after a fresh install the driver will not find a configuration file and begins to search for every BLE device, that he can unterstand. Thus after a while all BLE sensors in sight should have been added to the non-persistent internal memory.  
You can save them with command `MI32CFG`, which will create a JSON-file named 'mi32cfg' in the root folder of the internal flash of the ESP32. After the next reboot, the driver will read this configuration into memory and does not add more devices to this list.  
  
2. Create the mi32cfg file manually  
After a fresh install you can simply create a file in the root folder of the flash file system with the name 'mi32cfg' and paste the JSON into it. Save it and reboot.

3. Adding sensors including the keys directly on this page  
It is recommended to paste the data of 'mi32cfg' into the next textfield, if you already have one. After that press IMPORT MI32CFG. The config will get parsed and presented in a table.  
  
### MI32CFG Importer - Web App

<p>MI32CFG <span id='importedDev'>- nothing imported yet</span></p>
<input size="56" type="text" id="result_config" value="" placeholder="paste your mi32cfg here"><br>
<button type="button" class="md-button md-button--primary" onclick="importCfg();">Import MI32Cfg</button>


<div class="tabbed-set tabbed-alternate" data-tabs="2:2"><input checked="checked" id="__tabbed_2_1" name="__tabbed_2" type="radio"><input id="__tabbed_2_2" name="__tabbed_2" type="radio"><div class="tabbed-labels">
<label for="__tabbed_2_1">Table</label>
<label for="__tabbed_2_2">JSON</label></div> 
<div class="tabbed-content"><div class="tabbed-block"> <div class="highlight"><pre id="__code_4">
<div class="md-typeset__scrollwrap"><div class="md-typeset__table">
<table  id="oldMi32Cfg"></table>
</div></div>
</pre></div> </div> 
<div class="tabbed-block"> <div class="highlight"><pre id="__code_5"><span></span><button class="md-clipboard md-icon" title="Copy to clipboard" data-clipboard-target="#__code_5 > code"></button><code id="exportedJSON"><span  class="cp">[]</span>
</code></pre></div> </div> </div> </div>


  
After that you can add more sensors with the following Bind Key Generator, which will also add sensors, that do not need a key. This will only work, if your browser supports this and **should work with Opera, Chrome and Edge**. Safari and Firefox are not able to do this.  
After succesful pairing a sensor in the next step or simply connecting to a non-encrypting sensor, the JSON in the textfield above will be update with the added new sensor at the bottom. 
You can copy-paste the new JSON via the Web-GUI to the mi32cfg file on the ESP32 or save it elsewhere. For adding more sensors, repeat the whole procedure after refreshing the site (after saving your data!!).  

### Bind Key Generator - Web App  

<div id='bind_key_section'>
99% of the work was done by: https://atc1441.github.io/TelinkFlasher.html !!  
<div class="admonition danger"> <p class="admonition-title">Will disable device in MiHome</p><p>When doing an activation here the device is needed to be activated in the Mi app again when wanted to use there.</p> </div>
<button type="button" class="md-button md-button--primary" onclick="connect();">Connect</button>
<label for="instantPair"> Pair instantly</label>
<input type="checkbox" id="instantPair"><br>
<label for="namePrefix">BLE device name prefix filter(s)</label>
<input type="text" id="namePrefix" value="" placeholder="MHO-C401,LYWSD03"><br>
<div id="MI32_status"></div>
<div id="MI32_warning"></div>

<button type="button" class="md-button md-button--primary connected" onclick="reConnect();">Reconnect</button>
<button type="button" class="md-button md-button--primary connected" onclick="reload_page();">Reset Page</button>
<button type="button" class="md-button md-button--primary connected" onclick="disconnect();">Disconnect</button>

<label id="device_tip"></label>

<h3 id="device_name"></h3>  
<!-- <div id="tempHumiData" class="connected"></div><hr> -->

<div class="connected">
<div id='connected_device'></div>
Device id:
<input size="34" type="text" id="known_id" value="">
&emsp;Mi Token:
<input size="34" type="text" id="mi_token" value=""><br>
Mi Bind Key:
<input size="34" type="text" id="mi_bind_key" value="">
MAC:
<input size="34" type="text" id="MAC" value=""><br>
<button type="button" class="md-button md-button--primary" id="DoActivation" onclick="sendRegister();">Do Activation</button><br>
</div>

<button type="button" class="md-button md-button--primary"onclick="clearLog();">Clear Log</button><br>
<div id="result"></div>
</div>

??? summary "BLE-Log:"
  
     .

  
## Commands

Command|Parameters
:---|:---
MI32Cfg<a id="mi32cfg"></a>|Saves current sensor list as **mi32cfg** file to the flash of the ESP32. After reboot only the saved drivers will be observed, no unknown drivers will be added. A valid config file is mandatory for HomeKit in this driver.
MI32Key<a id="mi32key"></a>| Set a "bind_key" for a MAC-address to decrypt sensor data (LYWSD03MMC, MJYD2S). The argument is a 44 uppercase characters long string, which is the concatenation of the bind_key and the corresponding MAC.<BR>`<00112233445566778899AABBCCDDEEFF>` (32 characters) = bind_key<BR>`<112233445566>` (12 characters) = MAC of the sensor<BR>`<00112233445566778899AABBCCDDEEFF112233445566>` (44 characters)= final string
MI32Option0<a id="mi32option"></a>|`0` = sends only recently received sensor data<br>`1` = aggregates all recent sensors data types
MI32Option1|`0` = shows full sensor data at Teleperiod<br>`1` = shows no sensor data at Teleperiod
MI32Option2|`0` = sensor data only at Teleperiod (_default_)<br>`1` = direct bridging of BLE data to MQTT messages
MI32Option3|`0` = do not add new sensors, which is set after a valid **mi32cfg** file is parsed after boot (_default_)<br>`1` = turn on auto-adding of new sensors again

!!! tip

    If you really want to read battery for LYWSD02, Flora and CGD1, consider doing it in Berry.


!!! tip

    If you want to add a new BLE sensor to your config on the device, use `MI32option3 1` to add the new sensor by catching a BLE packet. Then use `MI32Cfg` to save the new config on flash.
  

## HomeKit Bridge
  
If activated at compile time the driver will start the HAP core (= the main task of the HomeKit framework) after succesfully reading a valid **mi32cfg** file after the start. It will create a 'bridge accessory' presenting all configured BLE devices to HomeKit. You can add the ESP32 as such a **Mi-Home-Bridge** to HomeKit in the native way, like you would add a commercial product to you local HomeKit network. The setup key is derived from the Wifi MAC of your ESP32 to easily allow many ESP32 to be used as a HomeKit bridge in your local network. Besides the driver will also manage up to four relays and sync them with HomeKit. There is nothing more to configure, the driver will automatically translate the data packets back and forth.  
It just works ... except, when it does not.

!!! danger "Known issues"

    The underlying HAP framework will expose incompatible network configurations, which will likely be related to mDNS and IGMP settings. There is nothing, that the Tasmota side can fix here.

!!! danger "If it is not broken, do not upgrade"

    Although the driver does not write to the NVS section and the usage of a modified HAP framework (using a NVS wrapper) the behavior of Tasmota firmware upgrades is undefined with regards to a working HomeKit installation. Similar things can also happen using much bigger projects like "Homebridge". So it might be necessary to completely erase the Mi-Bridge from your "Home" in Homekit and doing a flash erase of the ESP32 after a firmware upgrade of the ESP32. It is recommend to first create a final mi32cfg file before you add the Mi-Home-Bridge to your "Home".
  
### HomeKit QR-Code-Generator  - Web App
  
This will generate a QR-Code based on the MAC address of the ESP32 which runs Tasmotas Homekit-Bridge. Use the camera of your iPhone or iPad to easily start the setup procedure.  
  
<input size="20" type="text" id="Wifi-MAC" value="" onkeydown="makeQRCode(this)" placeholder="WiFi MAC of the ESP32"><br>
  

<svg viewBox="0 0 400 540" id="HomeKitQRcode" xmlns="http://www.w3.org/2000/svg" style="max-width:30%;visibility:hidden;height:0;">
<defs>
<symbol id="homekit" viewBox="0 0 130 120">
<path d="m128.28 49.26-14.16-11.3v-20c0-1.46-.57-1.9-1.6-1.9h-8.94c-1.2 0-1.93.24-1.93 1.9v10L67.81 1.3a4.22 4.22 0 0 0-6.09 0L1.31 49.26c-2.13 1.67-1.53 4.1.83 4.1h11.14v61.1c0 2.77.83 4.34 2.6 5.04a7
7 0 0 0 2.72.5h92.43a7.1 7.1 0 0 0 2.72-.5c1.77-.7 2.6-2.27 2.6-5.03V53.33h11.2c2.26 0 2.86-2.4.73-4.07ZM20.66 48.1a8.45 8.45 0 0 1 3.32-6.97c1.7-1.37 37.24-29.03 38.24-29.83a4.42 4.42 0 0 1 2.66-1.14c1 .07 1.95.47 2.7 1.14l38.2 30a8.43 8.43 0 0 1 3.32 6.96v58.9a4.25
4.25 0 0 1-4.72 4.77H25.05a4.2 4.2 0 0 1-4.39-4.77V48.1Z" 
fill="#000"/><path
d="M37.12 99.03H92.4a3.12 3.12 0 0 0 3.32-3.56v-42.4a5.48 5.48 0 0 0-2.2-5L66.95 26.82c-.58-.5-1.3-.78-2.06-.8-.75.03-1.46.31-2.03.8l-26.6 21.23a5.46 5.46 0 0 0-2.2 5v42.4a3.14 3.14 0 0 0 3.07
3.57Zm4.29-43.17A4.08 4.08 0 0 1 42.97 52l19.95-15.94a2.72 2.72 0 0 1 1.7-.66c.63.02 1.24.25 1.72.66.53.47 19.05 15.1 19.95 15.94a4.07 4.07 0 0 1 1.56 3.86V88.2a2.47 2.47 0 0 1-2.69 2.83H44.1a2.45 2.45 0 0 1-2.7-2.83V55.86Z"
fill="#000"/><path
d="M53.54 80.67h22.44c1 0 1.73-.34 1.73-1.8V60.73a3.34 3.34 0 0 0-1.23-2.67L65.91 50a1.73 1.73 0 0 0-2.3 0l-10.57 8.13a3.33 3.33 0 0 0-1.23 2.67v18.13c0 1.4.73 1.74 1.73 1.74Zm5.92-17.1a1.3
1.3 0 0 1 .53-1.1l4.3-3.34a.8.8 0 0 1 .96 0s4.12 3.33 4.28 3.33a1.3 1.3 0 0 1 .54 1.1v8.57c0 .6-.3.73-.74.73H60.2c-.4 0-.73 0-.73-.73v-8.57Z"/></symbol>
<symbol id="0" viewBox="0 0 34 48">
<path d="M17 48c11 0 17-9 17-24S28 0 17 0 0 9 0 24s6 24 17 24ZM7 24C7 12 10 6 17 6c4 0 7 3 9 8L7 28v-4Zm10 18c-4 0-7-2-9-8l19-14v4c0 12-3 18-10 18Z"/></symbol>
<symbol id="1" viewBox="0 0 34 48">
<path d="M34 48v-6H21V0h-7L0 9v7l13-9h1v35H0v6h34Z"/></symbol>
<symbol id="2" viewBox="0 0 34 48">
<path d="M0 14.4684V14.664H7.02096V14.4684C7.02096 9.222 10.7987 5.73523 16.501 5.73523C22.1677 5.73523 25.8742 8.86354 25.8742 13.6864C25.8742 17.2383 24.2348 19.7149 17.5702 26.3299L0.356394 43.3401V48H34V42.0692H10.7631V41.5153L22.239
30.3381C30.6143 22.3218 33.1803 18.2811 33.1803 13.3279C33.1803 5.40937 26.5157 0 16.7149 0C6.91405 0 0 5.99593 0 14.4684Z"/></symbol>
<symbol id="3" viewBox="0 0 34 48">
<path d="M11 26h6c6 0 10 3 10 8s-4 8-10 8-10-3-10-7H0c0 8 7 13 17 13s17-6 17-14c0-6-4-10-10-11 5-1 8-5 8-11 0-7-6-12-15-12C7 0 1 5 1 13h6c1-5 4-7 10-7 5 0 8 2 8 7s-3 8-9 8h-5v5Z"/></symbol>
<symbol id="4" viewBox="0 0 34 48">
<path d="M21 48h6V38h7v-6h-7V19h-6v13H7L22 0h-7L0 33v5h21v10Z"/></symbol>
<symbol id="5" viewBox="0 0 34 48">
<path d="M17 48c10 0 17-7 17-16s-6-16-16-16c-4 0-8 2-10 4L9 6h22V0H3L1 27h7c1-3 5-5 9-5 6 0 10 4 10 10s-4 10-10 10c-5 0-10-3-10-8H0c0 8 7 14 17 14Z"/></symbol>
<symbol id="6" viewBox="0 0 34 48">
<path d="M34 32c0-9-6-15-15-15-3 0-6 1-8 3l1-3L25 0h-8L7 14c-5 7-7 12-7 18 0 9 7 16 17 16s17-7 17-16ZM17 42c-6 0-10-4-10-10s4-10 10-10 10 4 10 10-4 10-10 10Z"/></symbol>
<symbol id="7" viewBox="0 0 34 48">
<path d="M4 48h8L34 6V0H0v6h27L4 48Z"/></symbol>
<symbol id="8" viewBox="0 0 34 48">
<path d="M17 48c10 0 17-5 17-13 0-6-4-11-10-12v-1c5-1 8-5 8-10 0-7-6-12-15-12S2 5 2 12c0 5 3 9 8 10v1C4 24 0 29 0 35c0 8 7 13 17 13Zm0-28c-5 0-9-3-9-7 0-5 4-8 9-8s9 3 9 8c0 4-4 7-9 7Zm0 23c-6 0-10-4-10-9s4-8
10-8 10 3 10 8-4 9-10 9Z"/></symbol>
<symbol id="9" viewBox="0 0 34 48">
<path d="M0 16c0 9 6 15 15 15 3 0 6-1 8-3l-1 3L9 48h8l10-14c5-7 7-12 7-18 0-9-7-16-17-16S0 7 0 16ZM17 6c6 0 10 4 10 10s-4 10-10 10S7 22 7 16 11 6 17 6Z"/></symbol>
<symbol id="finalQRCode"><g id="qrcode"/></symbol>
</defs>
<rect fill="#000000" height="540" rx="20" width="400"/>
<rect fill="#ffffff" height="530" rx="15" width="390" x="5" y="5"/>
<use href="#homekit" height="120" width="130" x="24" y="30"/>
<use href="#0" id="Digit1" height="48" width="34" x="174" y="30"/>
<use href="#0" id="Digit2" height="48" width="34" x="228" y="30"/>
<use href="#0" id="Digit3" height="48" width="34" x="282" y="30"/>
<use href="#0" id="Digit4" height="48" width="34" x="336" y="30"/>
<use href="#0" id="Digit5" height="48" width="34" x="174" y="102"/>
<use href="#0" id="Digit6" height="48" width="34" x="228" y="102"/>
<use href="#0" id="Digit7" height="48" width="34" x="282" y="102"/>
<use href="#0" id="Digit8" height="48" width="34" x="336" y="102"/>
<use href="#finalQRCode" height="340" width="340" x="30" y="175"/></svg>

## Berry support  

The driver provides two Berry classes to allow extensions and interactions with the sensors. It is also possible to write generic BLE functions unrelated to Xiaomi sensors.  
  
### MI32 class
To access and modify the Xiaomi sensor data the `MI32` class is provided.  
First we need an instance, like so:  
`m = MI32()` 
  
We have the following methods, which are chosen to be able to replace the old commands MI32Battery, MI32Unit and MI32Time (using instance `m`):  

- `m.devices()`: returns the number of monitored Xiaomi devices
- `m.get_name(x)`: returns a string with the sensor name (internal name of the driver) at slot x in the internal sensor array of the driver
- `m.get_MAC(x)`: returns a byte buffer (6 bytes) representing the MAC at slot x in the internal sensor array of the driver
- `m.set_bat(x,v)`:  sets the battery value to v at slot x in the internal sensor array of the driver
- `m.set_hum(x,v)`:  sets the humidity value to v at slot x in the internal sensor array of the driver
- `m.set_temp(x,v)`:  sets the temperature value to v at slot x in the internal sensor array of the driver
  
### BLE class
  
For generic BLE access we have `BLE`, which is instantiated as before.  
`ble = BLE()`
  
To simplify BLE access this works in the form of state machine, where you have to set some properties and then finally launch an operation. Besides we have two callback mechanisms for listening to advertisements and active sensor connections. Both need a byte buffer in Berry for data exchange and a Berry function as the callback.  
To listen to advertisements inside a class (that could be a driver) we could initialize like that:

!!! example "Simple Advertisement Listener"

  ```python
  var ble, cbp, buf
  def init()
      self.buf = bytes(-64)
      self.cbp = tasmota.gen_cb(/-> self.cb())
      self.ble = BLE()
      self.ble.adv_cb(self.cbp,self.buf)
  end

  def cb()
    print(buf) # simply prints out the byte buffer of an advertisement packet
  end
  ```

To stop listening call:  
`self.ble.adv_cb(0)`
  
We just have to provide a pointer to a (callback) function and a byte buffer.  The returned data in the byte buffer uses the following proprietary format:  
```haskell
6 bytes - MAC
1 byte - address type 
2 bytes - SVC
1 byte  - RSSI
1 byte  - length of service data in bytes (maybe zero!!)
n bytes - service data (i.e. payload of the Xiaomi sensors) if present - if 
          NOT the first byte is the length of manufacturer data in bytes 
if(no service data):
  1 byte  - length of manufacturer data (maybe zero too!!)
  n bytes - manufacturer data (i.e. iBeacon data)
```

  
Communicating via connections is a bit more complex. We have to start with a callback function and a byte buffer again.  
```python
ble = BLE()
cbuf = bytes(-64)

def cb(error)
end

cbp = tasmota.gen_cb(cb)
ble.conn_cb(cbp,cbuf)
```
  
Error codes:

- 0 - no error
- 1 - connection error
- 2 - did not get service
- 3 - did not get characteristic
- 4 - could not read value
- 5 - characteristic can not notify
- 6 - characteristic not writable
- 7 - did not write value
- 8 - timeout: did not read on notify

  
Internally this creates a context, that can be modified with the follwing methods:
  
Set the MAC of the device we want to connect to:  
`ble.set_MAC(mac,type)`: where mac is a 6-byte-buffer, type is optional 0-3, default is 0
  
Set service and characteristic:  
`ble.set_svc(string)`: where string is a 16-Bit, 32-Bit or 128-Bit service uuid  
`ble.set_chr(string)`: where string is a 16-Bit, 32-Bit or 128-Bit characteristic uuid  

Finally run the context with the specified properties and (if you want to get data back to Berry) have everything prepared in the callback function:  
`ble.run(operation)`: where operation is a number, that represents an operation in a proprietary format. Current implemention disconnects after every operation:

- 11 - read  
- 12 - write  
- 13 - notify read  
  
The buffer format for reading and writing is in the format (lenth - data):
```
1 byte  - length of data in bytes
n bytes - data
```

Here is an example for setting the time of a sensor as a replacement for the old MI32Time command:  
!!! example "MI32Time in Berry"

  ```python
  ble = BLE()
  m = MI32()
  sl = 0

  cbuf = bytes(-64)
  def cb()
    # nothing to be done here
  end

  cbp = tasmota.gen_cb(cb)
  ble.conn_cb(cbp,cbuf)

  def SetMACfromSlot(slot)
      if slot+1>m.devices()
          return "out of bounds"
      end
      sl = slot
      var _m = m.get_MAC(slot)
      ble.set_MAC(_m)
  end

  def MI32Time(slot)
      SetMACfromSlot(slot)
      ble.set_svc("EBE0CCB0-7A0A-4B0C-8A1A-6FF2997DA3A6")
      ble.set_chr("EBE0CCB7-7A0A-4B0C-8A1A-6FF2997DA3A6")
      cbuf[0] = 5
      var t = tasmota.rtc()
      var utc = t.item("utc")
      var tz = t.item("timezone")/60
      cbuf.set(1,utc,4)
      cbuf.set(5,tz,1)
      ble.run(12)
  end
  ```





*[HAP]: HomeKit Accessory Protocol
*[NVS]: Non Volatile Storage
*[mDNS]: multicast DNS
*[IGMP]: Internet Group Management Protocol
*[BLE]: Bluetooth Low Energy
*[Berry]: Berry Script Language