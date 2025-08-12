# Church Attendance Management App

A comprehensive church management system built with Next.js, TypeScript, and Supabase. This application helps churches manage member attendance, donations, events, and generate reports.

## Features

### 📊 **Dashboard & Analytics**
- Real-time attendance statistics
- Member growth tracking
- Donation analytics
- Event management overview

### 👥 **Member Management**
- Complete member profiles with photos
- Department and role assignments
- Contact information management
- Member status tracking

### ✅ **Attendance Tracking**
- Quick check-in system
- Service-based attendance
- Visitor registration
- Attendance history and reports

### 💰 **Donation Management**
- Multiple donation types (Tithe, Offering, Building Fund, etc.)
- Payment method tracking
- Receipt generation
- Financial reports and analytics

### 📸 **Photo Management**
- Member photo uploads
- Photo gallery with search and filters
- Bulk photo operations
- Export capabilities

### 🎉 **Events & Notifications**
- Event creation and management
- Member notifications
- Event attendance tracking
- Calendar integration

### 📋 **Reports & Certificates**
- Attendance certificates
- Financial reports
- Member reports
- Export to CSV/PDF

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd church-attendance-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

4. **Set up the database**
   
   Run the SQL scripts in your Supabase dashboard:
   - `scripts/001_create_tables.sql` - Creates all necessary tables
   - `scripts/002_seed_data.sql` - Adds sample data
   - `scripts/003_create_donations_table.sql` - Creates donations table

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Go to the SQL Editor in your Supabase dashboard
3. Run the provided SQL scripts in order:
   - `001_create_tables.sql`
   - `002_seed_data.sql` 
   - `003_create_donations_table.sql`

### Tables Created

- `members` - Member information and profiles
- `attendance` - Attendance records
- `events` - Church events and activities
- `donations` - Financial contributions
- `photos` - Member and event photos

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Update Supabase settings**
   - Add your Vercel domain to Supabase Auth settings
   - Update CORS settings if needed

### Environment Variables for Production

Make sure to set these in your deployment platform:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
\`\`\`

## Usage

### Demo Mode
The app works in demo mode without database configuration, using mock data for testing.

### Production Mode
With proper Supabase setup, all data is persisted and synchronized across users.

### Key Features Usage

1. **Member Management**: Add members with photos and contact details
2. **Attendance**: Quick check-in during services
3. **Donations**: Record and track financial contributions
4. **Reports**: Generate attendance and financial reports
5. **Events**: Create and manage church events

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the demo data and examples

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
