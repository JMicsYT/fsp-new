-- Create portfolio items table
CREATE TABLE IF NOT EXISTS "PortfolioItem" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  link TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Add position and bio fields to User table if they don't exist
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS bio TEXT;
