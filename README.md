```markdown
# MediaStreamer - YouTube Clone

A modern YouTube clone built with React, Vite, and the YouTube Data API. Features a clean, dark-themed UI with video browsing, search functionality, watch history, and notifications.

## 🚀 Features

### Core Features
- **Video Browsing** - Browse trending videos with infinite scroll
- **Search Functionality** - Search for videos with debounced input
- **Video Player** - Watch videos with embedded YouTube player
- **Responsive Design** - Works seamlessly on desktop and mobile

### User Features
- **Watch History** - Automatically saves watched videos with timestamps
- **Profile Management** - Edit profile information and channel details
- **Notifications System** - Real-time notifications for channel activity
- **History Page** - View and manage watch history with date grouping
- **Channel Statistics** - View video count, subscribers, and watch stats

### Technical Features
- **Infinite Scroll** - Automatically loads more videos as you scroll
- **YouTube API Integration** - Fetches real video data with pagination
- **Local Storage** - Persists user data, history, and notifications
- **Dark Theme** - Professional dark mode UI
- **Responsive Layout** - Adapts to different screen sizes

## 🛠️ Technologies Used

- **React 19** - UI library
- **Vite 8** - Build tool and development server
- **React Router DOM 6** - Routing and navigation
- **YouTube Data API v3** - Video data and search
- **CSS3** - Styling with modern features

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- YouTube Data API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mediastreamer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:
   ```env
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. **Get a YouTube API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable YouTube Data API v3
   - Create credentials (API Key)
   - Copy the API key to your `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
mediastreamer/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with navbar and sidebar
│   │   ├── navbar.jsx          # Navigation bar with search
│   │   ├── sidebar.jsx         # Sidebar with navigation links
│   │   ├── VideoCard.jsx       # Video preview card component
│   │   ├── CategoryFilters.jsx # Category chips for filtering
│   │   └── NotificationDropdown.jsx # Notifications dropdown
│   ├── pages/
│   │   ├── Home.jsx            # Home page with video grid
│   │   ├── Watch.jsx           # Video player page
│   │   ├── Profile.jsx         # User profile page
│   │   ├── History.jsx         # Watch history page
│   │   └── Upload.jsx          # Video upload page
│   ├── context/
│   │   ├── HistoryContext.jsx  # Watch history management
│   │   └── NotificationContext.jsx # Notifications management
│   ├── lib/
│   │   └── api.js              # YouTube API integration
│   ├── App.jsx                  # Main app component
│   ├── App.css                   # Global app styles
│   ├── index.css                 # CSS variables and base styles
│   └── main.jsx                  # Entry point
├── .env                          # Environment variables
├── .gitignore                     # Git ignore file
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
└── README.md                      # Project documentation
```

## 🎯 Key Features Explained

### Watch History
- Automatically saves videos when watched
- Groups by date (Today, Yesterday, Older)
- Persistent storage in localStorage
- Option to remove individual videos or clear all

### Notifications
- Real-time notifications for channel activity
- Unread count badge on notification icon
- Mark as read, mark all as read, clear all
- Click notifications to navigate to videos
- Persistent storage

### Infinite Scroll
- Automatically loads more videos when scrolling
- Uses YouTube API pagination with pageToken
- Prevents duplicate videos
- Loading indicators and end-of-content message

### Profile Page
- Edit profile information
- View channel statistics
- Recent activity from watch history
- Account settings section
- Professional cover photo and avatar

## 🔌 API Integration

The app uses YouTube Data API v3 for:
- `videos?chart=mostPopular` - Trending videos
- `search` - Video search functionality
- `videos?part=snippet,statistics` - Video details with view counts

All API calls include pagination support with `pageToken` for infinite scroll.

## 🎨 Styling

- Dark theme with YouTube-inspired colors
- CSS variables for consistent theming
- Responsive design with mobile breakpoints
- Custom scrollbars
- Hover effects and transitions
- Professional card-based layouts

## 📱 Responsive Design

- **Desktop**: Full layout with expanded sidebar
- **Tablet**: Collapsed sidebar, adjusted grid
- **Mobile**: Stacked layout, hidden sidebar

## 🚦 Routing

- `/` - Home page with video grid
- `/watch/:id` - Video player page
- `/profile` - User profile
- `/history` - Watch history
- `/upload` - Video upload (demo)

## 💾 Data Persistence

The following data is stored in localStorage:
- User profile information
- Watch history (last 50 videos)
- Notifications (last 20)
- Read/unread status

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_YOUTUBE_API_KEY` | YouTube Data API key | Yes |

## 📄 License

This project is for educational purposes. YouTube is a trademark of Google LLC.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Important Notes

- YouTube API has daily quota limits (10,000 units per day)
- Keep your API key secure and never commit it to GitHub
- The app uses localStorage for data persistence (clear browser data to reset)
- Some features like upload are demo-only (no actual video upload)

## 🐛 Known Issues

- Search pagination is simulated (YouTube search API pagination works differently)
- Video duration not shown (would require additional API calls)
- Subscriber counts are demo values
- Notifications are simulated for demo purposes

## 🔮 Future Improvements

- [ ] Add user authentication
- [ ] Implement actual video upload
- [ ] Add comments section
- [ ] Channel pages
- [ ] Playlists
- [ ] Like/dislike functionality
- [ ] Share videos
- [ ] Subscriptions feed
- [ ] Live chat integration
- [ ] Picture-in-picture mode

## 📞 Support

For issues or questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Include browser console errors if applicable

---

**Enjoy your MediaStreamer experience!** 🎬
```
