-- Cloudflare D1 SQLite Database Schema for AI-DISPO Admin, Blogs & Careers

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT DEFAULT 'AI-DISPO Admin',
    role TEXT DEFAULT 'Administrator',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Admin
INSERT OR IGNORE INTO admins (id, email, password, name, role)
VALUES (1, 'aidispo@admin.com', 'aiadmin', 'AI-DISPO Admin', 'Administrator');

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    slug TEXT UNIQUE NOT NULL,
    badge_tag TEXT DEFAULT 'IV CANNULA',
    content TEXT NOT NULL,
    tags TEXT,
    image_url TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    author TEXT DEFAULT 'AI-DISPO Clinical Team',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT DEFAULT 'Facility HQ, India',
    job_type TEXT DEFAULT 'Full-Time',
    experience TEXT DEFAULT '2-5 Years',
    salary TEXT,
    description TEXT NOT NULL,
    requirements TEXT,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Applicants Table
CREATE TABLE IF NOT EXISTS applicants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER,
    job_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'Pending',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Queries / Contact Us Inquiries Table
CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    organization TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    product TEXT DEFAULT 'Syringe',
    volume TEXT DEFAULT 'Clinical Sample Batch Evaluation',
    sku TEXT,
    message TEXT,
    status TEXT DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applicants_job_id ON applicants(job_id);
CREATE INDEX IF NOT EXISTS idx_queries_status ON queries(status);
CREATE INDEX IF NOT EXISTS idx_queries_created_at ON queries(created_at DESC);

