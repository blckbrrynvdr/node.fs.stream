#!/usr/bin/env node

const fs = require('fs');
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
    .option('log', {
        alias: "l",
        type: "string",
        description: "путь до файла лога"
    }).argv;

const logPath = argv._[0] || 'log.txt';

const randomInteger = (min, max) => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

const hiddenNumber = randomInteger(1, 2);

const head = 1;
const tail = 2;

const getNumberName = (number) => {
    if (number === head) {
        return 'орёл';
    }
    if (number === tail) {
        return 'решка';
    }
}

const writeToFile = (path, data) => {
    const writeStream = fs.createWriteStream(path);

    writeStream.write(data, 'UTF8');
    writeStream.end();
}



const writeLog = (content) => {
    let contentBuffer = '';
    const readStream = fs.createReadStream(logPath);
    readStream
    .setEncoding('UTF8')
    .on('error', (err) => {
        if (err.code === 'ENOENT') {
            writeToFile(logPath, content);
        }
        readStream.close();
    })
    .on('data', (chank) =>{
        contentBuffer += chank
    })
    .on('end', () => {
        contentBuffer += content;
        writeToFile(logPath, contentBuffer);
    })

}

const checkNumber = (number) => {
    number = Number(number);
    let status;
    if (number !== hiddenNumber) {
        console.log('К сожалению это неправильный ответ.');
        status = 'Поражение';
        rl.close();
    }
    if (number === hiddenNumber) {
        console.log(`Верно, это ${getNumberName(number)}!`);
        status = 'Победа';
        rl.close();
    }

    const logText = `Загадано число ${hiddenNumber}(${getNumberName(hiddenNumber)}).` +
    `Пользователь ввёл ${number}(${getNumberName(number)}). Статус игры: ${status}.\n`;
    writeLog(logText);
}

rl.question(`Добро пожаловать в игру "Орёл или Решка"!\n
Было загадано целое число от 1 до 2, где ${head} - ${getNumberName(head)}, а ${tail} - ${getNumberName(tail)}.\n
Введите 1 или 2 чтоб угадать, загадан орёл или решка.\n`, (answer) => {
    checkNumber(answer);
})

rl.on('line', (input) => checkNumber(input));