const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3'

// Helper to get realistic thumbnails
const getThumbnail = (id) => `https://picsum.photos/seed/${id}/640/360`
const getAvatar = (id) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`

export const fetchTrending = async (limit = 12, pageToken = '') => {
  if (!API_KEY) return getMockVideos(limit)

  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=${limit}&key=${API_KEY}&pageToken=${pageToken}`
    )
    const data = await response.json()
    if (data.error) throw new Error(data.error.message)

    return {
      videos: data.items.map(mapVideo),
      nextPageToken: data.nextPageToken
    }
  } catch (error) {
    console.error('API Error:', error)
    return getMockVideos(limit)
  }
}

export const searchVideos = async (query, limit = 12, pageToken = '') => {
  if (!API_KEY) return getMockVideos(limit, query)

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${limit}&key=${API_KEY}&pageToken=${pageToken}`
    )
    const data = await response.json()
    if (data.error) throw new Error(data.error.message)

    return {
      videos: data.items.map(mapSearchResult),
      nextPageToken: data.nextPageToken
    }
  } catch (error) {
    console.error('API Error:', error)
    return getMockVideos(limit, query)
  }
}

export const getVideo = async (id) => {
  if (!API_KEY) return getMockVideo(id)

  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${id}&key=${API_KEY}`
    )
    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    if (!data.items || data.items.length === 0) return getMockVideo(id)

    return mapVideo(data.items[0])
  } catch (error) {
    console.error('API Error:', error)
    return getMockVideo(id)
  }
}

export const getChannelVideos = async (channelId, limit = 5) => {
  if (!API_KEY) return getMockVideos(limit).videos;
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&channelId=${channelId}&type=video&maxResults=${limit}&key=${API_KEY}`
    )
    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    return data.items.map(mapSearchResult)
  } catch (error) {
    return getMockVideos(limit).videos
  }
}

const mapVideo = (item) => ({
  id: item.id,
  title: item.snippet.title,
  channel: item.snippet.channelTitle,
  channelId: item.snippet.channelId,
  description: item.snippet.description,
  thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
  views: formatViews(item.statistics?.viewCount),
  likes: formatViews(item.statistics?.likeCount),
  time: new Date(item.snippet.publishedAt).toLocaleDateString(),
  duration: item.contentDetails?.duration, // Simplified for now
  avatar: item.snippet.thumbnails.default?.url
})

const mapSearchResult = (item) => ({
  id: item.id.videoId,
  title: item.snippet.title,
  channel: item.snippet.channelTitle,
  channelId: item.snippet.channelId,
  description: item.snippet.description,
  thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
  views: 'New',
  time: new Date(item.snippet.publishedAt).toLocaleDateString(),
  avatar: item.snippet.thumbnails.default?.url
})

const formatViews = (views) => {
  if (!views) return '0'
  const num = parseInt(views)
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const getMockVideos = (limit, query = '') => {
  const categories = ['Gaming', 'Tech', 'Music', 'Vlog', 'Cooking', 'Travel', 'Education', 'Comedy']
  const videos = Array(limit).fill(0).map((_, i) => {
    const id = `mock-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`
    const category = categories[Math.floor(Math.random() * categories.length)]
    return {
      id,
      title: query ? `${query} - Part ${i + 1}` : `${category}: Amazing Content You Must Watch ${i + 1}`,
      channel: `${category} Channel`,
      channelId: `channel-${i}`,
      views: `${Math.floor(Math.random() * 900 + 100)}K`,
      time: `${Math.floor(Math.random() * 11 + 1)} months ago`,
      thumbnail: getThumbnail(id),
      avatar: getAvatar(`channel-${i}`)
    }
  })
  return { videos, nextPageToken: 'mock-token' }
}

const getMockVideo = (id) => ({
  id,
  title: 'Amazing Video Content That You Must Watch',
  channel: 'Awesome Creator',
  channelId: 'mock-channel-id',
  description: 'This is a detailed description of the video. It contains timestamps, links, and other important information about the content you are watching.\n\n0:00 Intro\n1:30 Main Content\n5:00 Conclusion\n\nDon\'t forget to like and subscribe!',
  views: '1.2M',
  likes: '45K',
  time: '2 days ago',
  thumbnail: getThumbnail(id),
  avatar: getAvatar('mock-channel-id')
})