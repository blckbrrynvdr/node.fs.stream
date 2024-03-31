#!/usr/bin/env node

const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
    .option('log', {
        alias: "l",
        type: "string",
        description: "путь до файла лога"
    }).argv;

const logPath = argv._[0] || 'log.txt';

const isWonGame = (logString) => {
    return logString.includes('Победа');
};

const isLostGame = (logString) => {
    return logString.includes('Поражение');
};

const getWonPercent = (logString) => { };

const parseLog = (log) => {
    const rows = log.split('\n');

    const result = rows.reduce((acc, row) => {
        if (isWonGame(row)) {
            acc.won += 1;
        }
        if (isLostGame(row)) {
            acc.lost += 1;
        }
        if (row.trim()) {
            acc.count += 1;
        }
        return acc;
    }, {
        count: 0,
        won: 0,
        lost: 0,
    });

    result['wonPercent'] = (result.won / result.count) * 100;

    return result;
}

fs.readFile(logPath, 'utf-8', (error, data) => {
    if (error) {
        console.log('При чтении лога возникла ошибка:', error);
        return;
    }

    const result = parseLog(data);

    if (result?.count <= 0) {
        console.log('Лог пуст');
        return;
    }

    console.log('Анализ игр: \n');
    console.log(`Сыграно партий: ${result.count} \n`);
    console.log(`Выиграно партий: ${result.won} \n`);
    console.log(`Проиграно партий: ${result.lost} \n`);
    console.log(`Процент побед: ${result.wonPercent} \n`);

})