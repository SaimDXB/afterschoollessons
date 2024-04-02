<template>
  <div class="lesson-list">
    <!-- Move the sorting and search controls above the lessons -->
    <div class="sort-container">
      <label>Sort by:</label>
      <select v-model="sortBy" @change="sortLessons">
        <option value="subject">Subject</option>
        <option value="location">Location</option>
        <option value="price">Price</option>
        <option value="spaces">Spaces</option>
      </select>

      <label>Order:</label>
      <select v-model="sortOrder" @change="sortLessons">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <label>Search:</label>
      <input type="text" v-model="searchQuery" @input="searchLessons" placeholder="Search lessons...">
    </div>

    <div v-if="filteredLessons.length === 0" class="no-results">No results found.</div>

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
export default {
  name: 'LessonList',
  props: ['lessons'],
  data() {
    return {
      sortBy: 'subject',
      sortOrder: 'asc',
      searchQuery: ''
    };
  },
  computed: {
    filteredLessons() {
      let filtered = this.lessons;

      // Sort lessons
      filtered.sort((a, b) => {
        if (this.sortBy === 'price' || this.sortBy === 'spaces') {
          if (this.sortOrder === 'asc') {
            return a[this.sortBy] - b[this.sortBy];
          } else {
            return b[this.sortBy] - a[this.sortBy];
          }
        } else {
          if (this.sortOrder === 'asc') {
            return a[this.sortBy].localeCompare(b[this.sortBy]);
          } else {
            return b[this.sortBy].localeCompare(a[this.sortBy]);
          }
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
  methods: {
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        this.$emit('add-to-cart', lesson);
      }
    },
    sortLessons() {
      // Sorting is handled in computed property
    },
    searchLessons() {
      // Searching is handled in computed property
    }
  }
};
</script>

<style scoped>
.lesson-list {
  margin-top: 20px; /* Added margin to match website layout */
}

.sort-container {
  margin-bottom: 20px; /* Increased margin for better separation */
}

.lesson-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 200px;
  display: inline-block; /* Adjusted to display lessons side by side */
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
