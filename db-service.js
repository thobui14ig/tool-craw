const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '91.99.31.157',      // Địa chỉ host MySQL
  user: 'root',           // Username MySQL
  password: 'HoangChuong@1111', // Mật khẩu
  database: 'crawl-fb',  // Database cần kết nối
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function selectUsers() {
    const [rows, _] = await pool.execute('SELECT * FROM users');
    return rows;
}

async function selectLinks() {
    const [rows, _] = await pool.execute(`
    SELECT 
        l.*,
        JSON_OBJECT(
            'id', u.id
        ) AS user
        FROM links l
        JOIN users u ON l.user_id = u.id
        WHERE l.status IN ('started', 'pending')
        AND l.type != 'die'
        AND l.delay_time != 0
        AND l.type = 'public'
        AND post_id_v1 is not null
        AND l.hide_cmt = FALSE
 
    `);
    return rows;
}


module.exports = {
    selectUsers,
    selectLinks
}