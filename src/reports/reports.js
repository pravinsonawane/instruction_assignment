const {
    filterByInstruction,
    sortInstructionsBySettlementDate,
    adjustSettelmentDate,
    getInstructionsPerday,
    calculateAmountForEachDay,
} = require('../utility/utils');
/**  
 *  Generates report after manipulation on all instructions
 */

class Reports {
    constructor()
    {
        this.instructions = [];
    } 
    
    /**  
     *  Generates report after manipulation on all instrauctions
     */
    getReports()
    {
        const SELL = 'S'; // Sell - Incoming
        const BUY = 'B'; // Buy - Outgoing

        let allInstructions = [];
        /**
         * Combine all instrctions provided by different companies
         */
        this.instructions.map(data=> {
            allInstructions = [
                ...allInstructions,
                ...data.instructions
            ]
        })
        // filtering the instructions as per instruction type Sell or Buy
        let incomingData = filterByInstruction(allInstructions, SELL); 
        let outgoingData = filterByInstruction(allInstructions, BUY); 
    
        // Modifing the settlement date if it comes on weekend
        incomingData = adjustSettelmentDate(incomingData);
        outgoingData = adjustSettelmentDate(outgoingData);
    
        // Group instructions by each day
        const incomingRecords = getInstructionsPerday(sortInstructionsBySettlementDate(incomingData));
        const outgoingRecords = getInstructionsPerday(sortInstructionsBySettlementDate(outgoingData));
    
        // to store the incoming and outgoing highest rank data
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
    
        calculateAmountForEachDay(incomingRecords, rank.incoming);
        calculateAmountForEachDay(outgoingRecords, rank.outgoing);
    
        return {
            incomingRecords,
            outgoingRecords,
            rank
        }
 
    }
}

module.exports = {
    Reports
}