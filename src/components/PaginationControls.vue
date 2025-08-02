<template>
  <div class="pagination-controls">
    <div class="items-per-page">
      <label>Items per page:</label>
      <select v-model="localItemsPerPage" @change="handleItemsPerPageChange">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
    
    <div class="page-buttons">
      <button 
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      
      <span 
        v-for="page in visiblePages" 
        :key="page"
        @click="handlePageChange(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </span>
      
      <button 
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
    
    <div class="page-info">
      Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} items
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      localItemsPerPage: this.itemsPerPage
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },
    endItem() {
      const end = this.currentPage * this.itemsPerPage
      return end > this.totalItems ? this.totalItems : end
    },
    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  },
  methods: {
    handlePageChange(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-change', page)
      }
    },
    handleItemsPerPageChange() {
      this.$emit('items-per-page-change', parseInt(this.localItemsPerPage))
    }
  },
  watch: {
    itemsPerPage(newVal) {
      this.localItemsPerPage = newVal
    }
  }
}
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.items-per-page, .page-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-buttons {
  display: flex;
  gap: 5px;
}

button {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

span {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

span.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>