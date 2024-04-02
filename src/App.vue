<template>
  <div id="app">
    <LessonList v-if="!showCheckout" :lessons="lessons" @add-to-cart="addToCart"/>
    <Checkout v-else :cart="cart" @remove-from-cart="removeFromCart" @place-order="placeOrder"/>
    <button @click="toggleCheckout" class="cart-btn">
      Cart <span v-if="cart.length">({{ cart.length }})</span>
    </button>
    <button @click="installApp" class="install-btn">Install</button>
    <button v-if="showCheckout" @click="goToHome" class="home-btn">Home</button>
  </div>
</template>

<script>
import Checkout from './components/Checkout.vue';
import LessonList from './components/Lesson.vue';

export default {
  name: 'App',
  components: {
    LessonList,
    Checkout
  },
  data() {
    return {
      lessons: [],
      cart: [],
      showCheckout: false,
      apiUrl: 'http://localhost:3000/api/',
      deferredPrompt: null // Initialize deferredPrompt here
    }
  },
  methods: {
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        this.cart.push(lesson);
      }
    },
    removeFromCart(lessonId) {
      const index = this.cart.findIndex(lesson => lesson._id === lessonId);
      if (index !== -1) {
        const removedLesson = this.cart[index];
        this.updateLessonSpaces(lessonId, removedLesson.spaces);
        this.cart.splice(index, 1);
      }
    },
    toggleCheckout() {
      this.showCheckout = !this.showCheckout;
    },
    async fetchLessons() {
      try {
        const response = await fetch(`${this.apiUrl}lessons`);
        const data = await response.json();
        this.lessons = data;
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    },
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
    async placeOrder(order) {
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
    goToHome() {
      this.showCheckout = false;
      window.location.reload();
    },
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
          this.deferredPrompt = null; // Update the value in the component's data
        });
      }
    }
  },
  mounted() {
    // Remove event.preventDefault() from here
    this.fetchLessons();
  }
}
</script>

<style>
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
