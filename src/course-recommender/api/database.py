from supabase import create_client, Client
import os
import json

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://wxvnjjxbvbevwmvqyack.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

DATABASE_SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    email TEXT,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_id TEXT UNIQUE NOT NULL,
    course_name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    difficulty_level TEXT,
    duration_hours INTEGER,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    interaction_type TEXT NOT NULL, -- 'enrolled', 'completed', 'liked', 'viewed'
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    UNIQUE(user_id, course_id, interaction_type)
);

CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    score FLOAT NOT NULL,
    mf_score FLOAT,
    knn_score FLOAT,
    model_version TEXT DEFAULT 'v1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    UNIQUE(user_id, course_id, model_version)
);

CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_course_id ON user_interactions(course_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_expires_at ON recommendations(expires_at);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = user_id);
"""

SAMPLE_COURSES = [
    {
        "course_id": "Nature Guide Fundamentals",
        "course_name": "Nature Guide Fundamentals",
        "description": "Learn the basics of nature guiding and wildlife identification",
        "category": "Fundamentals",
        "difficulty_level": "Beginner",
        "duration_hours": 40
    },
    {
        "course_id": "Advanced Park Guiding: Leadership and Safety",
        "course_name": "Advanced Park Guiding: Leadership and Safety",
        "description": "Advanced techniques for leading groups and ensuring safety",
        "category": "Leadership",
        "difficulty_level": "Advanced",
        "duration_hours": 60
    },
    {
        "course_id": "Master Park Guide Certification Program",
        "course_name": "Master Park Guide Certification Program",
        "description": "Comprehensive certification program for master guides",
        "category": "Certification",
        "difficulty_level": "Expert",
        "duration_hours": 120
    },
    {
        "course_id": "Explore & Lead: Park Guide Mentorship Journey",
        "course_name": "Explore & Lead: Park Guide Mentorship Journey",
        "description": "Mentorship program for aspiring guide leaders",
        "category": "Mentorship",
        "difficulty_level": "Intermediate",
        "duration_hours": 80
    },
    {
        "course_id": "Eco-Guide Training: Field & Interpretation Skills",
        "course_name": "Eco-Guide Training: Field & Interpretation Skills",
        "description": "Specialized training in ecological interpretation",
        "category": "Specialization",
        "difficulty_level": "Intermediate",
        "duration_hours": 50
    },
    {
        "course_id": "Introduction to Park Guiding",
        "course_name": "Introduction to Park Guiding",
        "description": "Basic introduction to park guiding concepts",
        "category": "Introduction",
        "difficulty_level": "Beginner",
        "duration_hours": 20
    },
    {
        "course_id": "Park Guide in Training: Learn from the Pros",
        "course_name": "Park Guide in Training: Learn from the Pros",
        "description": "Hands-on training with experienced guides",
        "category": "Training",
        "difficulty_level": "Intermediate",
        "duration_hours": 100
    }
]

def setup_database():
    """Set up the database with sample data"""

    print("🚀 Setting up Supabase database...")

    try:
        print("📚 Inserting sample courses...")

        for course in SAMPLE_COURSES:
            result = supabase.table('courses').upsert(course).execute()
            print(f"✅ Inserted course: {course['course_name']}")

        print(f"\n✅ Database setup complete!")
        print(f"📊 Inserted {len(SAMPLE_COURSES)} courses")

        courses_count = supabase.table('courses').select('count').execute()
        print(f"📈 Total courses in database: {len(courses_count.data)}")

        return True

    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False

def test_database_connection():
    """Test the database connection"""

    print("🧪 Testing database connection...")

    try:
        result = supabase.table('courses').select('course_id, course_name').limit(3).execute()

        if result.data:
            print("✅ Database connection successful!")
            print("📋 Sample courses:")
            for course in result.data:
                print(f"  - {course['course_name']}")
            return True
        else:
            print("⚠️ No courses found in database")
            return False

    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    if test_database_connection():
        print("Database already set up!")
    else:
        setup_database()

print("""
📋 MANUAL SETUP REQUIRED:

1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to SQL Editor
3. Run the following SQL schema:

""")
print(DATABASE_SCHEMA)
print("""
4. Update your .env file with:
   SUPABASE_URL=your-project-url  
   SUPABASE_KEY=your-anon-key

5. Run this script: python database.py
""")