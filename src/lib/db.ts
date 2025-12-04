import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // Build connection URL with proper parameters for Supabase pooler
    const connectionUrl = process.env.POSTGRES_PRISMA_URL
        ? `${process.env.POSTGRES_PRISMA_URL}${process.env.POSTGRES_PRISMA_URL.includes('?') ? '&' : '?'}pgbouncer=true&statement_cache_size=0`
        : process.env.DATABASE_URL;

    return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        datasources: {
            db: {
                url: connectionUrl
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
