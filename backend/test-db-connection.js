const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('🔌 กำลังเชื่อมต่อ MySQL...');
    
    const connection = await mysql.createConnection({
      host: '158.108.207.232',
      port: 3306,
      user: 'dw_student',
      password: 'dw_student',
    });

    console.log('✅ เชื่อมต่อสำเร็จ!');
    
    // แสดง databases
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('\n📊 Databases ที่มี:');
    databases.forEach(db => {
      console.log(`  - ${db.Database}`);
    });

    await connection.end();
    console.log('\n🎉 ทดสอบสำเร็จ!');
    
  } catch (error) {
    console.error('❌ เชื่อมต่อไม่สำเร็จ:', error.message);
    process.exit(1);
  }
}

testConnection();

