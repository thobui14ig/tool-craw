const dbService = require('./db-service');
const { getCommentPublic } = require('./facebook-service');
const { delay } = require('./utils');
const { Worker } = require('worker_threads');
const path = require('path');

async function main() {
  try {
      const links = await dbService.selectLinks()
      const linkGroups = chunkArray(links, 100);
      for (const groups of linkGroups ) {
        run(groups)
      }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
  }
}

const run = async (groups) => {
      const worker = new Worker(path.resolve(__dirname, './worker.js'), {
        workerData: groups,
      });

      worker.on('exit', code => {
        if (code !== 0)
          console.error(`Worker stopped with exit code ${code}`);
      });
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Ví dụ dùng async/await
(async () => {
    await main()
})();