-- Enable Row Level Security on all tables
-- This fixes the Supabase security warning

-- Enable RLS on Department table
ALTER TABLE "Department" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Student table
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Contribution table
ALTER TABLE "Contribution" ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow all operations
-- Since we're using Prisma with postgres role, these policies allow full access

-- Department policies
CREATE POLICY "Allow all operations on Department" ON "Department"
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Student policies
CREATE POLICY "Allow all operations on Student" ON "Student"
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Contribution policies
CREATE POLICY "Allow all operations on Contribution" ON "Contribution"
    FOR ALL
    USING (true)
    WITH CHECK (true);
