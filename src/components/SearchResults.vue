<template>
  <div class="search-results">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Searching repositories...</p>
    </div>

    <div v-else-if="repositories.length > 0">
      <div class="results-header">
        <h2>Search Results</h2>
        <p class="results-count">
          Found {{ totalCount.toLocaleString() }} repositories
        </p>
      </div>

      <div class="repositories-grid">
        <RepositoryCard
          v-for="repo in repositories"
          :key="repo.id"
          :repository="repo"
        />
      </div>
    </div>

    <div v-else-if="!loading && repositories.length === 0 && hasSearched" class="no-results">
      <div class="no-results-icon">📂</div>
      <h3>No repositories found</h3>
      <p>Try adjusting your search terms or check for typos.</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import RepositoryCard from './RepositoryCard.vue'

export default {
  name: 'SearchResults',
  components: {
    RepositoryCard
  },
  props: {
    repositories: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const hasSearched = computed(() => {
      return props.repositories.length > 0 || (!props.loading && props.totalCount === 0)
    })

    return {
      hasSearched
    }
  }
}
</script>

<style scoped>
.search-results {
  margin-top: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e1e4e8;
  border-top: 4px solid #0366d6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.results-header {
  margin-bottom: 2rem;
  text-align: center;
}

.results-header h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #24292e;
}

.results-count {
  color: #586069;
  font-size: 1rem;
}

.repositories-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: #586069;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #24292e;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1200px) {
  .repositories-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .results-header h2 {
    font-size: 1.5rem;
  }
  
  .no-results {
    padding: 2rem 1rem;
  }
  
  .no-results-icon {
    font-size: 3rem;
  }
}
</style>