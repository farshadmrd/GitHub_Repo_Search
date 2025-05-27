<template>
  <div class="search-form">
    <form @submit.prevent="handleSubmit" class="search-container">
      <div class="input-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search repositories (e.g., vue, react, nodejs...)"
          class="search-input"
          :disabled="loading"
        />
        <button 
          type="submit" 
          class="search-button"
          :disabled="loading || !searchQuery.trim()"
        >
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>🔍</span>
          {{ loading ? 'Searching...' : 'Search' }}
        </button>
      </div>
    </form>
    
    <div class="search-tips">
      <p><strong>Search tips:</strong> Try searching for programming languages, frameworks, or specific project names</p>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'SearchForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    initialQuery: {
      type: String,
      default: ''
    }
  },
  emits: ['search'],
  setup(props, { emit }) {
    const searchQuery = ref(props.initialQuery)

    // Watch for changes in initialQuery prop
    watch(() => props.initialQuery, (newQuery) => {
      searchQuery.value = newQuery
    })

    const handleSubmit = () => {
      if (searchQuery.value.trim()) {
        emit('search', searchQuery.value.trim())
      }
    }

    return {
      searchQuery,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.search-form {
  margin-bottom: 2rem;
}

.search-container {
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  gap: 0;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e1e4e8;
  border-right: none;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #0366d6;
}

.search-input:disabled {
  background-color: #f6f8fa;
  cursor: not-allowed;
}

.search-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #0366d6 0%, #0256cc 100%);
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
}

.search-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #0256cc 0%, #044289 100%);
  transform: translateY(-1px);
}

.search-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.search-tips {
  text-align: center;
  color: #586069;
  font-size: 0.9rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
    max-width: 100%;
  }
  
  .search-input {
    border-right: 2px solid #e1e4e8;
    border-bottom: none;
  }
  
  .search-input:focus {
    border-color: #0366d6;
  }
}
</style>