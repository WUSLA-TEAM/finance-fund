const fs = require('fs');
const content = `POSTGRES_URL="postgres://postgres.kkmlbbmgtipwyqxiijnj:pnfMjsl6A9Qy2f6E@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_URL_NON_POOLING="postgres://postgres:pnfMjsl6A9Qy2f6E@db.kkmlbbmgtipwyqxiijnj.supabase.co:5432/postgres"`;
fs.writeFileSync('.env', content, 'utf8');
console.log('.env file created successfully with correct encoding.');
