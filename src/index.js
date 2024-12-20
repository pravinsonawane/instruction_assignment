const dataA = require('./data/instructionsA.json');
const dataB = require('./data/instructionsB.json');

const { Reports } = require('./reports/reports');

const {
    displayPerdayRecords,
    displayRank
} = require('./utility/utils');


// Show Report to display the result on console
const showReports = (() => {
    let report = new Reports();
    report.instructions = [dataA, dataB];

    const {
        incomingRecords,
        outgoingRecords,
        rank
    } = report.getReports();
    
    // Diplay reports on console
    displayPerdayRecords(incomingRecords, 'incoming');
    displayPerdayRecords(outgoingRecords, 'outgoing');
    displayRank(rank);
})();


