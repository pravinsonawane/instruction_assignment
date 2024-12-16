const dataA = require('./data/instructionsA.json');
const dataB = require('./data/instructionsB.json');
const {
    filterByInstruction,
    sortInstructionsBySettlementDate,
    adjustSettelmentDate,
    getInstructionsPerday,
    convertCurrencyToUSD,
    displayPerdayRecords,
    displayRank
} = require('./utils'); 

const SELL = 'S'; // Sell - Incoming
const BUY = 'B'; // Buy - Outgoing
const rank = {
    'incoming': {
        name :'',
        total : 0
    },
    'outgoing': {
        name :'',
        total : 0
    }
};



/**
 * Calculate amount for each day and find the highest amount as per type 
 * @param {Object of instruction with formatted} records 
 * @param {string - incoming / outgoing} type 
 */
const calculateAmountForEachDay = (records, type) => {
    for(const key in records) {
        const calculateTotal = records[key].reduce((acc, com) => {
            const usdCalculator = convertCurrencyToUSD(com);
            if(rank[type].total < usdCalculator){
                rank[type].total = usdCalculator;
                rank[type].name = com.entity;
            }
            return acc+ usdCalculator;
        }, 0)
        
        records[key]['calculateTotal'] = calculateTotal;
    }
}

const getReports = ((dataArr) => {
    /**
     * Combine all instrctions provided by different companies
     */
    let allInstructions = []
    dataArr.map(data=> {
        allInstructions = [
            ...allInstructions,
            ...data.instructions
        ]
    })

    let incomingData = filterByInstruction(allInstructions, SELL); 
    let outgoingData = filterByInstruction(allInstructions, BUY); 

    incomingData = adjustSettelmentDate(incomingData);
    outgoingData = adjustSettelmentDate(outgoingData);

    const incomingRecords = getInstructionsPerday(sortInstructionsBySettlementDate(incomingData));
    const outgoingRecords = getInstructionsPerday(sortInstructionsBySettlementDate(outgoingData));

    calculateAmountForEachDay(incomingRecords, 'incoming');
    calculateAmountForEachDay(outgoingRecords, 'outgoing');

    // Show Report
    displayPerdayRecords(incomingRecords, 'incoming');
    displayPerdayRecords(outgoingRecords, 'outgoing');
    displayRank(rank);

})([dataA, dataB])


