const fs = require('fs');

const fileContent = fs.readFileSync('data.json', 'utf8');

const content = JSON.parse(fileContent);

const codeWords = content.words;
const codeSymbols = content.symbols.split('');

let codedContent = fs.readFileSync('coded.txt', 'utf8');

let tempStr = '';

for (let i = 0; i < codedContent.length; i++) {
    tempStr += codedContent[i];

    if (~codeWords.indexOf(tempStr)) {
        i -= tempStr.length - 1;

        codedContent = codedContent.replace(tempStr, codeSymbols[codeWords.indexOf(tempStr)]);
        
        tempStr = '';
    }
}

fs.writeFileSync('result.txt', codedContent, 'utf8');

console.log(codedContent);