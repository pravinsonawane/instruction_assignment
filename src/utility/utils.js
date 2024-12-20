// moment is a JS library to parse, manipuate, validate and display dates and times in Javascript
const moment = require('moment');

// filter instructions by type of instruction 'Sell' or 'Buy'
const filterByInstruction = (instructions, filterBy) => 
    instructions?.filter(ins => ins.instruction === filterBy)


/**
 * If instructed settelement date is on weekend, then change it to next working day
 * FOR AED or SAR currency - Working days are Monday to Friday
 * And for other currencies - Working days are Sunday to Thursday
 */
const adjustSettelmentDate = (instructions) => {
    const CURRENCY = ['AED','SAR'];
    const modifiedSettementDateInstructions = instructions.map(data => {
        const newSettlementDate = new Date(data?.settlementDate);
        if(CURRENCY.includes(data?.currency) ) {
            // If Sunday then change to Monday by adding 1 day
            // 0 - is for Sunday
            if(newSettlementDate.getDay() === 0){
                newSettlementDate.setDate(newSettlementDate.getDate() + 1);
                data.settlementDate = moment(newSettlementDate).format('DD MMM YYYY');
            } else if(newSettlementDate.getDay() === 6) { // If Saturday then change to Monday by adding 2 days
                newSettlementDate.setDate(newSettlementDate.getDate() + 2);
                data.settlementDate = moment(newSettlementDate).format('DD MMM YYYY');
            }
        } else {
            // If Saturday then change to Sunday by adding 1 day
            if(newSettlementDate.getDay() === 6){
                newSettlementDate.setDate(newSettlementDate.getDate() + 1);
                data.settlementDate = moment(newSettlementDate).format('DD MMM YYYY');
            } else if(newSettlementDate.getDay() === 5) { // If Friday then change to Sunday by adding 2 days
                newSettlementDate.setDate(newSettlementDate.getDate() + 2);
                data.settlementDate = moment(newSettlementDate).format('DD MMM YYYY');
            }
        }
        return data;
    })

    return modifiedSettementDateInstructions;
}

/**
 * Calculate amount for each day and find the highest amount as per type 
 * @param {Object of instruction with formatted} records 
 * @param {string - incoming / outgoing} type 
 */
const calculateAmountForEachDay = (records, instructionRank) => {
    for(const key in records) {
        const calculateTotal = records[key].reduce((acc, com) => {
            const usdCalculator = convertCurrencyToUSD(com);
            if(instructionRank.total < usdCalculator){
                instructionRank.total = usdCalculator;
                instructionRank.name = com.entity;
            }
            return acc+ usdCalculator;
        }, 0)
        
        records[key]['calculateTotal'] = calculateTotal;
    }
}

/**
 * This will return an object with each settlement date and it's corresponding transactions for the date
 */
const getInstructionsPerday = (instructions) => {
    const instructionEachDay = {};
    instructions?.map(data => {
        if(!Object.hasOwn(instructionEachDay, data.settlementDate)){
            instructionEachDay[data.settlementDate] =[];
        }
        instructionEachDay[data.settlementDate].push(data);
    });
    
    return instructionEachDay;
}

/**
 * Calculate as per the units, agrredFX and pricePerUnit values
 */
const convertCurrencyToUSD = ({units, agreedFx, pricePerUnit}) =>{
    return (units*agreedFx*pricePerUnit);
}

/**
 * Sorting instructions as per the settlementDate date
 */
const sortInstructionsBySettlementDate = (instructions) => {
    instructions.sort((a,b)=>{
        return new Date(a.settlementDate) - new Date(b.settlementDate);
    });
    return instructions;
}

const displayPerdayRecords = (records, type) => {
    console.log(`\nAmount in USD settled ${type} everyday`);
    console.log('----------------------------------------')
    for(let key in records) {
        const total = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                records[key]?.calculateTotal,
            );
        console.log(key, '---', total);
    }
}

const displayRank = (rank) => {
    console.log("\n\nRanking of entities based on incoming and outgoing amount.");
    console.log('----------------------------------------')
    console.log('Incoming Rank 1 =>', rank?.incoming.name);
    console.log('Outgoing Rank 1 =>', rank?.outgoing.name);
}

module.exports = {
    filterByInstruction,
    adjustSettelmentDate,
    getInstructionsPerday,
    convertCurrencyToUSD,
    calculateAmountForEachDay,
    sortInstructionsBySettlementDate,
    displayPerdayRecords,
    displayRank
}