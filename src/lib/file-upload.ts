import { writeFile } from "fs/promises";
import { join } from "path";

export async function saveFile(file: File, folder: string = "uploads"): Promise<string | null> {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = file.name.split('.').pop() || 'bin';
        const filename = `${uniqueSuffix}.${extension}`;

        // Define path (relative to public)
        const relativePath = `/${folder}/${filename}`;
        const absolutePath = join(process.cwd(), "public", folder, filename);

        await writeFile(absolutePath, buffer);

        return relativePath;
    } catch (error) {
        console.error("Error saving file:", error);
        return null;
    }
}
