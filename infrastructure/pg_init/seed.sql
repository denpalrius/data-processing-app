\echo '\n--- Database Initialization ---';

-- Attempt to create the database if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'file_processor') THEN
        CREATE DATABASE file_processor;
    END IF;
END
$$;

-- Connect to the database
\c file_processor;

-- Create the file_metadata table if it doesn't exist
CREATE TABLE IF NOT EXISTS file_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    bucket_name VARCHAR(255) NOT NULL,
    object_name VARCHAR(255) NOT NULL,
    bucket_url VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check if the table is empty before seeding
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM file_metadata LIMIT 1) THEN
--         INSERT INTO file_metadata (filename, size, content_type, bucket_name, object_name, bucket_url, status) VALUES
--             ('file1.txt', 1024, 'text/plain', 'bucket1', 'object1', 'http://localhost:9000/bucket1/object1', 'UPLOADED'),
--             ('file2.pdf', 5120, 'application/pdf', 'bucket2', 'object2', 'http://localhost:9000/bucket2/object2', 'UPLOADED');
--     END IF;
-- END
-- $$;

-- Verify the initialization
\echo '\n--- Database Status ---';
\echo '\nTable Structure:';
\d file_metadata;

\echo '\nSeeded Data:';
SELECT * FROM file_metadata ORDER BY id;

\echo '\nRecord Count:';
SELECT COUNT(*) as total_records FROM file_metadata;