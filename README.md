# Bibus reverse engineering

This repository contains the necessary code to fake the validation of a ticket on the Bibus app.

> **Disclaimer:** This project was created for educational purposes, specifically to learn about Android app reverse engineering.  
> Using public transportation with the method described here can be considered as a fraud.  
> [As september 2026, Bibus doesn't support ticketing through the app anymore.](https://www.bibus.fr/bibus-et-vous/actualites/les-evenements-du-reseau/evolution-de-la-billettique-bibus-ce-qui-change)

## Context 
[Bibus](https://www.bibus.fr/) is the public transportation network of Brest (France).
The Bibus app allows users to purchase and use transport tickets.
**The catch is that when the user uses a ticket, only a countdown is displayed with the time remaining.
The app does not provide a QR code or any other method to prove that the ticket was purchased.**

## Architecture

[FreeProxy](https://f-droid.org/en/packages/tech.xvanturing.freeproxy/) forwards the HTTPS requests of the app to a proxy ([mitmproxy](https://www.mitmproxy.org/)).  
As the APK is modified to trust certificates signed by user-installed CA certificate and the proxy owns a CA installed on the device, the proxy can decrypt the requests.  
The proxy then forwards the decrypted requests to a Node.js server. 
Finally, the Node.js server either replays the request to the original server, blocks them or returns its own response.
This is how the number of tickets and the validation is faked.

```
+ - - - - - - - - - - - - - - - - - - - - +
| Android device                          |
| +-----------+      +--------------+     |
| | Bibus app | ---> | proxy client |     |
| +-----------+      +--------------+     |
+ - - - - - - - - - - - - - | - - - - - - +
                            |
+ - - - - - - - - - - - - - | - - - - - - +
| Remote server             v             |
| +----------------+     +--------------+ |
| | Node.js server | <-- | mitm proxy   | |
| +----------------+     +--------------+ |
+ - - - | - - - - - - - - - - - - - - - - +
        |
+ - - - v - - - - - - - - - - - - - - - - +
| Instant-system API (Bibus)              |
+ - - - - - - - - - - - - - - - - - - - - +
```


## Quick start

Here is how to set up the project:

1. Run the server components using Docker: `docker compose up --build`.  
   The proxy runs on port 80 by default.
2. Download the proxy CA certificate from: `http://<proxyhost>:<port>/__ca.cer`.  
   Then install it on your Android device.
3. Install the modified Bibus APK on your device using ADB.  
   The APK are on the repo in `apks/modified`.  
   See [Methodology](#methodology) to build your own.
4. Install a proxy client like [FreeProxy](https://f-droid.org/en/packages/tech.xvanturing.freeproxy/) that allows you to set up a tunnel for a specific app.
   Configure it for the Bibus app with your proxy host and port.

Finally, open the app and log in. You should see a ticket validation starting from 15 minutes ago.


## Methodology

### APK modification

#### Extracting the XAPK
The first step was to download the APK from the internet.
I found a XAPK, which is a ZIP archive containing the APK splits.

Inside the XAPK was:
```
config.armeabi_v7a.apk
config.mdpi.apk
fr.bibus.android.apk
icon.png
manifest.json
```

#### Decompiling the APK

I decompiled the APK using `apktool`:
```
apktool d fr.bibus.android.apk
```
It creates a directory `fr.bibus.android`.

#### Modifying the APK

After a few attempts rebuilding the app, Google Play was preventing me from opening the app. 
I solved this by removing several lines from `AndroidManifest.xml` that referred to 
Google Play's app-stamping and licensing mechanisms:
```
<meta-data android:name="com.android.stamp.source" android:value="https://play.google.com/store"/>
<meta-data android:name="com.android.stamp.type" android:value="STAMP_TYPE_DISTRIBUTION_APK"/>
<activity android:exported="false" android:name="com.pairip.licensecheck.LicenseActivity"/>
<activity android:exported="false" android:name="com.google.android.play.core.common.PlayCoreDialogWrapperActivity" android:stateNotNeeded="true" android:theme="@style/Theme.PlayCore.Transparent"/>
<uses-permission android:name="com.android.vending.CHECK_LICENSE"/>
```

I also overwrote the file `res/xml/network_security_config.xml` to make the app trust user-installed CA certificates:
```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <debug-overrides>
        <trust-anchors>
            <certificates src="user" />
        </trust-anchors>
    </debug-overrides>
    <base-config>
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

#### Rebuilding the APK

Rebuild the APK from the modified sources:
```sh
apktool b fr.bibus.android -o fr.bibus.android.edited.apk
```

Align and re-sign the APKs using [uber-apk-signer](https://github.com/patrickfav/uber-apk-signer):
```sh
java -jar uber-apk-signer-1.3.0.jar -a fr.bibus.android.edited.apk config.armeabi_v7a.apk config.mdpi.apk --allowResign -o build
```

Install the new APKs splits on your devices using `adb`:
```sh
adb install-multiple "build/fr.bibus.android.edited-aligned-debugSigned.apk" "build/config.armeabi_v7a-aligned-debugSigned.apk" "build/config.mdpi-aligned-debugSigned.apk"
```

For debugging, I used this command a lot to view the app logs:
```bash
adb logcat --pid=$(adb shell pidof -s fr.bibus.android)
```

### Fake server

I installed `mitmproxy`, its CA certificate on Android, a proxy client and created a simple Node.js server to 
print the request contents.

#### x-android-cert headers
The first thing I noticed was that the requests contained a header named `x-android-cert` with the fingerprint 
of the modified APK.
The API might detect this as suspicious, so I replaced it with the fingerprint of the original APK.
This command gives the original APK SHA-1 fingerprint:
```sh
apksigner.bat verify --print-certs fr.bibus.android.apk
```
The result was `b1af3a0bf998aeede1a8716a539e5a59da1d86d6`.


In all the requests sent by the app, it was easy to find the ones related to tickets and validations.
Most of the calls are made to:
- firebaseinstallations.googleapis.com
- prod.instant-system.com — the API that matters
- instant-system.com

#### Tickets

The instant-system API has an endpoint `GET /InstantTicketing/v3/networks/5/ticketing/contracts`.
It returns the number of tickets owned by the user.

##### Request
```json lines
{
  timestamp: '[hidden]',
  host: 'prod.instant-system.com',
  port: '443',
  method: 'GET',
  url: '/InstantTicketing/v3/networks/5/ticketing/contracts?userId=0&key=5',
  headers: {
    'user-agent': '[hidden] Android 12, SDK 31)',
    'accept-language': 'en-FR',
    'content-type': 'application/json',
    'x-consumer-id': 'android',
    'x-os-name': 'Android',
    'x-app-version': '6.17.11-3246.0',
    accept: 'application/json',
    'application-id': '7d1ebc20-83c4-4965-bf27-44efa44284cd',
    'session-id': 'a9f711ac-07b4-4170-98e4-8ed5f873b05e',
    authorization: 'Bearer [hidden]',
    'accept-encoding': 'br,gzip',
    'x-device-id': '[hidden]',
    connection: 'Keep-Alive'
  },
  body: <Buffer >,
  parsedBody: '[empty body]'
}
```

##### Response body
```json
{
  "contracts": [
    {
      "id": "3044573",
      "product": {
        "id": "702",
        "label": "Ticket 10 unités",
        "imgUrl": "https://instant-system.com/networks/5/FareProducts/ticket vert.png",
        "additionalInformation": {},
        "priceIncludingTaxes": {
          "amount": -1,
          "currency": "EUR"
        },
        "productType": "RELOAD",
        "validationEnabled": true,
        "multiValidationEnabled": false,
        "offlineValidationEnabled": false,
        "topUpProduct": false
      },
      "freeTransferRemaining": false,
      "startDate": "2026-06-03T22:00:00+0000",
      "status": "AVAILABLE",
      "onThisSupport": false,
      "remainingTickets": 1,
      "remainingValidations": 1,
      "validationProof": "[hidden]",
      "validationMethod": "AUTO",
      "showNotification": false,
      "activeTickets": 0,
      "refundable": false,
      "geolocationRequired": false,
      "cb2dEnabled": false,
      "actions": {}
    }
  ]
}
```

#### Validations

The endpoint `GET /InstantTicketing/v3/networks/5/ticketing/validations` returns the tickets that have been used and those currently in use.

##### Request
```json lines
{
  timestamp: '[hidden]',
  host: 'prod.instant-system.com',
  port: '443',
  method: 'GET',
  url: '/InstantTicketing/v3/networks/5/ticketing/validations?userId=0&key=5',
  headers: {
    'user-agent': '[hidden] Android 12, SDK 31)',
    'accept-language': 'en-FR',
    'content-type': 'application/json',
    'x-consumer-id': 'android',
    'x-os-name': 'Android',
    'x-app-version': '6.17.11-3246.0',
    accept: 'application/json',
    'application-id': '7d1ebc20-83c4-4965-bf27-44efa44284cd',
    'session-id': 'a9f711ac-07b4-4170-98e4-8ed5f873b05e',
    authorization: 'Bearer [hidden]',
    'accept-encoding': 'br,gzip',
    'x-device-id': '[hidden]',
    connection: 'Keep-Alive'
  },
  body: <Buffer >,
  parsedBody: '[empty body]'
}
```

#### Response body
```json
{
  "latestValidations": [
    {
      "validationTimestamp": "2026-XX-XXTXX:XX:XX+0000",
      "supportId": "[hidden]",
      "listOfImpactedContracts": [
        {
          "contractId": "3044573",
          "contractValidationId": "[hidden]",
          "productLabel": "Ticket 10 unités",
          "isATransfer": false,
          "remainingTime": -11111,
          "endOfValidityDate": "2026-XX-XXTXX:XX:XX+0000",
          "transactionState": "UNKNOWN",
          "numberOfUnitsValidated": 1
        }
      ],
      "validationOption": {}
    },
    {
      "validationTimestamp": "2026-XX-XXTXX:XX:XX+0000",
      "supportId": "[hidden]",
      "listOfImpactedContracts": [
        {
          "contractId": "3044573",
          "contractValidationId": "[hidden]",
          "productLabel": "Ticket 10 unités",
          "isATransfer": false,
          "remainingTime": -222222,
          "endOfValidityDate": "2026-XX-XXTXX:XX:XX+0000",
          "transactionState": "UNKNOWN",
          "numberOfUnitsValidated": 1
        }
      ],
      "validationOption": {}
    },
    {
      "validationTimestamp": "2026-XX-XXTXX:XX:XX+0000",
      "supportId": "[hidden]",
      "listOfImpactedContracts": [
        {
          "contractId": "3044573",
          "contractValidationId": "[hidden]",
          "productLabel": "Ticket 10 unités",
          "isATransfer": false,
          "remainingTime": -333333,
          "endOfValidityDate": "2026-XX-XXTXX:XX:XX+0000",
          "transactionState": "UNKNOWN",
          "numberOfUnitsValidated": 1
        }
      ],
      "validationOption": {}
    },
    {
      "validationTimestamp": "2026-XX-XXTXX:XX:XX+0000",
      "supportId": "[hidden]",
      "listOfImpactedContracts": [
        {
          "contractId": "3044573",
          "contractValidationId": "[hidden]",
          "productLabel": "Ticket 10 unités",
          "isATransfer": false,
          "remainingTime": -444444,
          "endOfValidityDate": "2026-XX-XXTXX:XX:XX+0000",
          "transactionState": "UNKNOWN",
          "numberOfUnitsValidated": 1
        }
      ],
      "validationOption": {}
    }
  ]
}
```


### Faking the responses

Knowing all of this, I just have to make the Node.js server return a validation with:
- a `timestamp` from 15 minutes ago
- an `endOfValidityDate` 45 minutes in the future
- and a `remainingTime` of 2700 seconds
In the ticket endpoint, I also set `activeTickets` to 1.

As a result, when I open my app, it shows that I validated a ticket 15 minutes ago and that it will expire in 45 minutes.

Voilà.