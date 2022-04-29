# MI32  
  
The MI32-driver focuses on the passive observation of BLE sensors of the Xiaomi/Mijia universe, thus only needing a small memory footprint. This allows to additionally run a dedicated software bridge to Apples HomeKit with very few additional configuration steps. Berry can be used in parallel.  
Currently supported are the original ESP32, the ESP32-C3 and the ESP32-S3.

## Usage
  
This driver is not part of any standard build. To self compile it is recommended to add build environments to `platformio_tasmota_cenv.ini`. This file needs to be created first.  
Add these sections:  
```
[env:tasmota32-mi32-homebridge]
extends                 = env:tasmota32_base
build_flags             = ${env:tasmota32_base.build_flags}
                          -DUSE_MI_ESP32
                          -DUSE_MI_EXT_GUI
                          -DUSE_MI_HOMEKIT=1    ; 1 to enable; 0 to disable
lib_extra_dirs          = lib/libesp32, lib/libesp32_div, lib/lib_basic, lib/lib_i2c, lib/lib_div, lib/lib_ssl
lib_ignore              = ESP8266Audio
                          ESP8266SAM
                          TTGO TWatch Library
                          Micro-RTSP
                          epdiy
                          esp32-camera

[env:tasmota32c3-mi32-homebridge]
extends                 = env:tasmota32c3
build_flags             = ${env:tasmota32_base.build_flags}
                          -DUSE_MI_ESP32
                          -DUSE_MI_EXT_GUI
                          -DUSE_MI_HOMEKIT=1    ; 1 to enable; 0 to disable
lib_extra_dirs          = lib/libesp32, lib/libesp32_div, lib/lib_basic, lib/lib_i2c, lib/lib_div, lib/lib_ssl
lib_ignore              = ESP8266Audio
                          ESP8266SAM
                          TTGO TWatch Library
                          Micro-RTSP
                          epdiy
                          esp32-camera
```
  
It is probably necessary to restart your IDE (i.e. Visual Studio Code) to see the option to build these environments.

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
    <th class="th-lboi">YLYK01</th>
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
    <th class="th-lboi">YLKG07/08</th>
  </tr>
  <tr>
    <td class="tg-lboi"><img src="../_media/bluetooth/SJWS01L.png" width=200></td>
    <td class="tg-lboi"><img src="../_media/bluetooth/YLKG08.png" width=200></td>
  </tr>
  <tr>
    <td class="tg-lboi">button press (single and long), leak alarm, battery</td>
    <td class="tg-lboi">button press (single and double), hold,<br> incremental rotary encoder w/o press</td>
  </tr>
    <td class="tg-lboi">passive only with decryption</td>
    <td class="tg-lboi">passive only with decryption (legacy decryption)<br>both versions reported as YLKG08</td>
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

<script src="../extra_javascript/bindkey_loader.js"></script>
<p>MI32CFG <span id='importedDev'>- nothing imported yet</span></p>
<input size="56" type="text" id="result_config" value="" placeholder="paste your mi32cfg here"><br>
<button type="button" class="md-button md-button--primary" onclick="importCfg();">Import MI32Cfg</button>

<span id="mi32cfg_tab">
=== "Table"

    empty config

=== "JSON"

    ``` haskell
    []
    ```


  
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
MI32Option4|`0` = use passive scanning (default)<br>`1` = use active scanning, needed for a few sensors (can have negative side effects!)

!!! tip

    If you really want to read battery for LYWSD02, Flora and CGD1, consider doing it in Berry.


!!! tip

    If you want to add a new BLE sensor to your config on the device, use `MI32option3 1` to add the new sensor by catching a BLE packet. Then use `MI32Cfg` to save the new config on flash.
  
  
## Mi Dashboard
  
The driver provides an extended web GUI to show the observed Xiaomi sensors in a widget style, that features a responsive design to use the screen area as effective as possible. The other advantage is, that only the widget with new data gets redrawn (indicated by a fading circle) and no unnessecary refresh operations will happen. A simple graph shows if valid data for every hour was received in the last 24h, where only one gap for the coming hour is not a sign of an error. Configured sensors with no received packet since boot or key/decryption errors are dimmed.  
  
## HomeKit Bridge
  
If activated at compile time the driver will start the HAP core (= the main task of the HomeKit framework) after succesfully reading a valid **mi32cfg** file after the start. It will create a 'bridge accessory' presenting all configured BLE devices to HomeKit. You can add the ESP32 as such a **Mi-Home-Bridge** to HomeKit in the native way, like you would add a commercial product to you local HomeKit network. The setup key is derived from the Wifi MAC of your ESP32 to easily allow many ESP32 to be used as a HomeKit bridge in your local network.  
Besides the driver will also manage up to four relays and sync them with HomeKit.  
There is nothing more to configure, the driver will automatically translate the data packets back and forth.  
It just works ... except, when it does not.

!!! danger "Known issues"

    The underlying HAP framework will expose incompatible network configurations, which will likely be related to mDNS and IGMP settings. There is nothing, that the Tasmota side can fix here.

!!! danger "If it is not broken, do not upgrade"

    Although the driver does not write to the NVS section and the usage of a modified HAP framework (using a NVS wrapper) the behavior of Tasmota firmware upgrades is undefined with regards to a working HomeKit installation. Similar things can also happen using much bigger projects like "Homebridge". So it might be necessary to completely erase the Mi-Bridge from your "Home" in Homekit and doing a flash erase of the ESP32 after a firmware upgrade of the ESP32. It is recommend to first create a final mi32cfg file before you add the Mi-Home-Bridge to your "Home".
  
### HomeKit QR-Code-Generator  - Web App
  
This will generate a QR-Code based on the MAC address of the ESP32 which runs Tasmotas Homekit-Bridge. Use the camera of your iPhone or iPad to easily start the setup procedure.  

<script src="../extra_javascript/qrcode.js"></script>
<input size="40" type="text" id="Wifi-MAC" value="" placeholder="Input WiFi MAC of the ESP32" style="font-size:1.5em;"><br>

<object data="../extra_javascript/hk_qrcode.svg" id="hk_qrcode" type="image/svg+xml" height="0"></object>

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
      self.cbp = tasmota.gen_cb(/s,m-> self.cb(s,m))
      self.ble = BLE()
      self.ble.adv_cb(self.cbp,self.buf)
  end

  def cb(svc,manu)
    print(buf) # simply prints out the byte buffer of an advertisement packet
    if svc != 0 # if service data present
        print("service data:")
        var _len = self.buf[svc-2]-1
        # the index points to the data part of an AD element, two position before that is length of "type + data", 
        # so we substract one byte from that length to get the "pure" data length
        print(self.buf[svc.._len+svc])
    end
    if manu != 0 # if manufacturer data present
        print("manufacturer data:")
        var _len = self.buf[manu-2]-1
        print(self.buf[manu.._len+manu])
    end
  end
  ```

To stop listening call:  
`self.ble.adv_cb(0)`
  
We just have to provide a pointer to a (callback) function and a byte buffer.  The returned data in the byte buffer uses the following proprietary format:  
```haskell
6 bytes - MAC
1 byte - address type 
1 byte  - RSSI
1 byte  - length of payload
n bytes - payload data 
```
  
The advertisement callback function provides 2 arguments, which are indices of the whole buffer that point to optional parts of the payload. A value of 0 means, this type of of element is not in the payload.  
1. svc (= service data index) - index of service data in the advertisment buffer  
2. manu (= manufacturer data index) - index of manufacturer data in the advertisment buffer  
  
The payload is always provided completely, so every possibles AD type can be parsed in Berry if needed, but for convenience the two most important types for IOT applications are given in the callback.  
  
!!! tip

    The payload can be parsed according to the BLE GAP standard. It consists of AD elements of variable size in the format length-type-data, where the length byte describes the length of the two following components in bytes, the type byte is defined in the GAP and the data parts of 'length-1' bytes is interpreted according to the type.

Two methods for filtering of advertisements are provided:  
`ble.adv_watch(mac,type)`: watch BLE address exclusively, is added to a list (mac is a 6-byte-buffer, type is optional 0-3, default is 0)  
`ble.adv_block(mac,type)`: block  BLE address, is added to a list(mac is a 6-byte-buffer, type is optional 0-3, default is 0)  
  
!!! tip

    The watchlist is more effective to avoid missing packets, than the blocklist in environments with high BLE traffic. Both methods work for the internal Xiaomi driver and the post processing with Berry.
  
Communicating via connections is a bit more complex. We have to start with a callback function and a byte buffer again.  
```python
ble = BLE()
cbuf = bytes(-64)

def cb(error,op,uuid)
end

cbp = tasmota.gen_cb(cb)
ble.conn_cb(cbp,cbuf)
```
  
Error codes:

- 0 - no error
- 1 - connection error
- 2 - did disconnect
- 3 - did not get service
- 4 - did not get characteristic
- 5 - could not read value
- 6 - characteristic can not notify
- 7 - characteristic not writable
- 8 - did not write value
- 9 - timeout: did not read on notify
  
Op codes:

- 1 - read  
- 2 - write  
- 3 - subscribe - direct response after launching a run command to subscribe
- 103 - notify read - the notification with data from the BLE server
  
UUID:  
Returns the 16 bit UUID of the characteristic as a number, that returns a value.
  
Internally this creates a context, that can be modified with the follwing methods:
  
Set the MAC of the device we want to connect to:  
`ble.set_MAC(mac,type)`: where mac is a 6-byte-buffer, type is optional 0-3, default is 0
  
Set service and characteristic:  
`ble.set_svc(string)`: where string is a 16-Bit, 32-Bit or 128-Bit service uuid  
`ble.set_chr(string)`: where string is a 16-Bit, 32-Bit or 128-Bit characteristic uuid  

Finally run the context with the specified properties and (if you want to get data back to Berry) have everything prepared in the callback function:  
`ble.run(operation,response)`: where operation is a number (optional: boolean w/o server response to write or subscribe, default is false) , that represents an operation in a proprietary format. Values below 10 will not disconnect automatically after completion:

- 1 - read  
- 2 - write  
- 3 - subscribe  
- 5 - disconnect  

- 11 - read - then disconnect (returns 1 in the callback)  
- 12 - write - then disconnect (returns 2 in the callback)  
- 13 - subscribe - then disconnect after waiting for notification(returns 3 in the callback)  
  
The buffer format for reading and writing is in the format (length - data):
```
1 byte  - length of data in bytes
n bytes - data
```
  
### Berry examples

Here is an implementaion of the "old" MI32 commands:  
!!! example "removed MI32 commands in Berry"

    ```python
    ble = BLE()
    m = MI32()
    j = 0
    sl = 0

    cbuf = bytes(-64)
    def cb()
        if j == 0
            print(cbuf)
        end
        if j == 1
            var temp = cbuf.get(1,2)/100.0
            var hum = cbuf.get(3,1)*1.0
            var bat = (cbuf.get(4,2)-2100)/12
            m.set_temp(sl,temp)
            m.set_hum(sl,hum)
            m.set_bat(sl,bat)
        end
        if j == 4
            var bat = cbuf.get(1,1)
            m.set_bat(sl,bat)
        end
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
        j = 0
        ble.run(12,1)
    end

    def MI32Unit(slot,unit)
        SetMACfromSlot(slot)
        ble.set_svc("EBE0CCB0-7A0A-4B0C-8A1A-6FF2997DA3A6")
        ble.set_chr("EBE0CCBE-7A0A-4B0C-8A1A-6FF2997DA3A6")
        cbuf[0] = 1
        cbuf[1] = unit
        j = 0
        ble.run(12,1)
    end

    def MI32Bat(slot)
        SetMACfromSlot(slot)
        var name = m.get_name(slot)
        if name == "LYWSD03"
            ble.set_svc("ebe0ccb0-7A0A-4B0C-8A1A-6FF2997DA3A6")
            ble.set_chr("ebe0ccc1-7A0A-4B0C-8A1A-6FF2997DA3A6")
            j = 1
            ble.run(13)
        end
        if name == "MHOC401"
            ble.set_svc("ebe0ccb0-7A0A-4B0C-8A1A-6FF2997DA3A6")
            ble.set_chr("ebe0ccc1-7A0A-4B0C-8A1A-6FF2997DA3A6")
            j = 1
            ble.run(13,1)
        end
        if name == "LYWSD02"
            ble.set_svc("ebe0ccb0-7A0A-4B0C-8A1A-6FF2997DA3A6")
            ble.set_chr("ebe0ccc1-7A0A-4B0C-8A1A-6FF2997DA3A6")
            j = 2
            ble.run(11,1)
        end
        if name == "FLORA"
            ble.set_svc("00001204-0000-1000-8000-00805f9b34fb")
            ble.set_chr("00001a02-0000-1000-8000-00805f9b34fb")
            j = 3
            ble.run(11,1)
        end
        if name == "CGD1"
            ble.set_svc("180F")
            ble.set_chr("2A19")
            j = 4
            ble.run(11,1)
        end
    end
    ```
  
#### More Examples

??? example "MI32Scan (deprecated Version!!)"

    ```python
    beacons =[
            #{"MAC":"112233445566","Timer":999},
            #{"MAC":"778899aabbcc","Timer":999}
            ]

    ibeacons =  [
                {"UID":0,"maj":0,"min":0}
                ]

    class BEACON : Driver
        var ble, cbp, buf
        var scan_timer, scan_result


        def init()
            self.buf = bytes(-64)
            self.scan_timer = 0
            self.scan_result = []
            if size(beacons) > 0
                for idx:0..size(beacons)-1
                    var _tmp = beacons[idx]['MAC']
                    print(_tmp)
                    beacons[idx]['MAC'] = bytes(_tmp)
                end
            end
            self.cbp = tasmota.gen_cb(/-> self.cb())
            self.ble = BLE()
            self.ble.adv_cb(self.cbp,self.buf)
        end

        def cb()
            if self.scan_timer > 0
                self.add_to_result()
            end
            self.check_beacons()
            #self.check_ibeacons()
        end

        def add_to_result()
            if size(self.scan_result) > 0
                for i:0..size(self.scan_result)-1
                    if self.buf[0..5] == self.scan_result[i]['MAC']
                        #print('known entry')
                        return
                    end
                end
            end
            var entry = {}
            entry.insert('MAC',self.buf[0..5])
            entry.insert('Type',self.buf[6])
            var svc = self.buf.get(7,2)
            entry.insert('SVC',svc)
            var rssi = (255 - self.buf.get(9,1)) * -1
            entry.insert('RSSI',rssi)
            var len_s =  self.buf.get(10,1)
            var len_c = 0
            if len_s == 0 && svc == 0
                len_c = self.buf.get(11,1)
            end
            if len_c != 0 
                entry.insert('CID',self.buf.get(12,2))
            else
                entry.insert('CID',0)
            end
            self.scan_result.push(entry)
            print(self.buf)
        end

        def check_beacons()
            if size(beacons) > 0
                for i:0..size(beacons)-1
                    if self.buf[0..5] == beacons[i]['MAC']
                        beacons[i]['Timer'] = 0
                        print(beacons[i])
                        return
                    end
                end
            end
        end

        def check_ibeacons()
            if self.buf.get(12,4) == 352452684
                var uid = self.buf[16..31]
                var maj = self.buf.get(32,2)
                var min = self.buf.get(34,2)
                var tx = self.buf.get(36,1)
                print(uid)
                print(maj)
                print(min)
                print(tx)
                print(self.buf[32..36])
            end
        end

        def count_up_time()
            if size(beacons) > 0
                for idx:0..size(beacons)-1
                    beacons[idx]['Timer'] += 1
                end
            end
        end

        def show_scan()
            import string
            if size(self.scan_result) > 0
                var msg = '{'
                for i:0..size(self.scan_result)-1
                    var entry = self.scan_result[i]
                    var msg_e = string.format("{\"MAC\":\"%02X%02X%02X%02X%02X%02X\",\"Type\":%02X,\"SVC\":\"%04X\",\"CID\":\"%04X\",\"RSSI\":%i},",
                    entry['MAC'][0],entry['MAC'][1],entry['MAC'][2],entry['MAC'][3],
                    entry['MAC'][4],entry['MAC'][5],entry['Type'],entry['SVC'],entry['CID'],entry['RSSI'])
                    msg += msg_e
                end
                msg += '}'
                print(msg)
            end
        end

        def every_second()
            if self.scan_timer > 0
                if self.scan_timer == 1
                    self.show_scan()
                end
                self.scan_timer -= 1
            end
            if beacons.size(0) > 0
                self.count_up_time()
            end
        end
    end

    beacon = BEACON()
    tasmota.add_driver(beacon)

    def scan(cmd, idx, payload, payload_json)
        if int(payload) == 0
            beacon.scan_result = []
        end
        beacon.scan_timer = int(payload)
    end

    tasmota.add_cmd('Mi32Scan', scan)
    ```

??? example "Govee desk lamp - pre-alpha"

    ```python
    # control a BLE Govee desk lamp
    class GOVEE : Driver
        var ble, cbp, buf
    
        def init(MAC)
            self.buf = bytes(-21) # create a byte buffer, first byte reserved for length info
            self.buf[0] = 20 # length of the data part of the buffer in bytes
            self.buf[1] = 0x33 # a magic number - control byte for the Govee lamp
            self.cbp = tasmota.gen_cb(/e,o,u->self.cb(e,o,u)) # create a callback function pointer
            self.ble = BLE()
            self.ble.conn_cb(self.cbp,self.buf)
            self.ble.set_MAC(bytes(MAC),1) # addrType: 1 (random)
        end
    
        def cb(error,op,uuid)
            if error == 0
                print("success!")
                return
            end
            print(error)
        end
    
        def chksum()
            var cs = 0
            for i:1..19
                cs ^= self.buf[i]
            end
            self.buf[20] = cs
        end
    
        def clr()
            for i:2..19
                self.buf[i] = 0
            end
        end
    
        def writeBuf()
            self.ble.set_svc("00010203-0405-0607-0809-0a0b0c0d1910")
            self.ble.set_chr("00010203-0405-0607-0809-0a0b0c0d2b11")
            self.chksum()
            print(self.buf)
            self.ble.run(12) # op: 12 (write, then disconnect)
        end
    end
    
    gv = GOVEE("AABBCCDDEEFF") # MAC of the lamp
    tasmota.add_driver(gv)
    
    def gv_power(cmd, idx, payload, payload_json)
        if int(payload) > 1
            return 'error'
        end
        gv.clr()
        gv.buf[2] = 1 # power cmd
        gv.buf[3] = int(payload)
        gv.writeBuf()
    end
    
    def gv_bright(cmd, idx, payload, payload_json)
        if int(payload) > 255
            return 'error'
        end
        gv.clr()
        gv.buf[2] = 4 # brightness
        gv.buf[3] = int(payload)
        gv.writeBuf()
    end
    
    def gv_rgb(cmd, idx, payload, payload_json)
        var rgb = bytes(payload)
        print(rgb)
        gv.clr()
        gv.buf[2] = 5 # color
        gv.buf[3] = 5 # manual ??
        gv.buf[4] = rgb[3]
        gv.buf[5] = rgb[0]
        gv.buf[6] = rgb[1]
        gv.buf[7] = rgb[2]
        gv.writeBuf()
    end
    
    def gv_scn(cmd, idx, payload, payload_json)
        gv.clr()
        gv.buf[2] = 5 # color
        gv.buf[3] = 4 # scene
        gv.buf[4] = int(payload)
        gv.writeBuf()
    end
    
    def gv_mus(cmd, idx, payload, payload_json)
        var rgb = bytes(payload)
        print(rgb)
        gv.clr()
        gv.buf[2] = 5 # color
        gv.buf[3] = 1 # music
        gv.buf[4] = rgb[0]
        gv.buf[5] = 0
        gv.buf[6] = rgb[1]
        gv.buf[7] = rgb[2]
        gv.buf[8] = rgb[3]
        gv.writeBuf()
    end
    
    
    tasmota.add_cmd('gpower', gv_power) # only on/off
    tasmota.add_cmd('bright', gv_bright) # brightness 0 - 255
    tasmota.add_cmd('color', gv_rgb) #  color 00FF0000 - sometimes the last byte has to be set to something greater 00, usually it should be 00
    tasmota.add_cmd('scene', gv_scn) # scene 0 - ?,
    tasmota.add_cmd('music', gv_mus) # music 00 - 0f + color 000000   -- does not work at all!!!
    
    #   POWER      = 0x01
    #   BRIGHTNESS = 0x04
    
    #   COLOR      = 0x05
        #   MANUAL     = 0x02 - seems to be wrong for this lamp
        #   MICROPHONE = 0x01 - can not be confirmed yet
        #   SCENES     = 0x04
    ```
??? example "Xbox X/S controller - proof of concept"

    ```python
    # just a proof of concept to connect a Xbox X/S controller
    # must be repaired on every connect
    class XBOX : Driver
        var ble, cbp, buf

        def init(MAC)
            self.cbp = tasmota.gen_cb(/e,o,u->self.cb(e,o,u))
            self.buf = bytes(-256)
            self.ble = BLE()
            self.ble.conn_cb(self.cbp,self.buf)
            self.ble.set_MAC(bytes(bytes(MAC)),0)
            self.connect()
        end

        def connect() # separated to call it from the berry console if needed
            self.ble.set_svc("1812")
            self.ble.set_chr("2a4a") # the first characteristic we have to read
            self.ble.run(1) # read
        end

        def handle_read_CB(uuid) # uuid is the notifying characteristic
        # we just have to read these characteristics before we can finally subscribe
            if uuid == 0x2a4a # ignore data
                self.ble.set_chr("2a4b")
                self.ble.run(1) # read next characteristic 
            end
            if uuid == 0x2a4b # ignore data
                self.ble.set_chr("2a4d")
                self.ble.run(1) # read next characteristic 
            end
            if uuid == 0x2a4d # ignore data
                self.ble.set_chr("2a4d")
                self.ble.run(3) # start notify
            end
        end

        def handle_HID_notifiaction() # a very incomplete parser
            if self.buf[14] == 1
                print("ButtonA") # a MQTT message could actually trigger something
            end
            if self.buf[14] == 2
                print("ButtonB")
            end
            if self.buf[14] == 8
                print("ButtonX")
            end
            if self.buf[14] == 16
                print("ButtonY")
            end
        end

        def cb(error,op,uuid)
            if error == 0
                if op == 1
                    print(op,uuid)
                    self.handle_read_CB(uuid)
                end
                if op == 3
                self.handle_HID_notification()
                end
                return
            else
                print(error)
            end
        end

    end

    xbox = XBOX("AABBCCDDEEFF")  # xbox controller MAC
    tasmota.add_driver(xbox)
    ```

*[HAP]: HomeKit Accessory Protocol
*[NVS]: Non Volatile Storage
*[mDNS]: multicast DNS
*[IGMP]: Internet Group Management Protocol
*[BLE]: Bluetooth Low Energy
*[Berry]: Berry Script Language