<template>
  <div class="repository-card">
    <div class="card-header">
      <div class="repo-info">
        <h3 class="repo-name">
          <a :href="repository.html_url" target="_blank" rel="noopener noreferrer">
            {{ repository.full_name }}
          </a>
        </h3>
        <div class="repo-meta">
          <span class="repo-owner">
            <img :src="repository.owner.avatar_url" :alt="repository.owner.login" class="avatar">
            {{ repository.owner.login }}
          </span>
          <span class="repo-visibility" :class="repository.private ? 'private' : 'public'">
            {{ repository.private ? '🔒 Private' : '📖 Public' }}
          </span>
        </div>
      </div>
    </div>

    <div class="card-body">
      <p class="repo-description" v-if="repository.description">
        {{ repository.description }}
      </p>
      <p class="no-description" v-else>
        No description available
      </p>

      <div class="repo-stats">
        <div class="stat-item">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{{ formatNumber(repository.stargazers_count) }}</span>
          <span class="stat-label">stars</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🍴</span>
          <span class="stat-value">{{ formatNumber(repository.forks_count) }}</span>
          <span class="stat-label">forks</span>
        </div>
        <div class="stat-item" v-if="repository.open_issues_count">
          <span class="stat-icon">⚠️</span>
          <span class="stat-value">{{ formatNumber(repository.open_issues_count) }}</span>
          <span class="stat-label">issues</span>
        </div>
      </div>

      <div class="repo-details">
        <div class="detail-item" v-if="repository.language">
          <span class="language-dot" :style="{ backgroundColor: getLanguageColor(repository.language) }"></span>
          <span class="language-name">{{ repository.language }}</span>
        </div>
        <div class="detail-item" v-if="repository.license">
          <span class="license-icon">📄</span>
          <span class="license-name">{{ repository.license.name }}</span>
        </div>
        <div class="detail-item">
          <span class="date-icon">📅</span>
          <span class="update-date">Updated {{ formatDate(repository.updated_at) }}</span>
        </div>
      </div>

      <div class="repo-topics" v-if="repository.topics && repository.topics.length > 0">
        <span class="topic" v-for="topic in repository.topics.slice(0, 5)" :key="topic">
          {{ topic }}
        </span>
        <span v-if="repository.topics.length > 5" class="topic-more">
          +{{ repository.topics.length - 5 }} more
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RepositoryCard',
  props: {
    repository: {
      type: Object,
      required: true
    }
  },
  setup() {
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return '1 day ago'
      if (diffDays < 30) return `${diffDays} days ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
      return `${Math.floor(diffDays / 365)} years ago`
    }

    const getLanguageColor = (language) => {
      const colors = {
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        Python: '#3572A5',
        Java: '#b07219',
        'C++': '#f34b7d',
        'C#': '#239120',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Go: '#00ADD8',
        Rust: '#dea584',
        Swift: '#ffac45',
        Kotlin: '#F18E33',
        Dart: '#00B4AB',
        Vue: '#4FC08D',
        React: '#61DAFB',
        Angular: '#DD0031'
      }
      return colors[language] || '#586069'
    }

    return {
      formatNumber,
      formatDate,
      getLanguageColor
    }
  }
}
</script>

<style scoped>
.repository-card {
  background: white;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.repository-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #0366d6;
}

.card-header {
  margin-bottom: 1rem;
}

.repo-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.repo-name a {
  color: #0366d6;
  text-decoration: none;
  transition: color 0.2s ease;
}

.repo-name a:hover {
  color: #0256cc;
  text-decoration: underline;
}

.repo-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.repo-owner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #586069;
  font-size: 0.9rem;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.repo-visibility {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.repo-visibility.public {
  background-color: #e8f5e8;
  color: #28a745;
}

.repo-visibility.private {
  background-color: #fff3cd;
  color: #856404;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.repo-description {
  color: #586069;
  line-height: 1.5;
  margin: 0;
}

.no-description {
  color: #a0a0a0;
  font-style: italic;
  margin: 0;
}

.repo-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #586069;
  font-size: 0.9rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-value {
  font-weight: 600;
  color: #24292e;
}

.stat-label {
  color: #586069;
}

.repo-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #586069;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.language-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.repo-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topic {
  background-color: #f1f8ff;
  color: #0366d6;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #c8e1ff;
}

.topic-more {
  color: #586069;
  font-size: 0.8rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .repository-card {
    padding: 1rem;
  }
  
  .repo-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .repo-stats {
    gap: 1rem;
  }
  
  .repo-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>