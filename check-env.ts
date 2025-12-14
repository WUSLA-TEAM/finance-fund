
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
if (!url) {
    console.log("No DB URL found (checked POSTGRES_PRISMA_URL and DATABASE_URL)");
} else {
    // Simple masking to show protocol, host, port
    // connection string format: protocol://user:password@host:port/database...
    try {
        const parts = url.split('@');
        if (parts.length > 1) {
            const tail = parts[1];
            // tail is host:port/database?args
            console.log("Database Host/Config:", tail);
        } else {
            console.log("Could not parse structure, generic info:", url.substring(0, 10) + "...");
        }
    } catch (e) {
        console.log("Error parsing URL");
    }
}
