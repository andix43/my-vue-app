<template>
  <div class="app-container">
    <h1>Dynamic Table-Data Explorer</h1>
    <div class="controls">
      <div class="search-control">
        <label for="search">Search by ID:</label>
        <input
          id="search"
          v-model="searchTerm"
          type="text"
          placeholder="Enter ID..."
        />
      </div>
      
      <div class="filter-controls">
        <label>Filter Column:</label>
        <select v-model="numericFilter.column">
          <option value="">Select column</option>
          <option value="baseMean">baseMean</option>
          <option value="log2FoldChange">log2FoldChange</option>
          <option value="lfcSE">lfcSE</option>
          <option value="stat">stat</option>
          <option value="pvalue">pvalue</option>
          <option value="padj">padj</option>
        </select>
        
        <select v-model="numericFilter.operator">
          <option value=">">Greater than</option>
          <option value="<">Less than</option>
          <option value="=">Equal to</option>
        </select>
        
        <input
          v-model.number="numericFilter.value"
          type="number"
          placeholder="Filter value"
          step="any"
        />
      </div>
    </div>

    <DataTable
      :items="paginatedItems"
      :sort-key="sortKey"
      :sort-direction="sortDirection"
      @sort="handleSort"
    />

    <PaginationControls
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :total-items="filteredItems.length"
      @page-change="handlePageChange"
      @items-per-page-change="handleItemsPerPageChange"
    />
  </div>
</template>

<script>
import DataTable from './components/DataTable.vue'
import PaginationControls from './components/PaginationControls.vue'
import sampleData from './data/sampleData.js'
import {compareValues} from './utils/sortHelpers.js'

export default {
  components: {
    DataTable,
    PaginationControls
  },
  data() {
    return {
      items: [],
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: 'ID',
      sortDirection: 'asc',
      searchTerm: '',
      numericFilter: {
        operator: '>',
        value: null
      }
    }
  },
  computed: {
    filteredItems() {
      let filtered = [...this.items]
      
      // Apply search filter
      if (this.searchTerm) {
        filtered = filtered.filter(item => 
          item.ID.toString().includes(this.searchTerm)
        )
      }
      
      // Apply age filter if value is provided
      if (this.numericFilter.column && this.numericFilter.value !== null) {
        filtered = filtered.filter(item => {
          const columnValue = Number(item[this.numericFilter.column])
          if (isNaN(columnValue)) return false
          switch (this.numericFilter.operator) {
            case '>': return columnValue > this.numericFilter.value
            case '<': return columnValue < this.numericFilter.value
            case '=': return columnValue === this.numericFilter.value
            default: return true
          }
        })
      }
      
      // Apply sorting
      return filtered.sort((a, b) => {
        return compareValues(a[this.sortKey], b[this.sortKey], this.sortDirection)
      })
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredItems.slice(start, end)
    }
  },
  methods: {
    handleSort(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortDirection = 'asc'
      }
      this.currentPage = 1 // Reset to first page when sorting changes
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleItemsPerPageChange(itemsPerPage) {
      this.itemsPerPage = itemsPerPage
      this.currentPage = 1 // Reset to first page when items per page changes
    },
    sampleData() {
      this.items = sampleData

      console.log('Sample data loaded:', this.items)
    }
  },
  created() {
    this.sampleData()
  }
}
</script>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.search-control, .filter-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Add this to your existing styles */
.filter-controls select {
  min-width: 120px; /* Give enough space for column names */
}

.filter-controls input[type="number"] {
  width: 100px; /* Consistent width for number input */
}

/* Keep all your existing styles below */
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

input, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

label {
  font-weight: bold;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}
</style>