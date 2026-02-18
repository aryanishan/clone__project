const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

console.log('API Key status:', API_KEY ? '✅ Present' : '❌ Missing')

const formatNumber = (num) => {
  if (!num) return '0'
  const n = parseInt(num)
  if (isNaN(n)) return '0'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Recently'
  
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago'
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago'
    if (diffInSeconds < 2592000) return Math.floor(diffInSeconds / 86400) + ' days ago'
    if (diffInSeconds < 31536000) return Math.floor(diffInSeconds / 2592000) + ' months ago'
    return Math.floor(diffInSeconds / 31536000) + ' years ago'
  } catch {
    return 'Recently'
  }
}

// Working demo videos with real YouTube IDs
const DEMO_VIDEOS = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    channel: 'Rick Astley',
    channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    views: '1.2B views',
    time: '15 years ago',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    description: 'The official music video for Rick Astley - Never Gonna Give You Up'
  },
  {
    id: '9bZkp7q19f0',
    title: 'PSY - GANGNAM STYLE',
    channel: 'officialpsy',
    channelId: 'UCrDkAvwZum1UTpI2tJToEcA',
    views: '4.5B views',
    time: '12 years ago',
    thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg',
    description: 'PSY - GANGNAM STYLE(강남스타일) MV'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    channel: 'Luis Fonsi',
    channelId: 'UCVlqOiV5MSqX2hWU4OPAw5g',
    views: '7.8B views',
    time: '7 years ago',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    description: 'Luis Fonsi - Despacito ft. Daddy Yankee'
  },
  {
    id: 'RgKAFK5djSk',
    title: 'Wiz Khalifa - See You Again ft. Charlie Puth',
    channel: 'Wiz Khalifa',
    channelId: 'UCMS8FwRZmPw2jZwLQp6Yk8g',
    views: '5.2B views',
    time: '8 years ago',
    thumbnail: 'https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg',
    description: 'Wiz Khalifa - See You Again ft. Charlie Puth'
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Queen - Bohemian Rhapsody',
    channel: 'Queen Official',
    channelId: 'UCiMhD4jzUqG-IgPzUmmytRQ',
    views: '1.3B views',
    time: '13 years ago',
    thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    description: 'Queen - Bohemian Rhapsody (Official Video)'
  },
  {
    id: 'OPf0YbXqDm0',
    title: 'Mark Ronson - Uptown Funk ft. Bruno Mars',
    channel: 'Mark Ronson',
    channelId: 'UCgK8H7lXWv7ZzQnYz8lKk5A',
    views: '4.2B views',
    time: '9 years ago',
    thumbnail: 'https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg',
    description: 'Mark Ronson - Uptown Funk ft. Bruno Mars'
  }
]

export const fetchTrending = async (maxResults = 12, pageToken = '') => {
  // If no API key, use demo videos
  if (!API_KEY) {
    console.log('No API key, using demo videos')
    return {
      videos: DEMO_VIDEOS,
      nextPageToken: null
    }
  }

  try {
    const url = `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=${maxResults}&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }
    
    const data = await response.json()
    
    const videos = data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      views: formatNumber(item.statistics?.viewCount) + ' views',
      likes: formatNumber(item.statistics?.likeCount),
      time: formatTimeAgo(item.snippet.publishedAt),
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      description: item.snippet.description
    }))
    
    return {
      videos,
      nextPageToken: data.nextPageToken || null
    }
  } catch (error) {
    console.error('API Error, using demo videos:', error)
    return {
      videos: DEMO_VIDEOS,
      nextPageToken: null
    }
  }
}

export const searchVideos = async (query, maxResults = 12, pageToken = '') => {
  // If no API key, filter demo videos
  if (!API_KEY || !query) {
    const filtered = DEMO_VIDEOS.filter(v => 
      v.title.toLowerCase().includes(query?.toLowerCase() || '') ||
      v.channel.toLowerCase().includes(query?.toLowerCase() || '')
    ).slice(0, maxResults)
    return { 
      videos: filtered, 
      nextPageToken: null 
    }
  }

  try {
    const searchUrl = `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
    const searchRes = await fetch(searchUrl)
    
    if (!searchRes.ok) {
      throw new Error(`Search API returned ${searchRes.status}`)
    }
    
    const searchData = await searchRes.json()
    
    const videoIds = searchData.items?.map(item => item.id.videoId).filter(Boolean) || []
    
    if (videoIds.length === 0) {
      return { 
        videos: [], 
        nextPageToken: searchData.nextPageToken || null 
      }
    }
    
    const videosRes = await fetch(`${BASE_URL}/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${API_KEY}`)
    const videosData = await videosRes.json()
    
    const videos = videosData.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      views: formatNumber(item.statistics?.viewCount) + ' views',
      likes: formatNumber(item.statistics?.likeCount),
      time: formatTimeAgo(item.snippet.publishedAt),
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      description: item.snippet.description
    }))
    
    return {
      videos,
      nextPageToken: searchData.nextPageToken || null
    }
  } catch (error) {
    console.error('Search Error, using filtered demo videos:', error)
    const filtered = DEMO_VIDEOS.filter(v => 
      v.title.toLowerCase().includes(query?.toLowerCase() || '') ||
      v.channel.toLowerCase().includes(query?.toLowerCase() || '')
    ).slice(0, maxResults)
    return { 
      videos: filtered, 
      nextPageToken: null 
    }
  }
}

export const getVideo = async (id) => {
  // First check if it's a demo video
  const demoVideo = DEMO_VIDEOS.find(v => v.id === id)
  if (demoVideo) return demoVideo

  // If no API key, return first demo video
  if (!API_KEY) {
    return DEMO_VIDEOS[0]
  }

  try {
    const url = `${BASE_URL}/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }
    
    const data = await response.json()
    const item = data.items?.[0]
    
    if (!item) {
      return DEMO_VIDEOS[0]
    }
    
    return {
      id: item.id,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      views: formatNumber(item.statistics?.viewCount) + ' views',
      likes: formatNumber(item.statistics?.likeCount),
      time: formatTimeAgo(item.snippet.publishedAt),
      thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url,
      description: item.snippet.description
    }
  } catch (error) {
    console.error('Video Error, using demo video:', error)
    return DEMO_VIDEOS[0]
  }
}