<template>
  <div class="pagination" v-if="totalPages > 1">
    <button 
      @click="goToPage(1)"
      :disabled="currentPage === 1"
      class="pagination-btn"
      title="First page"
    >
      ⏮️
    </button>
    
    <button 
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="pagination-btn"
      title="Previous page"
    >
      ⬅️
    </button>

    <div class="page-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="['page-btn', { active: page === currentPage, ellipsis: page === '...' }]"
        :disabled="page === '...'"
      >
        {{ page }}
      </button>
    </div>

    <button 
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="pagination-btn"
      title="Next page"
    >
      ➡️
    </button>

    <button 
      @click="goToPage(totalPages)"
      :disabled="currentPage === totalPages"
      class="pagination-btn"
      title="Last page"
    >
      ⏭️
    </button>

    <div class="pagination-info">
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <span class="total-results">({{ totalCount.toLocaleString() }} results)</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 10
    }
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const totalPages = computed(() => {
      return Math.ceil(props.totalCount / props.perPage)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = props.currentPage

      if (total <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // Always show first page
        pages.push(1)

        if (current > 4) {
          pages.push('...')
        }

        // Show pages around current page
        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)

        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== total) {
            pages.push(i)
          }
        }

        if (current < total - 3) {
          pages.push('...')
        }

        // Always show last page
        if (total > 1) {
          pages.push(total)
        }
      }

      return pages
    })

    const goToPage = (page) => {
      if (page !== props.currentPage && page >= 1 && page <= totalPages.value) {
        emit('page-change', page)
      }
    }

    return {
      totalPages,
      visiblePages,
      goToPage
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e1e4e8;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f6f8fa;
  border-color: #0366d6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  align-items: center;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 0.5rem;
  border: 1px solid #e1e4e8;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.page-btn:hover:not(:disabled):not(.active) {
  background-color: #f6f8fa;
  border-color: #0366d6;
}

.page-btn.active {
  background-color: #0366d6;
  color: white;
  border-color: #0366d6;
}

.page-btn.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
  font-weight: normal;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #586069;
  text-align: center;
}

.total-results {
  font-size: 0.8rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .pagination {
    padding: 0 1rem;
  }
  
  .pagination-btn {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
  
  .page-btn {
    min-width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }
  
  .page-numbers {
    gap: 0.125rem;
  }
}

@media (max-width: 480px) {
  .page-numbers {
    max-width: 100%;
    overflow-x: auto;
    padding: 0.5rem 0;
  }
  
  .pagination-info {
    font-size: 0.8rem;
  }
  
  .total-results {
    font-size: 0.75rem;
  }
}
</style>