<template>
  <!-- Root element of the LessonList component -->
  <div class="lesson-list">
    <!-- Container for sorting and search controls -->
    <div class="sort-container">
      <!-- Dropdown for sorting lessons -->
      <label>Sort by:</label>
      <select v-model="sortBy" @change="sortLessons">
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="spaces">Spaces</option>
      </select>

      <!-- Dropdown for sorting order -->
      <label>Order:</label>
      <select v-model="sortOrder" @change="sortLessons">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <!-- Search input for filtering lessons -->
      <label>Search:</label>
      <input type="text" v-model="searchQuery" @input="searchLessons" placeholder="Search lessons...">
    </div>

    <!-- Display message if no results found -->
    <div v-if="filteredLessons.length === 0" class="no-results">No results found.</div>

    <!-- Iterate over filtered lessons and display each lesson -->
    <div v-for="lesson in filteredLessons" :key="lesson._id" class="lesson-item">
      <h3>{{ lesson.subject }}</h3>
      <p>Location: {{ lesson.location }}</p>
      <p v-if="lesson.spaces > 0">Spaces Available: {{ lesson.spaces }}</p>
      <p v-else>Sorry, no spaces available</p>
      <p>Price: {{ lesson.price }}</p>
      <img :src="lesson.image" alt="Lesson Image" class="lesson-image">
      <button @click="addToCart(lesson)" :disabled="lesson.spaces <= 0">Add to Cart</button>
    </div>
  </div>
</template>

<script>
// Exporting the LessonList component
export default {
  // Name of the component
  name: 'LessonList',
  // Props received by the component
  props: ['lessons'],
  // Data properties of the component
  data() {
    return {
      // Initial sort by subject and ascending order
      sortBy: 'subject',
      sortOrder: 'asc',
      // Search query string
      searchQuery: ''
    };
  },
  // Computed properties for filtered lessons
  computed: {
    filteredLessons() {
      // Start with all lessons
      let filtered = this.lessons;

      // Sort lessons based on selected criteria
      filtered.sort((a, b) => {
        // Sort by price or spaces
        if (this.sortBy === 'price' || this.sortBy === 'spaces') {
          return (this.sortOrder === 'asc') ? a[this.sortBy] - b[this.sortBy] : b[this.sortBy] - a[this.sortBy];
        } else {
          // Sort alphabetically
          return (this.sortOrder === 'asc') ? a[this.sortBy].localeCompare(b[this.sortBy]) : b[this.sortBy].localeCompare(a[this.sortBy]);
        }
      });

      // Filter lessons based on search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(lesson =>
          lesson.subject.toLowerCase().includes(query) ||
          lesson.location.toLowerCase().includes(query)
        );
      }

      return filtered;
    }
  },
  // Methods used by the component
  methods: {
    // Method to add a lesson to the cart
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        this.$emit('add-to-cart', lesson);
      }
    },
    // Method to handle sorting of lessons
    sortLessons() {
      // Sorting is handled in computed property
    },
    // Method to handle searching of lessons
    searchLessons() {
      // Searching is handled in computed property
    }
  }
};
</script>

<style scoped>
/* Scoped CSS styles for the LessonList component */
.lesson-list {
  margin-top: 20px;
}

.sort-container {
  margin-bottom: 20px;
}

.lesson-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 200px;
  display: inline-block;
}

.lesson-image {
  max-width: 100%;
  height: auto;
}

.lesson-item button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.lesson-item button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.no-results {
  margin-top: 10px;
  text-align: center;
  width: 100%;
}
</style>
