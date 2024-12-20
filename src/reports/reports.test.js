const { Reports } = require("./reports");

describe('Get reports', () => {
    const data = {
        instructions: [
        {
            "entity" : "Barclays",
            "instruction": "B",
            "agreedFx": 0.50,
            "currency": "SGP",
            "instructionDate": "10 Dec 2024",
            "settlementDate": "11 Dec 2024",
            "units": 200,
            "pricePerUnit": 100.25
        },
        {
            "entity" : "Stanley",
            "instruction": "S",
            "agreedFx": 0.22,
            "currency": "AED",
            "instructionDate": "06 Dec 2024",
            "settlementDate": "07 Dec 2024",
            "units": 450,
            "pricePerUnit": 150.5
        },
        {
            "entity" : "Loyrds",
            "instruction": "S",
            "agreedFx": 1.02,
            "currency": "GBP",
            "instructionDate": "13 Dec 2024",
            "settlementDate": "14 Dec 2024",
            "units": 100,
            "pricePerUnit": 150.5
        },
        {
            "entity" : "ICICI",
            "instruction": "B",
            "agreedFx": 0.52,
            "currency": "USD",
            "instructionDate": "13 Dec 2024",
            "settlementDate": "20 Dec 2024",
            "units": 1000,
            "pricePerUnit": 680.5
        },
        ]
    }

    const report = new Reports();
    report.instructions = [data];

    const {
        incomingRecords,
        outgoingRecords,
        rank
    } = report.getReports();

    test('should return Amount in USD settled incoming everyday', () => {
        const expectedResult = {
            '09 Dec 2024' : [{
                "entity" : "Stanley",
                "instruction": "S",
                "agreedFx": 0.22,
                "currency": "AED",
                "instructionDate": "06 Dec 2024",
                "settlementDate": "09 Dec 2024", // Changed to next working day
                "units": 450,
                "pricePerUnit": 150.5
            }],

            "15 Dec 2024" : [{
                "entity" : "Loyrds",
                "instruction": "S",
                "agreedFx": 1.02,
                "currency": "GBP",
                "instructionDate": "13 Dec 2024",
                "settlementDate": "15 Dec 2024", // Changed to next working day
                "units": 100,
                "pricePerUnit": 150.5
            }],
        };

        expect(JSON.stringify(incomingRecords)).toStrictEqual(JSON.stringify(expectedResult));
    });

    test('should return Amount in USD settled outcoming everyday', () => {
        const expectedResult = {
            '11 Dec 2024' : [{
                "entity" : "Barclays",
                "instruction": "B",
                "agreedFx": 0.50,
                "currency": "SGP",
                "instructionDate": "10 Dec 2024",
                "settlementDate": "11 Dec 2024",
                "units": 200,
                "pricePerUnit": 100.25
            }],

            "22 Dec 2024" : [{
                "entity" : "ICICI",
                "instruction": "B",
                "agreedFx": 0.52,
                "currency": "USD",
                "instructionDate": "13 Dec 2024",
                "settlementDate": "22 Dec 2024", // Changed date to next working date
                "units": 1000,
                "pricePerUnit": 680.5
            },],
        };

        expect(JSON.stringify(outgoingRecords)).toStrictEqual(JSON.stringify(expectedResult));
    });

    test('incoming and outgoing rank', () => {
        expect(rank.incoming.name).toBe('Loyrds');
        expect(rank.outgoing.name).toBe('ICICI');
    })
});