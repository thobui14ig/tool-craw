const { parentPort, workerData } = require('worker_threads');
const { getCommentPublic } = require('./facebook-service');
const { delay } = require('./utils');

async function run(groups) {
  for (const link of groups) {
    process(link)
  }
}

const process = async(link) => {
  while (true) {
    if (link.post_id_v1 === "122096306474859230") console.time('a');
    try {
      // Giả sử getCommentPublic được định nghĩa hoặc bạn có thể import nếu dùng ESM
      const comment = await getCommentPublic(link);
      // Gửi kết quả về main thread nếu cần
      
    } catch (error) {
      // Xử lý lỗi hoặc gửi thông báo lỗi về main
    //   parentPort.postMessage({ success: false, error: error.message });
    } finally {
      await delay(link.delay_time * 1000);
    }
    if (link.post_id_v1 === "122096306474859230") console.timeEnd('a');
  }  
}

run(workerData);
