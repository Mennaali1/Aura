# AURA Frontend - Next.js Application

## Overview

AURA is a mental health and emotional intelligence platform built with Next.js, React Query, and Tailwind CSS. The frontend provides a modern, responsive interface for emotion tracking, journaling, grounding techniques, and mental health resources.

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query) v5
- **HTTP Client:** Axios
- **Development:** ESLint, Autoprefixer, PostCSS

## Project Structure

```
frontend/
├── components/          # Reusable React components
│   ├── Navbar.js       # Navigation bar with auth state
│   ├── HeroSection.js  # Landing page hero with carousel
│   ├── EmotionsSection.js  # Emotion tracking preview
│   ├── Journaling.js   # Journal entries with prompts
│   ├── GroundingTechniques.js  # Mindfulness exercises
│   └── TherapyResources.js  # Mental health professionals directory
├── pages/              # Next.js pages
│   ├── _app.js        # App wrapper with React Query provider
│   ├── _document.js   # Custom document
│   ├── index.js       # Home page
│   ├── emotions.js    # Full emotion dashboard
│   ├── journal.js     # Dedicated journal page
│   ├── grounding.js   # Resources page (grounding + therapy)
│   └── auth/          # Authentication pages
│       ├── login.js   # Sign in page
│       └── register.js  # Sign up page
├── public/            # Static assets
│   └── data/          # JSON data files
│       ├── hero-slides.json            # Hero section carousel data
│       ├── grounding-techniques.json   # 8 grounding techniques
│       ├── therapy-resources.json      # 6 therapy resources
│       └── journal-prompts.json        # 30 journal prompts (6 categories)
├── styles/            # Global styles
│   └── globals.css    # Tailwind CSS and custom styles
├── next.config.js     # Next.js configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json       # Dependencies and scripts
```

## Features

### 1. Emotion Dashboard (`/emotions`)

- **Emotion Tracking:** Track daily emotions with intensity levels (1-10)
- **Categories:** 6 emotion categories (Happy, Sad, Angry, Anxious, Calm, Confused)
- **Statistics:** View total entries, weekly count, streaks, and dominant emotions
- **History:** Browse past emotion entries with filters
- **Notes:** Add contextual notes to emotion entries

### 2. Personal Journal (`/journal`)

- **CRUD Operations:** Create, read, update, delete journal entries
- **Mood Tracking:** Select mood emoji for each entry (6 mood options)
- **Tags:** Organize entries with custom tags
- **Writing Prompts:** 30 prompts across 6 categories (fetched from JSON):
  - 🙏 Gratitude (5 prompts)
  - 🤔 Reflection (5 prompts)
  - 💭 Emotions (5 prompts)
  - 🎯 Goals (5 prompts)
  - 💞 Relationships (5 prompts)
  - 🌸 Self-Care (5 prompts)
- **React Query Integration:** Real-time sync with backend API
- **Loading/Error States:** Graceful handling of API failures

### 3. Grounding Techniques (`/grounding`)

- **8 Techniques:** Evidence-based mindfulness exercises (fetched from JSON):
  1. 5-4-3-2-1 Technique
  2. Box Breathing (4-4-4-4)
  3. Mindful Breathing
  4. Safe Place Visualization
  5. Body Scan Meditation
  6. Progressive Muscle Relaxation
  7. Physical Grounding with Objects
  8. 4-7-8 Breathing Technique
- **Interactive:** Expandable cards with step-by-step instructions
- **Benefits:** Clear explanation of each technique's benefits
- **Tips Section:** 4 success tips for practicing grounding techniques

### 4. Therapy Resources (`/grounding`)

- **6 Professionals:** Psychiatrists and therapists in Cairo (fetched from JSON):
  - Dr. Ahmed Hassan, MD (Psychiatry)
  - Cairo Mental Health Center (General Therapy)
  - Dr. Fatma Mohamed, PhD (Clinical Psychology)
  - Dr. Youssef Khalil, MD (Child & Adolescent Psychiatry)
  - Mindfulness Wellness Center (Holistic Therapy)
  - Dr. Laila Samir, PhD (Couples & Family Therapy)
- **Search & Filter:** Search by name/specialty, filter by type (All, Therapists, Psychiatrists)
- **Details:** Ratings, reviews, specialties, contact information
- **Emergency Contacts:** 3 emergency hotlines for Egypt (Crisis Support, Mental Health Resources, 24/7 Support)

### 5. Authentication

- **Login:** Email/password authentication
- **Register:** New user registration with form validation
- **JWT Tokens:** Secure authentication with backend API

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:5000`

### Installation Steps

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables** (Optional)
   Create `.env.local` file:

   ```env
   BACKEND_URL=http://localhost:5000
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Integration

### Backend Endpoints Used

- `GET /api/emotions` - Fetch user emotions
- `POST /api/emotions` - Save new emotion
- `GET /api/emotions/stats` - Get emotion statistics
- `GET /api/journals` - Fetch user journals
- `POST /api/journals` - Create new journal
- `PUT /api/journals/:id` - Update journal
- `DELETE /api/journals/:id` - Delete journal
- `POST /api/users/signup` - User registration
- `POST /api/users/signin` - User login

### Authentication

- JWT tokens stored in `localStorage`
- Authorization header: `Bearer {token}`
- Protected routes require authentication

## React Query Setup

### Query Keys

- `["emotions", filterPeriod]` - Emotions data
- `["emotionStats"]` - Emotion statistics
- `["journals"]` - Journal entries
- `["journalPrompts"]` - Journal writing prompts
- `["groundingTechniques"]` - Grounding techniques
- `["therapyResources"]` - Therapy resources

### Cache Configuration

- **Stale Time:** 1 hour (3600000ms)
- **Cache Time:** 24 hours (86400000ms)
- **Automatic Refetching:** On window focus (configurable)

## Styling with Tailwind CSS

### Custom Classes (in `globals.css`)

- `.btn` - Base button styles
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.btn-outline` - Outlined button
- `.card` - Card container with shadow
- `.input` - Form input styling

### Color Scheme

- **Primary:** Blue tones (`primary-50` to `primary-900`)
- **Semantic:** Red (error), Green (success), Yellow (warning)
- **Neutral:** Gray scale for text and backgrounds

## Component Architecture

### Data Fetching Pattern

```javascript
const { data, isLoading, isError, error } = useQuery({
  queryKey: ["key"],
  queryFn: fetchFunction,
  staleTime: 1000 * 60 * 60,
});
```

### Mutation Pattern

```javascript
const mutation = useMutation({
  mutationFn: apiFunction,
  onSuccess: () => {
    queryClient.invalidateQueries(["key"]);
  },
});
```

### Loading States

All components include:

- Loading spinners during data fetch
- Error messages with retry options
- Empty states with call-to-action

## Testing Checklist

### ✅ Completed Tasks

1. ✅ Deleted `frontend/client/` directory
2. ✅ Removed unused CSS and JS files
3. ✅ Created `/emotions` page with full dashboard
4. ✅ Added 3 more therapy resources (total: 6)
5. ✅ Added 4 more grounding techniques (total: 8)
6. ✅ Added journal prompts feature (30+ prompts)

### Manual Testing Steps

#### 1. Home Page (`/`)

- [ ] Navbar loads correctly
- [ ] Hero carousel auto-advances
- [ ] All sections render (Emotions, Journaling, Grounding, Therapy)
- [ ] Smooth scrolling between sections

#### 2. Emotions Dashboard (`/emotions`)

- [ ] Stats display correctly
- [ ] Emotion selection works
- [ ] Intensity slider functions
- [ ] Save emotion button works
- [ ] History loads with filters
- [ ] Quick actions links work

#### 3. Journaling

- [ ] "New Entry" opens modal
- [ ] "Writing Prompts" button works
- [ ] Prompt categories display (6 categories)
- [ ] Selecting prompt pre-fills title
- [ ] Save entry works
- [ ] Edit entry works
- [ ] Delete entry works
- [ ] Tags display correctly

#### 4. Grounding Techniques

- [ ] All 8 techniques load from JSON
- [ ] Expandable cards work
- [ ] Step-by-step instructions display
- [ ] Benefits section shows
- [ ] Tips section renders

#### 5. Therapy Resources

- [ ] All 6 resources load from JSON
- [ ] Search by name/specialty works
- [ ] Filter buttons work (All, Therapists, Psychiatrists)
- [ ] Contact information displays
- [ ] Emergency contacts section shows

#### 6. Authentication

- [ ] Register page works
- [ ] Login page works
- [ ] Token saved to localStorage
- [ ] Protected routes check authentication
- [ ] Logout functionality works

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Tailwind styles not working**

   ```bash
   npm run dev
   # Restart dev server
   ```

3. **API connection errors**

   - Ensure backend is running on port 5000
   - Check CORS configuration in backend
   - Verify JWT token in localStorage

4. **React Query not caching**
   - Check QueryClientProvider in `_app.js`
   - Verify queryKey uniqueness
   - Review staleTime and cacheTime settings

## Performance Optimizations

- **Code Splitting:** Next.js automatic page-based splitting
- **Image Optimization:** Use Next.js Image component where applicable
- **React Query Caching:** Reduces unnecessary API calls
- **Lazy Loading:** Components load on demand
- **Production Build:** Optimized bundle with minification

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Dark mode support
- [ ] Export journal as PDF
- [ ] Emotion charts and graphs
- [ ] Social sharing features
- [ ] Progressive Web App (PWA)
- [ ] Offline support with service workers

## License

MIT License

## Contact

For support or questions, please contact the development team.

## Recent Updates (2025-10-27)

### ✅ Bug Fixes & Enhancements

1. **Backend Export/Import Issues Fixed**

   - Fixed controller export mismatches (emotion & journal)
   - Converted `require()` to ES6 imports in routers
   - Fixed deprecated `mongoose.Types.ObjectId()` syntax

2. **Frontend SSR Fixes**

   - Fixed `localStorage` access during SSR in `emotions.js` and `Journaling.js`
   - Added `isClient` check for safe localStorage usage
   - Fixed React Query v5 deprecated `isLoading` → `isPending` in mutations

3. **Authentication Endpoints Fixed**

   - Updated login endpoint: `/api/auth/login` → `/api/users/signin`
   - Updated register endpoint: `/api/auth/register` → `/api/users/signup`

4. **Navbar JSON.parse Error Fixed**

   - Added try-catch for parsing user data from localStorage
   - Handles invalid JSON gracefully

5. **Journal Prompts Migration**

   - Moved hardcoded prompts to JSON file
   - Added React Query for fetching prompts
   - Added loading/error states
   - Enhanced UI with category icons and descriptions

6. **New Pages Created**

   - `/journal` - Dedicated journal page
   - `/grounding` - Combined grounding techniques and therapy resources

7. **Cleanup**
   - Deleted unused root `.next` folder (kept `frontend/.next`)
   - Updated README with latest structure and endpoints

---

**Last Updated:** 2025-10-27
**Version:** 1.1.0
