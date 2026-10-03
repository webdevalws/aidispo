// Auto-initialize SQLite database tables and default admin in Cloudflare D1
export async function onRequest(context) {
  const { env } = context;

  if (!env.DB) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: "D1 Database binding 'DB' not configured in Cloudflare environment" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 1. Admins table
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT DEFAULT 'AI-DISPO Admin',
        role TEXT DEFAULT 'Administrator',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 2. Blogs table
    await env.DB.prepare(`
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
      )
    `).run();

    // 3. Jobs table
    await env.DB.prepare(`
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
      )
    `).run();

    // 4. Applicants table
    await env.DB.prepare(`
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
      )
    `).run();

    // 5. Queries table (Contact Us & OEM Project Procurement Inquiries)
    await env.DB.prepare(`
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
        query_type TEXT DEFAULT 'Contact Us',
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 6. Ensure Default Admin exists
    await env.DB.prepare(`
      INSERT OR IGNORE INTO admins (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `).bind('aidispo@admin.com', 'aiadmin', 'AI-DISPO Admin', 'Administrator').run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Database initialized with blogs, jobs, applicants, queries and admin credentials" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
