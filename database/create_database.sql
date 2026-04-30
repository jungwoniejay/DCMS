-- Barangay Child Development Data Management System
-- PostgreSQL Database Creation Script

-- Drop database if exists (use with caution in production)
-- DROP DATABASE IF EXISTS brgy2dms;

-- Create database
CREATE DATABASE brgy2dms
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE brgy2dms
    IS 'Barangay Child Development Data Management System Database';

-- Connect to the database
\c brgy2dms

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE brgy2dms TO postgres;

-- Display success message
SELECT 'Database brgy2dms created successfully!' AS status;
