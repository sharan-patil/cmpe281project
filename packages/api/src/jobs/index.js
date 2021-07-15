const Queue = require('bull');
require('dotenv').config();
const redisConf = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
}
const retrieveQueue = new Queue('retrieve', redisConf);
const moveQueue = new Queue('move', redisConf);
const excelQueue = new Queue('excel', redisConf);
const zipQueue = new Queue('zip', redisConf);
const pdfQueue = new Queue('pdf', redisConf);
const emailQueue = new Queue('email', redisConf);
const uploadQueue = new Queue('upload', redisConf);
const retrieveFn = require('./certification/do_retrieve');
const moveFn = require('./certification/move');
const uploadFn = require('./certification/upload');
const excelFn = require('./certification/recordD');
const zipFn = require('./certification/zip');
const pdfFn = require('./certification/pdf');
const emailFn = require('./certification/email');

retrieveQueue.process(retrieveFn(excelQueue, emailQueue));
moveQueue.process(moveFn);
excelQueue.process(excelFn(pdfQueue, emailQueue));
pdfQueue.process(pdfFn(zipQueue, emailQueue));
zipQueue.process(zipFn(uploadQueue));
uploadQueue.process(uploadFn(emailQueue));
emailQueue.process(emailFn);


retrieveQueue.on('error', (e) => console.error(e));
excelQueue.on('error', (e) => console.error(e));
pdfQueue.on('error', (e) => console.error(e));
emailQueue.on('error', (e) => console.error(e));
uploadQueue.on('error', (e) => console.error(e));
zipQueue.on('error', (e) => console.error(e));

retrieveQueue.on('complete', (job) => {
  moveQueue.add(job.data, { removeOnComplete: true });
})

module.exports = {
  zipQueue, emailQueue, excelQueue, pdfQueue,
}