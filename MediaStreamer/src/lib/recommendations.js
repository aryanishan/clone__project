// lib/recommendations.js
import { searchVideos } from './api'

// Function to extract keywords from video title and description
const extractKeywords = (title, description = '') => {
  const words = `${title} ${description}`
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3) // Remove short words
    .filter(word => !['video', 'watch', 'official', 'trailer', 'new', '2024', '2025', '2026'].includes(word))
    .slice(0, 5) // Take top 5 keywords
  
  return [...new Set(words)] // Remove duplicates
}

// Get related videos based on video metadata
export const getRecommendedVideos = async (currentVideo, allVideos = []) => {
  if (!currentVideo) return []
  
  const recommendations = []
  const currentId = currentVideo.id
  
  // 1. Videos from same channel
  const sameChannel = allVideos.filter(v => 
    v.channel === currentVideo.channel && v.id !== currentId
  ).slice(0, 3)
  recommendations.push(...sameChannel)
  
  // 2. Search by keywords from title
  const keywords = extractKeywords(currentVideo.title, currentVideo.description)
  for (const keyword of keywords.slice(0, 2)) {
    try {
      const results = await searchVideos(keyword, 5)
      const filtered = results.filter(v => 
        v.id !== currentId && 
        !recommendations.some(r => r.id === v.id)
      )
      recommendations.push(...filtered.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch recommendations for keyword:', keyword)
    }
  }
  
  // 3. Add trending videos as fallback
  if (recommendations.length < 10) {
    try {
      const { videos: trending } = await fetchTrending(10)
      const filtered = trending.filter(v => 
        v.id !== currentId && 
        !recommendations.some(r => r.id === v.id)
      )
      recommendations.push(...filtered.slice(0, 10 - recommendations.length))
    } catch (error) {
      console.error('Failed to fetch trending for recommendations')
    }
  }
  
  // Remove duplicates and limit to 15 recommendations
  return [...new Map(recommendations.map(v => [v.id, v])).values()]
    .slice(0, 15)
}

// Get more from same channel
export const getMoreFromChannel = async (channelId, currentVideoId, limit = 6) => {
  if (!channelId) return []
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${limit}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
    )
    const data = await response.json()
    
    return data.items
      .filter(item => item.id.videoId !== currentVideoId)
      .map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        time: item.snippet.publishedAt,
      }))
  } catch (error) {
    console.error('Failed to fetch channel videos:', error)
    return []
  }
}