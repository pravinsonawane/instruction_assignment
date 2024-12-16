const moment = require('moment');

const filterByInstruction = (instructions, filterBy) => 
    instructions?.filter(ins => ins.instruction === filterBy)


/**
 * 
 * @param {array of innstruction} instructions 
 * If instructed settelement date is on weekend, then change it to next working day
 * FOR AED or SAR currency - Working days are Monday to Friday
 * And for other currencies - Working days are Sunday to Thursday
 * @returns {array of instruction with modified settelement date }
 */
const adjustSettelmentDate = (instructions) => {
    const CURRENCY = ['AED','SAR'];
    const modifiedSettementDateInstructions = instructions.map(data => {
        const newSettlementDate = new Date(data?.settlementDate);
        if(CURRENCY.includes(data?.currency) ) {
            // If Sunday then change to Monday by adding 1 day
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
 * 
 * @param {array of instrction} instructions
 * gather instruction records for each day 
 * @returns
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

const convertCurrencyToUSD = ({units, agreedFx, pricePerUnit}) =>{
    return (units*agreedFx*pricePerUnit);
}

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
    sortInstructionsBySettlementDate,
    displayPerdayRecords,
    displayRank
}