const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || ''
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const formatViews = (num) => {
  if (!num) return '0 views'
  const n = parseInt(num, 10)
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M views'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K views'
  return n + ' views'
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 365) return Math.floor(days / 365) + ' years ago'
  if (days > 30) return Math.floor(days / 30) + ' months ago'
  if (days > 0) return days + ' days ago'
  return 'Today'
}

export const fetchTrending = async () => {
  if (!API_KEY) throw new Error('API Key missing')
  const res = await fetch(`${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=24&key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch trending')
  const data = await res.json()
  return data.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    views: formatViews(item.statistics?.viewCount),
    time: formatTime(item.snippet.publishedAt),
    thumbnail: item.snippet.thumbnails.medium.url,
    description: item.snippet.description,
  }))
}

export const searchVideos = async (query) => {
  if (!API_KEY) throw new Error('API Key missing')
  const res = await fetch(`${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=24&key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to search')
  const data = await res.json()
  return data.items.map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    views: '', // Search results don't include view counts in the snippet
    time: formatTime(item.snippet.publishedAt),
    thumbnail: item.snippet.thumbnails.medium.url,
    description: item.snippet.description,
  }))
}

export const getVideo = async (id) => {
  if (!API_KEY) throw new Error('API Key missing')
  const res = await fetch(`${BASE_URL}/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`)
  if (!res.ok) throw new Error('Failed to fetch video')
  const data = await res.json()
  const item = data.items[0]
  if (!item) return null
  return {
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    views: formatViews(item.statistics?.viewCount),
    time: formatTime(item.snippet.publishedAt),
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high.url,
  }
}

export const getRelatedVideos = async (query) => {
  // Using search as a proxy for related/recommended videos since relatedToVideoId is deprecated
  if (!API_KEY) throw new Error('API Key missing')
  return searchVideos(query)
}