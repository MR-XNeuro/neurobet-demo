// aiCore.js - Core Prediction Logic for Mr. X AI

function prepareInputData(history) {
    var sequenceLength = 20;
    var numericalHistory = history.map(function(result) { return result === 'win' ? 1 : 0; });
    if (numericalHistory.length < sequenceLength) {
        var padding = new Array(sequenceLength - numericalHistory.length).fill(0);
        numericalHistory = padding.concat(numericalHistory);
    } else if (numericalHistory.length > sequenceLength) {
        numericalHistory = numericalHistory.slice(numericalHistory.length - sequenceLength);
    }
    return [numericalHistory];
}

function processPrediction(prediction) {
    var threshold = 0.5;
    return prediction > threshold ? 'hi' : 'lo';
}