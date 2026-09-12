module.exports = async (request, res) => {
    if (!request.url.startsWith('/InstantTicketing/v3/networks/5/ticketing/contracts')) {
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

    return res.end(JSON.stringify({
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
                "remainingTickets": 999,
                "remainingValidations": 999,
                "validationProof": "AAA-1111111-2222222",
                "validationMethod": "AUTO",
                "showNotification": false,
                "activeTickets": 1,
                "refundable": false,
                "geolocationRequired": false,
                "cb2dEnabled": false,
                "actions": {}
            }
        ]
    }));

}
