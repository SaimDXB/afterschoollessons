<template>
  <!-- Root element of the Vue app -->
  
  <div id="app">
    <!-- Conditional rendering of LessonList or Checkout component based on showCheckout -->
    <LessonList v-if="!showCheckout" :lessons="lessons" @add-to-cart="addToCart"/>
    <Checkout v-else :cart="cart" @remove-from-cart="removeFromCart" @place-order="placeOrder"/>
    <!-- Button to toggle showing/hiding the cart -->
    <button @click="toggleCheckout" class="cart-btn">
      Cart <span v-if="cart.length">({{ cart.length }})</span>
    </button>
    <button v-if="showCheckout" @click="goToHome" class="home-btn">Home</button>
    <!-- Display total price of items in cart -->
    <div v-if="cart.length">
      <h2>Cart Total: ${{ calculateTotalPrice() }}</h2>
    </div>
  </div>
</template>

<script>
// Importing Vue components
import Checkout from './components/Checkout.vue';
import LessonList from './components/Lesson.vue';
import './main.js';

// Exporting the Vue app
export default {
  // Name of the Vue app
  name: 'App',
  // Components used in the Vue app
  components: {
    LessonList,
    Checkout
  },
  // Data properties of the Vue app
  data() {
    return {
      // Array to store lesson data
      lessons: [],
      // Array to store items added to cart
      cart: [],
      // Flag to toggle between LessonList and Checkout
      showCheckout: false,
      // API URL for fetching data
      apiUrl: 'http://localhost:3000/api/',
      // Initialize deferredPrompt to handle installation prompt
      deferredPrompt: null
    }
  },
  // Methods used in the Vue app
  methods: {
    // Method to add a lesson to the cart
    addToCart(lesson) {
      // Check if lesson has available spaces
      if (lesson.spaces > 0) {
        // Add lesson to cart if spaces available
        lesson.price = lesson.price || 0; // Set default price if not available
        this.cart.push(lesson);
      }
    },
    // Method to remove a lesson from the cart
    removeFromCart(lessonId) {
      const index = this.cart.findIndex(lesson => lesson._id === lessonId);
      if (index !== -1) {
        const removedLesson = this.cart[index];
        this.updateLessonSpaces(lessonId, removedLesson.spaces);
        this.cart.splice(index, 1);
      }
    },
    // Method to toggle between LessonList and Checkout
    toggleCheckout() {
      this.showCheckout = !this.showCheckout;
    },
    // Method to fetch lessons from the API
    async fetchLessons() {
      try {
        const response = await fetch(`${this.apiUrl}lessons`);
        const data = await response.json();
        this.lessons = data;
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    },
    // Method to update lesson spaces in the database
    async updateLessonSpaces(lessonId, increment) {
      try {
        const response = await fetch(`${this.apiUrl}lessons/${lessonId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ spaces: increment })
        });
        if (response.ok) {
          console.log(`Lesson spaces updated successfully for lessonId: ${lessonId}`);
        } else {
          console.error('Failed to update lesson spaces:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating lesson spaces:', error);
      }
    },
    // Method to place an order for lessons in the cart
    async placeOrder(order) {
      // Validate name and phone number before placing order
      if (!order.name.trim().match(/^[A-Za-z]+$/) || !order.phone.trim().match(/^[0-9]+$/)) {
        alert('Please enter a valid name (alphabets only) and phone number (numbers only).');
        return;
      }
      try {
        const response = await fetch(`${this.apiUrl}orders/place`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: order.name,
            phone: order.phone,
            lessonIds: this.cart.map(lesson => lesson._id),
          }),
        });
        const responseData = await response.json();
        if (response.ok) {
          // Clear cart and hide checkout on successful order placement
          this.cart = [];
          this.showCheckout = false;
          alert('Order placed successfully!');
          window.location.reload();
        } else {
          console.error('Failed to place order:', responseData.error);
          alert('There was an error placing the order.');
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('There was an error placing the order.');
      }
    },
    // Method to navigate back to home
    goToHome() {
      this.showCheckout = false;
      window.location.reload();
    },
    // Method to handle installation of the app
    installApp() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          // Reset the deferredPrompt variable
          this.deferredPrompt = null;
        });
      }
    },
    // Method to calculate total price of items in cart
    calculateTotalPrice() {
      return this.cart.reduce((total, lesson) => {
        return total + lesson.price;
      }, 0).toFixed(2);
    }
  },
  // Lifecycle hook to run code after the Vue app has been mounted
  mounted() {
    // Attach event listener for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the default behavior
      event.preventDefault();
      
      // Store the event for later use
      this.deferredPrompt = event;
      console.log('beforeinstallprompt event triggered');
    });
    
    // Fetch lessons when the component is mounted
    this.fetchLessons();
  }
}
</script>

<style>
/* CSS styles for the app */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.cart-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cart-btn:hover {
  background-color: #0056b3;
}

.install-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.install-btn:hover {
  background-color: #218838;
}

.home-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.home-btn:hover {
  background-color: #bd2130;
}
</style>
