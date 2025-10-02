# Lingua Future - AI-Powered English Learning Platform

An innovative educational platform that combines traditional learning methods with cutting-edge artificial intelligence to create personalized, effective, and engaging English language learning experiences.

## 🌟 Features

### For Students
- **Interactive Task Management**: View and complete assignments with rich media support
- **AI Learning Assistant**: Get instant help with grammar, assignments, and English language questions
- **Progress Tracking**: Monitor your learning journey with detailed analytics and performance metrics
- **File Submission**: Upload various file types (documents, images, videos) for assignments
- **Real-time Feedback**: Receive immediate feedback on your submissions

### For Teachers
- **Task Creation**: Create comprehensive assignments with descriptions, links, and materials
- **Student Management**: Track student submissions and provide grades (1-10 scale)
- **Class Analytics**: Monitor student performance with detailed statistics
- **File Management**: Upload and share educational materials
- **Grading System**: Efficiently grade and provide feedback on student work

## 🚀 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, File Storage)
- **AI Integration**: OpenRouter API with Llama 3.1 model
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- A Supabase account
- An OpenRouter API key

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd my-task2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Note**: The app includes fallback values for building purposes, but you need real Supabase credentials for full functionality. See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed setup instructions.

### 4. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `SUPABASE_SCHEMA.sql`
4. Run the SQL script to create all necessary tables and policies

### 5. Storage Setup
1. In your Supabase dashboard, go to Storage
2. Create a new bucket named `files`
3. Set the bucket to public

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Database Schema

The application uses the following main tables:

- **profiles**: User information and roles (student/teacher)
- **tasks**: Assignment details created by teachers
- **task_materials**: Files and materials attached to tasks
- **submissions**: Student submissions for tasks
- **submission_files**: Files uploaded by students

## 🎯 User Roles

### Student Role
- View assigned tasks
- Submit work with file uploads
- Access AI chat assistant
- Track personal progress and grades

### Teacher Role
- Create and manage tasks
- Upload educational materials
- Grade student submissions
- View class analytics and statistics

## 🤖 AI Features

The AI assistant is powered by OpenRouter's Llama 3.1 model and provides:
- Grammar explanations
- Assignment clarification
- Writing assistance
- Vocabulary help
- Learning guidance

## 📱 Pages and Navigation

- **Landing Page** (`/`): Project introduction and registration
- **Tasks** (`/tasks`): Main task management interface
- **Task Detail** (`/tasks/[id]`): Individual task view and submission
- **Rating** (`/rating`): Progress tracking and analytics
- **AI Chat** (`/ai-chat`): AI learning assistant (students only)
- **Authentication** (`/auth/login`, `/auth/register`): User authentication

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure file uploads with type validation
- Protected API routes

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js applications.

## 📝 API Endpoints

The application uses Supabase for backend functionality:
- Authentication via Supabase Auth
- Database operations via Supabase Client
- File storage via Supabase Storage
- AI integration via OpenRouter API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

## 🔮 Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Mobile app development
- Integration with more AI models
- Collaborative features
- Video conferencing integration

---

**Lingua Future** - Empowering language learning through AI technology.
