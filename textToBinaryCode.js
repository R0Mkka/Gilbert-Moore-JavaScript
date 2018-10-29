const fs = require('fs');

const data = fs.readFileSync('data.json', 'utf8');

const content = JSON.parse(data);

const codeWords = content.words;
const codeSymbols = content.symbols.split('');

let text = fs.readFileSync('text.txt', 'utf8');
let finalText = '';

for (let i = 0; i < text.length; i++) {
    finalText += codeWords[codeSymbols.indexOf(text[i])];
}

fs.writeFileSync('coded.txt', finalText, 'utf8');

console.log(finalText);