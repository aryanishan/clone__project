// lib/api.js
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || ''
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

const formatViews = (num) => {
  if (!num) return 'No views'
  const n = parseInt(num, 10)
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M views'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K views'
  return n + ' views'
}

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }
  return 'just now'
}

export const fetchTrending = async (maxResults = 12, pageToken = '') => {
  if (!API_KEY) throw new Error('YouTube API Key missing')
  
  let url = `${BASE_URL}/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=${maxResults}&key=${API_KEY}`
  
  if (pageToken) {
    url += `&pageToken=${pageToken}`
  }
  
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch trending videos')
  
  const data = await res.json()
  
  const videos = data.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    views: formatViews(item.statistics?.viewCount),
    time: formatTimeAgo(item.snippet.publishedAt),
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
    description: item.snippet.description,
  }))
  
  return {
    videos,
    nextPageToken: data.nextPageToken || '',
    prevPageToken: data.prevPageToken || '',
    totalResults: data.pageInfo?.totalResults || 0,
  }
}

export const searchVideos = async (query, maxResults = 12, pageToken = '') => {
  if (!API_KEY) throw new Error('YouTube API Key missing')
  
  let searchUrl = `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
  
  if (pageToken) {
    searchUrl += `&pageToken=${pageToken}`
  }
  
  const searchRes = await fetch(searchUrl)
  if (!searchRes.ok) throw new Error('Failed to search videos')
  
  const searchData = await searchRes.json()
  
  const videoIds = searchData.items.map(item => item.id.videoId).filter(Boolean)
  
  if (videoIds.length === 0) {
    return {
      videos: [],
      nextPageToken: searchData.nextPageToken || '',
    }
  }
  
  const videosRes = await fetch(
    `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${API_KEY}`
  )
  const videosData = await videosRes.json()
  
  const videos = videosData.items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    views: formatViews(item.statistics?.viewCount),
    time: formatTimeAgo(item.snippet.publishedAt),
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
    description: item.snippet.description,
  }))
  
  return {
    videos,
    nextPageToken: searchData.nextPageToken || '',
    prevPageToken: searchData.prevPageToken || '',
    totalResults: searchData.pageInfo?.totalResults || 0,
  }
}

export const getVideo = async (id) => {
  if (!API_KEY) throw new Error('YouTube API Key missing')
  
  const res = await fetch(
    `${BASE_URL}/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`
  )
  if (!res.ok) throw new Error('Failed to fetch video')
  
  const data = await res.json()
  const item = data.items[0]
  if (!item) return null
  
  return {
    id: item.id,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    views: formatViews(item.statistics?.viewCount),
    likes: formatViews(item.statistics?.likeCount),
    time: formatTimeAgo(item.snippet.publishedAt),
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url,
  }
}