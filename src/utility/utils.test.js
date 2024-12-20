
const utils = require('./utils');

describe('Filter By Instructions', () => {
    const instructions = [
        {
            "entity" : "abc",
            "instruction": "S",
        },
        {
            "entity" : "xyz",
            "instruction": "B",
        },
    ]
    
    test('should return the list of sell instructions for type S', () => {

        expect(utils.filterByInstruction(instructions, 'S')).toEqual([instructions[0]]);
    })

    test('should return the list of buy instructions for type B', () => {
        expect(utils.filterByInstruction(instructions, 'B')).toEqual([instructions[1]]);
    })
})

describe('Modify Settlement date', () => {
    test('should modifiy the settlementDate to next working day ie Monday for AED or SAR', () => {
        const instructions = [
            {
                "entity" : "ABC",
                "instruction": "B",
                "agreedFx": 0.52,
                "currency": "SAR",
                "instructionDate": "09 Dec 2024",
                "settlementDate": "14 Dec 2024", // Saturday
                "units": 1000,
                "pricePerUnit": 680.5
            }
        ]

        const modifiedInstructions = utils.adjustSettelmentDate(instructions);
        expect(modifiedInstructions[0]?.settlementDate).toEqual("16 Dec 2024"); //Monday
    })
    
    test('should modifiy the settlementDate to next working day ie Monday for AED or SAR', () => {
        const instructions = [
            {
                "entity" : "ABC",
                "instruction": "B",
                "agreedFx": 0.52,
                "currency": "AED",
                "instructionDate": "09 Dec 2024",
                "settlementDate": "22 Dec 2024", // Saturday
                "units": 1000,
                "pricePerUnit": 680.5
            }
        ]

        const modifiedInstructions = utils.adjustSettelmentDate(instructions);
        expect(modifiedInstructions[0]?.settlementDate).toEqual("23 Dec 2024"); //Monday
    })

    test('should not modify the settlementDate', () => {
        const instructions = [
            {
                "entity" : "ABC",
                "instruction": "B",
                "agreedFx": 0.52,
                "currency": "AED",
                "instructionDate": "11 Dec 2024",
                "settlementDate": "12 Dec 2024", // Thursday
                "units": 1000,
                "pricePerUnit": 680.5
            }
        ]

        const modifiedInstructions = utils.adjustSettelmentDate(instructions);
        expect(modifiedInstructions[0]?.settlementDate).toEqual("12 Dec 2024"); //Monday
    })

    test('should modifiy the settlementDate to next working day ie Sunday for other than AED or SAR', () => {
        const instructions = [
            {
                "entity" : "ABC",
                "instruction": "B",
                "agreedFx": 0.52,
                "currency": "GBP",
                "instructionDate": "05 Dec 2024",
                "settlementDate": "06 Dec 2024", // Friday
                "units": 1000,
                "pricePerUnit": 680.5
            }
        ]

        const modifiedInstructions = utils.adjustSettelmentDate(instructions);
        expect(modifiedInstructions[0]?.settlementDate).toEqual("08 Dec 2024"); //Sunday
    })

    test('should modifiy the settlementDate to next working day ie Sunday for other than AED or SAR', () => {
        const instructions = [
            {
                "entity" : "ABC",
                "instruction": "B",
                "agreedFx": 0.52,
                "currency": "GBP",
                "instructionDate": "05 Dec 2024",
                "settlementDate": "28 Dec 2024", // Saturday
                "units": 1000,
                "pricePerUnit": 680.5
            }
        ]

        const modifiedInstructions = utils.adjustSettelmentDate(instructions);
        expect(modifiedInstructions[0]?.settlementDate).toEqual("29 Dec 2024"); //Sunday
    });
    
})

describe('get Instructions records per day', () => {
    test('should return Object having information of each day instruction records', () => {
    const instructions = [
        {
            "entity" : "ABC",
            "instruction": "B",
            "agreedFx": 0.52,
            "currency": "SAR",
            "instructionDate": "09 Dec 2024",
            "settlementDate": "16 Dec 2024",
            "units": 1000,
            "pricePerUnit": 680.5
        },
        {
            "entity" : "ABC",
            "instruction": "B",
            "agreedFx": 0.52,
            "currency": "SAR",
            "instructionDate": "09 Dec 2024",
            "settlementDate": "16 Dec 2024",
            "units": 1000,
            "pricePerUnit": 680.5
        },
        {
            "entity" : "ABC",
            "instruction": "B",
            "agreedFx": 0.52,
            "currency": "SAR",
            "instructionDate": "19 Dec 2024",
            "settlementDate": "20 Dec 2024",
            "units": 1000,
            "pricePerUnit": 680.5
        }
    ]
    const expectedResult = {
        "16 Dec 2024": [instructions[0], instructions[1]],
        "20 Dec 2024": [instructions[2]]
    }
    expect(utils.getInstructionsPerday(instructions)).toEqual(expectedResult);
    })
})

describe('convert currency to usd', () => {
    test('should convert amount in USD', () => {
        const instructions = [
            {
                "entity" : "ABC",
                "instruction": "B",
                "agreedFx": 1,
                "currency": "SAR",
                "instructionDate": "09 Dec 2024",
                "settlementDate": "16 Dec 2024",
                "units": 100,
                "pricePerUnit": 50
            },
        ]
        
        expect(utils.convertCurrencyToUSD(instructions[0])).toEqual(5000);
    })
})

