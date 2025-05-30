"""
CSV Data Import Script for TerraGuide Survey Data
This script imports the survey CSV data into Supabase
"""

import pandas as pd
import numpy as np
from supabase import create_client, Client
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://wxvnjjxbvbevwmvqyack.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY",
                         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dm5qanhidmJldndtdnF5YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDYyMDAsImV4cCI6MjA2MTc4MjIwMH0.-Lstafz3cOl5KHuCpKgG-Xt9zRi12aJDqZr0mdHMzXc")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def clean_csv_data(df):
    """Clean and prepare CSV data for database insertion"""

    logger.info(f"📊 Original data shape: {df.shape}")

    # Create a copy to avoid modifying original
    clean_df = df.copy()

    # Convert column names to lowercase to match database schema
    column_mapping = {
        'Guide_ID': 'guide_id',
        'Q1': 'q1', 'Q2': 'q2', 'Q3': 'q3', 'Q4': 'q4', 'Q5': 'q5',
        'Q6': 'q6', 'Q7': 'q7', 'Q8': 'q8', 'Q9': 'q9', 'Q10': 'q10',
        'Q11': 'q11', 'Q12': 'q12', 'Q13': 'q13', 'Q14': 'q14', 'Q15': 'q15',
        'Q16': 'q16', 'Q17': 'q17', 'Q18': 'q18', 'Q19': 'q19', 'Q20': 'q20',
        'Q21': 'q21', 'Q22': 'q22', 'Q23': 'q23', 'Q24': 'q24', 'Q25': 'q25', 'Q26': 'q26',
        'Basic_Skills_Avg': 'basic_skills_avg',
        'Nature_Knowledge_Avg': 'nature_knowledge_avg',
        'Interpretation_Avg': 'interpretation_avg',
        'Leadership_Safety_Avg': 'leadership_safety_avg',
        'Cultural_Expertise_Avg': 'cultural_expertise_avg',
        'Overall_Average': 'overall_average',
        'Recommended_Course': 'recommended_course'
    }

    # Rename columns
    clean_df = clean_df.rename(columns=column_mapping)

    # Handle missing values
    # For survey questions (Q1-Q26), fill with neutral value (3)
    question_cols = [f'q{i}' for i in range(1, 27)]
    for col in question_cols:
        if col in clean_df.columns:
            clean_df[col] = clean_df[col].fillna(3).astype(int)

    # For averages, recalculate if missing or use median
    avg_cols = ['basic_skills_avg', 'nature_knowledge_avg', 'interpretation_avg',
                'leadership_safety_avg', 'cultural_expertise_avg', 'overall_average']

    for col in avg_cols:
        if col in clean_df.columns:
            clean_df[col] = clean_df[col].fillna(clean_df[col].median()).round(2)

    # Clean recommended course names
    if 'recommended_course' in clean_df.columns:
        clean_df['recommended_course'] = clean_df['recommended_course'].fillna('Introduction to Park Guiding')
        clean_df['recommended_course'] = clean_df['recommended_course'].str.strip()

    # Remove any completely empty rows
    clean_df = clean_df.dropna(subset=['guide_id'])

    # Ensure guide_id is string and properly formatted
    clean_df['guide_id'] = clean_df['guide_id'].astype(str)

    logger.info(f"✅ Cleaned data shape: {clean_df.shape}")
    logger.info(f"📋 Unique courses: {clean_df['recommended_course'].nunique()}")
    logger.info(f"🎯 Course distribution:\n{clean_df['recommended_course'].value_counts()}")

    return clean_df


def batch_insert_data(df, batch_size=100):
    """Insert data in batches to avoid API limits"""

    total_rows = len(df)
    successful_inserts = 0
    failed_inserts = 0

    logger.info(f"🚀 Starting batch insert of {total_rows} records...")

    for i in range(0, total_rows, batch_size):
        batch_df = df.iloc[i:i + batch_size]
        batch_data = batch_df.to_dict('records')

        try:
            # Convert numpy types to Python native types
            for record in batch_data:
                for key, value in record.items():
                    if isinstance(value, (np.integer, np.int64)):
                        record[key] = int(value)
                    elif isinstance(value, (np.floating, np.float64)):
                        record[key] = float(value)
                    elif pd.isna(value):
                        record[key] = None

            # Insert batch
            result = supabase.table('guide_survey_data').insert(batch_data).execute()

            batch_success = len(result.data) if result.data else 0
            successful_inserts += batch_success

            logger.info(f"✅ Batch {i // batch_size + 1}: Inserted {batch_success}/{len(batch_data)} records")

        except Exception as e:
            logger.error(f"❌ Batch {i // batch_size + 1} failed: {e}")
            failed_inserts += len(batch_data)

            # Try individual inserts for failed batch
            logger.info("🔄 Attempting individual inserts for failed batch...")
            for record in batch_data:
                try:
                    result = supabase.table('guide_survey_data').insert(record).execute()
                    if result.data:
                        successful_inserts += 1
                        failed_inserts -= 1
                except Exception as individual_error:
                    logger.warning(f"❌ Failed to insert guide {record.get('guide_id', 'unknown')}: {individual_error}")

    logger.info(f"📊 Import Summary:")
    logger.info(f"  ✅ Successful inserts: {successful_inserts}")
    logger.info(f"  ❌ Failed inserts: {failed_inserts}")
    logger.info(f"  📈 Success rate: {(successful_inserts / total_rows) * 100:.1f}%")

    return successful_inserts, failed_inserts


def verify_import():
    """Verify the imported data"""

    logger.info("🔍 Verifying imported data...")

    try:
        # Get total count
        result = supabase.table('guide_survey_data').select('guide_id').execute()
        total_count = len(result.data) if result.data else 0

        # Get course distribution
        result = supabase.table('guide_survey_data').select('recommended_course').execute()
        if result.data:
            courses = [record['recommended_course'] for record in result.data]
            course_counts = pd.Series(courses).value_counts()

            logger.info(f"✅ Total records in database: {total_count}")
            logger.info(f"📚 Course distribution:")
            for course, count in course_counts.head(10).items():
                logger.info(f"  • {course}: {count} students")

        # Test sample queries
        sample_result = supabase.table('guide_survey_data').select('*').limit(3).execute()
        if sample_result.data:
            logger.info(f"📝 Sample records imported successfully")

        return True

    except Exception as e:
        logger.error(f"❌ Verification failed: {e}")
        return False


def main():
    """Main import function"""

    # Check if CSV file exists
    csv_file = 'src/course-recommender/data/semenggoh_guide_survey_data_20250524_233725.csv'

    if not os.path.exists(csv_file):
        # Try alternative paths
        alternative_paths = [
            'src/course-recommender/data/semenggoh_guide_survey_data_20250524_233725.csv'
        ]

        csv_file = None
        for path in alternative_paths:
            if os.path.exists(path):
                csv_file = path
                break

        if not csv_file:
            logger.error("❌ CSV file not found! Please ensure the survey data file is available.")
            logger.info("Expected locations:")
            for path in ['src/course-recommender/data/semenggoh_guide_survey_data_20250524_233725.csv'] + alternative_paths:
                logger.info(f"  • {os.path.abspath(path)}")
            return False

    logger.info(f"📂 Loading CSV file: {csv_file}")

    try:
        # Load CSV data
        df = pd.read_csv(csv_file)
        logger.info(f"✅ Loaded CSV with {len(df)} rows and {len(df.columns)} columns")

        # Clean data
        clean_df = clean_csv_data(df)

        # Check if table exists and is empty
        try:
            existing_data = supabase.table('guide_survey_data').select('guide_id').limit(1).execute()
            if existing_data.data:
                response = input("⚠️  Data already exists in database. Do you want to clear it first? (y/N): ")
                if response.lower() == 'y':
                    logger.info("🗑️  Clearing existing data...")
                    supabase.table('guide_survey_data').delete().neq('guide_id', '').execute()
                    logger.info("✅ Existing data cleared")
                else:
                    logger.info("ℹ️  Keeping existing data. New records will be added if they don't conflict.")
        except Exception as e:
            logger.info("ℹ️  Table is empty or doesn't exist yet")

        # Import data
        successful, failed = batch_insert_data(clean_df)

        if successful > 0:
            # Verify import
            verify_import()
            logger.info("🎉 Data import completed successfully!")
            return True
        else:
            logger.error("❌ No data was imported successfully")
            return False

    except Exception as e:
        logger.error(f"❌ Import failed: {e}")
        return False


if __name__ == "__main__":
    print("🚀 TerraGuide Survey Data Import Tool")
    print("=" * 50)

    success = main()

    if success:
        print("\n✅ Import completed! Your database is ready for recommendations.")
        print("📱 You can now test the API with: python main.py")
    else:
        print("\n❌ Import failed. Please check the logs and try again.")
        print("💡 Make sure:")
        print("  1. The CSV file exists in the correct location")
        print("  2. Your Supabase credentials are correct")
        print("  3. The guide_survey_data table has been created in Supabase")