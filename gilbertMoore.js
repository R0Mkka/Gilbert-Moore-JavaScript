const fs = require('fs');

let text = fs.readFileSync('text.txt', 'utf8');

let symbols = '';

for (let i = 0; i < text.length; i++) {
    if (isNew(text[i])) {
        symbols += text[i];
    }
}

const gm = gilbertMoore(text, symbols);

showTable(gm);
saveToJson(gm);

const entropy = entropyCount(gm.p);
const averageLength = avaerageLengthCount(gm);

console.log('\nAverage Length ' + averageLength);
console.log('Entropy ' + entropy);

function isNew(symbolForCheck) {
    return !~symbols.indexOf(symbolForCheck);
}

function gilbertMoore(text, symbols) {
    let pr = 0,
        Q = [],
        codeWordsLengths = [],
        elementaryCodesMatrix = [],
        words = [];

    let probabilities = [];

    for (let i = 0; i < symbols.length; i++) {
        probabilities[i] = getSymbolCount(text, symbols[i]) / text.length;
    }

    for (let i = 0; i < probabilities.length; i++) {
        Q[i] = pr + probabilities[i] / 2;
        pr += probabilities[i];
        codeWordsLengths[i] = ((-1) * getBaseLog(2, probabilities[i])) + 1;
    }

    let newQ = [];
    newQ = Q.slice();

    for (let i = 0; i < symbols.length; i++) {
        let tempRow = [];

        for (let j = 0; j < codeWordsLengths[i]; j++) {
            newQ[i] *= 2;
            tempRow[j] = newQ[i];

            if (newQ[i] > 1) {
                newQ[i] -= 1;
            }
        }

        elementaryCodesMatrix.push(tempRow);
    }

    for (let i = 0; i < Q.length; i++) {
        words[i] = +Q[i].toString(2);
        words[i] = words[i].toFixed(Math.ceil(codeWordsLengths[i]));
        words[i] = words[i].slice(2, words[i].length);
    }

    return {
        Q,
        l: codeWordsLengths,
        c: elementaryCodesMatrix,
        pr,
        p: probabilities,
        words,
        symbols
    }
}

function getSymbolCount(text, symbol) {
    let counter = 0;

    for (let i = 0; i < text.length; i++) {
        if (text[i] == symbol) counter++;
    }

    return counter;
}

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function avaerageLengthCount(gm) {
    const words = gm.words;
    const probabilities = gm.p;

    let result = 0;

    for (let i = 0; i < words.length; i++) {
        result += words[i].length * probabilities[i];
    }

    return result;
}

function entropyCount(probabilities) {
    let H = 0;

    for (let i = 0; i < probabilities.length; i++) {
        H -= probabilities[i] * getBaseLog(2, probabilities[i]);
    }

    return H;
}

function showTable({Q, l, c, pr, p, words, symbols}) {
    const split = symbols.split('');

    console.log('-----------------------------------------');
    console.log(`Sym  |Prob     |Q        |L    |Code word`);
    console.log('-----------------------------------------');

    for (let i = 0; i < words.length; i++) {
        switch(split[i]) {
            case '\n': split[i] = '\\n'; break;
            case '\r': split[i] = '\\r'; break;
            case '\t': split[i] = '\\t'; break;
            case ' ': split[i] = '\\s'; break;
        }

        if (split[i].length == 1) space = '    ';
        else space = '   ';

        if (Math.ceil(l[i]).toString().length == 1) lSpace = '    ';
        else lSpace = '   ';

        console.log(`${split[i]}${space}|${p[i].toFixed(3)}    |${Q[i].toFixed(3)}    |${Math.ceil(l[i])}${lSpace}|${words[i]}`);
    }
}

function saveToJson(gm) {
    const jsonData = JSON.stringify(gm);

    fs.writeFileSync('./data.json', jsonData, 'utf-8');
}