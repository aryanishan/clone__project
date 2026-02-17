const KEY = import.meta.env.VITE_API_KEY
const BASE = 'https://www.googleapis.com/youtube/v3'

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export async function fetchTrending(maxResults = 12) {
  if (!KEY) throw new Error('VITE_API_KEY not set')
  const url = `${BASE}/videos?part=snippet,statistics&chart=mostPopular&maxResults=${maxResults}&regionCode=US&key=${KEY}`
  const data = await fetchJson(url)
  return (data.items || []).map((it) => ({
    id: it.id,
    title: it.snippet.title,
    channel: it.snippet.channelTitle,
    views: it.statistics?.viewCount ? `${it.statistics.viewCount} views` : '',
    time: it.snippet.publishedAt,
    description: it.snippet.description,
    thumbnail:
      it.snippet.thumbnails?.high?.url || it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.default?.url || '',
  }))
}

export async function searchVideos(q, maxResults = 12) {
  if (!KEY) throw new Error('VITE_API_KEY not set')
  const sUrl = `${BASE}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(q)}&key=${KEY}`
  const sData = await fetchJson(sUrl)
  const ids = (sData.items || []).map((i) => i.id.videoId).filter(Boolean)
  if (ids.length === 0) return []
  const vUrl = `${BASE}/videos?part=snippet,statistics&id=${ids.join(',')}&key=${KEY}`
  const vData = await fetchJson(vUrl)
  return (vData.items || []).map((it) => ({
    id: it.id,
    title: it.snippet.title,
    channel: it.snippet.channelTitle,
    views: it.statistics?.viewCount ? `${it.statistics.viewCount} views` : '',
    time: it.snippet.publishedAt,
    description: it.snippet.description,
    thumbnail:
      it.snippet.thumbnails?.high?.url || it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.default?.url || '',
  }))
}

export async function getVideo(id) {
  if (!KEY) throw new Error('VITE_API_KEY not set')
  const url = `${BASE}/videos?part=snippet,statistics&id=${id}&key=${KEY}`
  const data = await fetchJson(url)
  const it = (data.items || [])[0]
  if (!it) return null
  return {
    id: it.id,
    title: it.snippet.title,
    channel: it.snippet.channelTitle,
    views: it.statistics?.viewCount ? `${it.statistics.viewCount} views` : '',
    time: it.snippet.publishedAt,
    description: it.snippet.description,
    thumbnail:
      it.snippet.thumbnails?.high?.url || it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.default?.url || '',
  }
}

// Note: This file expects VITE_API_KEY in your .env file. If you want to use a different
// backend, replace these functions or add a small server-side proxy. Be mindful of
// API quota limits when calling YouTube Data API directly from the browser.
