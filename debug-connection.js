
const fs = require('fs');
const path = require('path');

async function debug() {
    console.log("--- DEBUGGING CONNECTION ---");

    // 1. Check for .env file
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        console.log("Found .env file");
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach(line => {
            if (line.startsWith('DATABASE_URL') || line.startsWith('POSTGRES_PRISMA_URL')) {
                // Mask password
                const masked = line.replace(/:([^:@]+)@/, ':****@');
                console.log("ENV VAR:", masked);
            }
        });
    } else {
        console.log("No .env file found");
    }

    // 2. Check for SQLite files (just in case)
    const dbPath = path.join(__dirname, 'prisma', 'dev.db');
    if (fs.existsSync(dbPath)) {
        console.log("Found SQLite DB file at prisma/dev.db");
    } else {
        console.log("No SQLite DB file found at prisma/dev.db");
    }

    // 3. Check what Prisma Client thinks (by instantiating it)
    try {
        // We can't easily import TS, looking for generated client
        console.log("Check complete. Please analyze ENV VAR output.");
    } catch (e) {
        console.error("Error", e);
    }
}

debug();
