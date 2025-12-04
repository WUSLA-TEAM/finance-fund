import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // Prefer non-pooling connection to avoid "prepared statement already exists" errors
    // unless we are sure about the pooling setup.
    const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

    return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        datasources: {
            db: {
                url: url
            }
        }
    });
};

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prismaGlobal = prisma;
}

// Graceful shutdown
if (typeof window === 'undefined') {
    const cleanup = async () => {
        await prisma.$disconnect();
    };

    process.on('beforeExit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
}
