
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function diagnose() {
    console.log("--- DB DIAGNOSIS START ---");

    // 1. VS Check Env URL Params
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const lines = content.split('\n');
            const urlLine = lines.find(l => l.startsWith('POSTGRES_PRISMA_URL='));
            if (urlLine) {
                const parts = urlLine.split('@');
                if (parts.length > 1) {
                    const tail = parts[1];
                    console.log("URL Config (Safe):", tail.trim());
                    if (tail.includes('6543') && !tail.includes('pgbouncer=true')) {
                        console.log("WARNING: Port 6543 detected but 'pgbouncer=true' might be missing.");
                    }
                }
            } else {
                console.log("POSTGRES_PRISMA_URL not found in .env");
            }
        }
    } catch (e) {
        console.error("Env check failed:", e.message);
    }

    // 2. Try Connection
    console.log("Attempting Prisma Query...");
    const prisma = new PrismaClient();
    try {
        const count = await prisma.student.count();
        console.log("SUCCESS: Connection working! Student count:", count);
    } catch (e) {
        console.error("CONNECTION ERROR:", e.message);
        console.error("Code:", e.code);
    } finally {
        await prisma.$disconnect();
    }
    console.log("--- DB DIAGNOSIS END ---");
}

diagnose();
