<template>
  <!-- Root element of the Checkout-Cart component -->
  <div>
    <!-- Title for the cart section -->
    <h2>Your Cart</h2>
    <!-- Iterate over each lesson in the cart -->
    <div v-for="lesson in cart" :key="lesson._id" class="cart-item">
      <!-- Display lesson subject -->
      <h3>{{ lesson.subject }}</h3>
      <!-- Display lesson location -->
      <p>Location: {{ lesson.location }}</p>
      <!-- Button to remove lesson from cart -->
      <button @click="removeFromCart(lesson._id)">Remove</button>
    </div>
    <!-- Section for customer details -->
    <div class="customer-details">
      <!-- Title for customer details section -->
      <h2>Customer Details</h2>
      <!-- Input field for customer name -->
      <input type="text" placeholder="Name" v-model="name">
      <!-- Input field for customer phone number -->
      <input type="text" placeholder="Phone" v-model="phone">
      <!-- Button to place order -->
      <button @click="placeOrder">Place Order</button>
    </div>
  </div>
</template>

<script>
// Exporting the Checkout-Cart component
export default {
  // Name of the component
  name: 'Checkout-Cart',
  // Props received by the component
  props: ['cart'],
  // Data properties of the component
  data() {
    return {
      // Initialize name and phone data properties
      name: '',
      phone: ''
    };
  },
  // Methods used by the component
  methods: {
    // Method to remove lesson from cart
    removeFromCart(lessonId) {
      this.$emit('remove-from-cart', lessonId);
    },
    // Method to place order
    placeOrder() {
      // Check if name and phone are provided
      if (this.name && this.phone) {
        // Emit place-order event with customer details
        this.$emit('place-order', { name: this.name, phone: this.phone });
      } else {
        // Alert if name or phone is missing
        alert('Please enter your name and phone number.');
      }
    }
  }
}
</script>

<style scoped>
/* Scoped CSS styles for the Checkout-Cart component */
.cart-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

.cart-item button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.customer-details {
  margin-top: 20px;
}

.customer-details input {
  margin: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.customer-details button {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.customer-details button:hover {
  background-color: #0056b3;
}
</style>
