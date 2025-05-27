<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>
          🐙 GitHub Repository Search
        </h1>
        <p class="subtitle">Discover and explore GitHub repositories</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <SearchForm 
          @search="handleSearch" 
          :loading="loading"
          :initial-query="searchQuery"
        />
        
        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
          <button @click="retrySearch" class="retry-btn">
            🔄 Retry
          </button>
        </div>

        <SearchResults 
          v-if="repositories.length > 0 || (searchPerformed && !loading)"
          :repositories="repositories"
          :total-count="totalCount"
          :loading="loading"
        />

        <Pagination
          v-if="repositories.length > 0 && !loading"
          :current-page="currentPage"
          :total-count="totalCount"
          :per-page="perPage"
          @page-change="handlePageChange"
        />

        <div v-if="!searchPerformed && !loading" class="welcome-state">
          🐙
          <h2>Welcome to GitHub Repository Search</h2>
          <p>Search through millions of GitHub repositories to find the perfect project for your needs.</p>
          <ul class="features">
            <li>🔍 Search by repository name, description, or keywords</li>
            <li>⭐ View repository statistics like stars and forks</li>
            <li>💻 See the primary programming language</li>
            <li>🔗 Visit repositories directly on GitHub</li>
          </ul>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2024 GitHub Repository Search. Built with Vue 3.</p>
        <p class="api-note">
          Powered by the 
          <a href="https://api.github.com/search/repositories" target="_blank" rel="noopener">
            GitHub Search API
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'
import SearchForm from './components/SearchForm.vue'
import SearchResults from './components/SearchResults.vue'
import Pagination from './components/Pagination.vue'
import { searchRepositories } from './services/githubApi'

export default {
  name: 'App',
  components: {
    SearchForm,
    SearchResults,
    Pagination
  },
  setup() {
    const repositories = ref([])
    const loading = ref(false)
    const error = ref('')
    const totalCount = ref(0)
    const currentPage = ref(1)
    const perPage = ref(10)
    const searchQuery = ref('')
    const searchPerformed = ref(false)

    const handleSearch = async (query) => {
      if (!query.trim()) {
        repositories.value = []
        totalCount.value = 0
        searchPerformed.value = false
        return
      }

      loading.value = true
      error.value = ''
      currentPage.value = 1
      searchQuery.value = query
      searchPerformed.value = true

      try {
        const result = await searchRepositories(query, currentPage.value, perPage.value)
        repositories.value = result.items
        totalCount.value = result.total_count
      } catch (err) {
        error.value = err.message || 'An error occurred while searching repositories'
        repositories.value = []
        totalCount.value = 0
      } finally {
        loading.value = false
      }
    }

    const handlePageChange = async (page) => {
      if (!searchQuery.value) return

      loading.value = true
      error.value = ''
      currentPage.value = page

      try {
        const result = await searchRepositories(searchQuery.value, page, perPage.value)
        repositories.value = result.items
        totalCount.value = result.total_count
        
        // Scroll to top of results
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        error.value = err.message || 'An error occurred while loading more results'
      } finally {
        loading.value = false
      }
    }

    const retrySearch = () => {
      if (searchQuery.value) {
        handleSearch(searchQuery.value)
      }
    }

    return {
      repositories,
      loading,
      error,
      totalCount,
      currentPage,
      perPage,
      searchQuery,
      searchPerformed,
      handleSearch,
      handlePageChange,
      retrySearch
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #24292e;
  background-color: #f6f8fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.app-header {
  background: linear-gradient(135deg, #24292e 0%, #2f363d 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: #ffeaea;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  margin-left: auto;
}

.retry-btn:hover {
  background-color: #c82333;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: #586069;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #24292e;
}

.welcome-state {
  text-align: center;
  padding: 3rem 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.welcome-state h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #24292e;
}

.welcome-state p {
  font-size: 1.1rem;
  color: #586069;
  margin-bottom: 2rem;
}

.features {
  text-align: left;
  list-style: none;
  margin-top: 2rem;
}

.features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  font-size: 1rem;
  color: #24292e;
}

.app-footer {
  background-color: #24292e;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
}

.app-footer p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.api-note a {
  color: #79b8ff;
  text-decoration: none;
}

.api-note a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .main-content {
    padding: 1rem 0;
  }
  
  .error-message {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .retry-btn {
    margin-left: 0;
    align-self: flex-end;
  }
  
  .welcome-state h2 {
    font-size: 1.5rem;
  }
  
  .features {
    margin-top: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }
  
  .app-header {
    padding: 1.5rem 0;
  }
  
  .app-header h1 {
    font-size: 1.75rem;
  }
  
  .welcome-state {
    padding: 2rem 0.5rem;
  }
}
</style>
