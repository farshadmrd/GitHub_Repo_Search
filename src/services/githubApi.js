// GitHub API service for repository search
const GITHUB_API_BASE = 'https://api.github.com'
const SEARCH_ENDPOINT = '/search/repositories'

/**
 * Search GitHub repositories using the GitHub Search API
 * @param {string} query - Search query
 * @param {number} page - Page number (1-indexed)
 * @param {number} perPage - Results per page (max 100)
 * @returns {Promise<Object>} Search results
 */
export async function searchRepositories(query, page = 1, perPage = 10) {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      per_page: perPage.toString(),
      sort: 'stars',
      order: 'desc'
    })

    const response = await fetch(`${GITHUB_API_BASE}${SEARCH_ENDPOINT}?${params}`)

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.')
      }
      if (response.status === 422) {
        throw new Error('Invalid search query. Please check your search terms.')
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      items: data.items || [],
      total_count: data.total_count || 0,
      incomplete_results: data.incomplete_results || false
    }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.')
    }
    throw error
  }
}

/**
 * Get trending repositories
 * @param {string} language - Programming language filter
 * @param {string} timeframe - Time range (daily, weekly, monthly)
 * @returns {Promise<Object>} Trending repositories
 */
export async function getTrendingRepositories(language = '', timeframe = 'weekly') {
  const dateMap = {
    daily: 1,
    weekly: 7,
    monthly: 30
  }
  
  const days = dateMap[timeframe] || 7
  const date = new Date()
  date.setDate(date.getDate() - days)
  const dateString = date.toISOString().split('T')[0]
  
  let query = `created:>${dateString}`
  if (language) {
    query += ` language:${language}`
  }
  
  return searchRepositories(query, 1, 10)
}