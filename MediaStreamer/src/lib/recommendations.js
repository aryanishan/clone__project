// lib/recommendations.js
import { searchVideos, fetchTrending, getChannelVideos } from './api'

export const getRecommendedVideos = async (currentVideo, limit = 15) => {
  if (!currentVideo) return []
  
  const recommendations = []
  const currentId = currentVideo.id
  
  // 1. Get videos from same channel
  if (currentVideo.channelId) {
    try {
      const channelVideos = await getChannelVideos(currentVideo.channelId, 5)
      const filtered = channelVideos.filter(v => v.id !== currentId)
      recommendations.push(...filtered)
    } catch (error) {
      console.error('Failed to fetch channel videos:', error)
    }
  }
  
  // 2. Search by title keywords
  if (recommendations.length < limit) {
    const keywords = currentVideo.title
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3)
      .join(' ')
    
    if (keywords) {
      try {
        const searchData = await searchVideos(keywords, 8)
        const searchResults = searchData.videos || []
        const filtered = searchResults.filter(v => v.id !== currentId)
        recommendations.push(...filtered)
      } catch (error) {
        console.error('Failed to search videos:', error)
      }
    }
  }
  
  // 3. Add trending as fallback
  if (recommendations.length < limit) {
    try {
      const trendingData = await fetchTrending(10)
      const trendingVideos = trendingData.videos || []
      const filtered = trendingVideos.filter(v => v.id !== currentId)
      recommendations.push(...filtered)
    } catch (error) {
      console.error('Failed to fetch trending:', error)
    }
  }
  
  // Remove duplicates
  const unique = Array.from(
    new Map(recommendations.map(v => [v.id, v])).values()
  ).slice(0, limit)
  
  return unique
}