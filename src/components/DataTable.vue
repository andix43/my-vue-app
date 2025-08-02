<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th @click="$emit('sort', 'ID')">
            ID
            <span v-if="sortKey === 'ID'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="$emit('sort', 'baseMean')">
            baseMean
            <span v-if="sortKey === 'baseMean'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="$emit('sort', 'log2FoldChange')">
            log2FoldChange
            <span v-if="sortKey === 'log2FoldChange'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="$emit('sort', 'lfcSE')">
            lfcSE
            <span v-if="sortKey === 'lfcSE'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="$emit('sort', 'stat')">
            stat
            <span v-if="sortKey === 'stat'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="$emit('sort', 'pvalue')">
            pvalue
            <span v-if="sortKey === 'pvalue'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th @click="$emit('sort', 'padj')">
            padj
            <span v-if="sortKey === 'padj'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.ID">
          <td>{{ item.ID }}</td>
          <td>{{ formatValue(item.baseMean) }}</td>
          <td>{{ formatValue(item.log2FoldChange) }}</td>
          <td>{{ formatValue(item.lfcSE) }}</td>
          <td>{{ formatValue(item.stat) }}</td>
          <td>{{ formatValue(item.pvalue) }}</td>
          <td>{{ formatValue(item.padj) }}</td>
        </tr>
        <tr v-if="items.length === 0">
          <td colspan="7" class="no-results">No results found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    sortKey: {
      type: String,
      required: true
    },
    sortDirection: {
      type: String,
      required: true
    }
    // Removed currentPage and itemsPerPage as they belong in PaginationControls
  },
  methods: {
    formatValue(value) {
      if (value === undefined || value === null || value ==='NA') {
        return 'NA'
      }
      return Number.isNaN(Number(value)) ? value : Number(value)
    }
  }
}
</script>

<style scoped>
/* Your existing styles are fine, keep them */
.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  cursor: pointer;
  user-select: none;
  position: relative;
}

th:hover {
  background-color: #e9ecef;
}

span {
  margin-left: 5px;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>