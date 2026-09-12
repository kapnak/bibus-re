module.exports = async (request, res) => {
    if (!request.url.startsWith('/InstantTicketing/v3/networks/5/ticketing/validations')) {
        return null;
    }

    res.writeHead(200, {
        'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
        'content-type': 'application/json',
        expires: '0',
        pragma: 'no-cache',
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'transfer-encoding': 'chunked',
        vary: 'Accept-Encoding',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'x-xss-protection': '1; mode=block'
    });

    const formatDate = (date) => {
        return date.toISOString().replace(/\.\d{3}Z$/, '+0000')
    };

    const validationDate = new Date(Date.now() - 15 * 60 * 1000);
    const expirationDate = new Date(Date.now() + 45 * 60 * 1000);
    const secondsRemaining = Math.floor(Math.max(0, Math.floor((expirationDate - Date.now()) / 1000)));

    return res.end(JSON.stringify({
        "latestValidations": [
            {
                "validationTimestamp": formatDate(validationDate),
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "26",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": secondsRemaining,
                        "endOfValidityDate": formatDate(expirationDate),
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-09-02T10:18:23+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "25",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -823318,
                        "endOfValidityDate": "2026-09-02T11:18:23+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-08-31T10:03:27+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "24",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -997014,
                        "endOfValidityDate": "2026-08-31T11:03:27+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-07-23T10:11:30+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "23",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -4366131,
                        "endOfValidityDate": "2026-07-23T11:11:30+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-07-03T10:04:00+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "22",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -6094581,
                        "endOfValidityDate": "2026-07-03T11:04:00+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-06-29T10:04:42+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "21",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -6440139,
                        "endOfValidityDate": "2026-06-29T11:04:42+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-06-05T10:04:13+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "20",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -8513768,
                        "endOfValidityDate": "2026-06-05T11:04:13+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-06-04T11:18:21+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "19",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -8595720,
                        "endOfValidityDate": "2026-06-04T12:18:21+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-06-04T10:09:16+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "3044573",
                        "contractValidationId": "18",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -8599865,
                        "endOfValidityDate": "2026-06-04T11:09:16+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-05-27T10:05:14+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "17",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -9291307,
                        "endOfValidityDate": "2026-05-27T11:05:14+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-05-07T10:08:29+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "16",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -11019112,
                        "endOfValidityDate": "2026-05-07T11:08:29+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-04-16T10:04:37+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "15",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -12833744,
                        "endOfValidityDate": "2026-04-16T11:04:37+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-04-09T10:03:48+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "14",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -13438593,
                        "endOfValidityDate": "2026-04-09T11:03:48+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-04-01T10:23:41+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "13",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -14128600,
                        "endOfValidityDate": "2026-04-01T11:23:41+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-31T10:02:49+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "12",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -14216252,
                        "endOfValidityDate": "2026-03-31T11:02:49+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-26T12:09:25+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "11",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -14640656,
                        "endOfValidityDate": "2026-03-26T13:09:25+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-26T11:07:38+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "10",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -14644363,
                        "endOfValidityDate": "2026-03-26T12:07:38+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-18T11:08:34+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "9",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -15335507,
                        "endOfValidityDate": "2026-03-18T12:08:34+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-12T12:24:23+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2737368",
                        "contractValidationId": "8",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -15849358,
                        "endOfValidityDate": "2026-03-12T13:24:23+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-12T11:07:40+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2661514",
                        "contractValidationId": "7",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -15853961,
                        "endOfValidityDate": "2026-03-12T12:07:40+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-05T12:52:06+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2661514",
                        "contractValidationId": "6",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -16452495,
                        "endOfValidityDate": "2026-03-05T13:52:06+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-05T11:10:33+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2661514",
                        "contractValidationId": "5",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -16458588,
                        "endOfValidityDate": "2026-03-05T12:10:33+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-05T06:38:35+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2661514",
                        "contractValidationId": "4",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -16474906,
                        "endOfValidityDate": "2026-03-05T07:38:35+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-03-02T11:08:48+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2661514",
                        "contractValidationId": "3",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -16717893,
                        "endOfValidityDate": "2026-03-02T12:08:48+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-02-26T16:45:07+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2661514",
                        "contractValidationId": "2",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -17043314,
                        "endOfValidityDate": "2026-02-26T17:45:07+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            },
            {
                "validationTimestamp": "2026-02-26T12:43:19+0000",
                "supportId": "ffe1bfed56d39adb",
                "listOfImpactedContracts": [
                    {
                        "contractId": "2661514",
                        "contractValidationId": "1",
                        "productLabel": "Ticket 10 unités",
                        "isATransfer": false,
                        "remainingTime": -17057822,
                        "endOfValidityDate": "2026-02-26T13:43:19+0000",
                        "transactionState": "UNKNOWN",
                        "numberOfUnitsValidated": 1
                    }
                ],
                "validationOption": {}
            }
        ]
    }));

}
