import productModal from './productModal.js';
import cart from './cart.js';

// VeeValidate 套件的規則
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
  components: {
    productModal,
    cart,
  },
  data() {
    return {
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      apiUrl: 'https://vue3-course-api.hexschool.io',
      apiPath: 'carriet',
      loadingStatus: {
        loadingItem: '',
        loadingAddCartItem: '',
      },
      products: [],
      product: {
        imagesUrl: [],
      },
      carts: {},
    }
  },
  methods: {
    getProducts() {
      axios.get(`${this.apiUrl}/v2/api/${this.apiPath}/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    productDetail(id) {
      this.loadingStatus.loadingItem = id;
      axios.get(`${this.apiUrl}/v2/api/${this.apiPath}/product/${id}`)
        .then((res) => {
          this.loadingStatus.loadingItem = '';
          this.product = res.data.product;
          this.$refs.productDetail.openModal();
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    addToCart(id, qty = 1) {
      this.loadingStatus.loadingAddCartItem = id;
      const cartData = {
        data: {
          product_id: id,
          qty,
        }
      }

      axios.post(`${this.apiUrl}/v2/api/${this.apiPath}/cart`, cartData)
        .then((res) => {
          // console.log(res.data.message);
          this.loadingStatus.loadingAddCartItem = '';
          alert(res.data.message);
          this.$refs.productDetail.closeModal();
          this.getCart();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getCart() {
      axios.get(`${this.apiUrl}/v2/api/${this.apiPath}/cart`)
        .then((res) => {
          this.carts = res.data.data;          
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    updateCart(item) {
      const cartProduct = {
        data: {
          product_id: item.product_id,
          qty: item.qty,
        }
      }
      axios.put(`${this.apiUrl}/v2/api/${this.apiPath}/cart/${item.id}`, cartProduct)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    delCartProduct(cartId) {
      this.loadingStatus.loadingItem = cartId;
      axios.delete(`${this.apiUrl}/v2/api/${this.apiPath}/cart/${cartId}`)
        .then((res) => {
          this.loadingStatus.loadingItem = '';
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    // 清空購物車
    clearCarts() {
      axios.delete(`${this.apiUrl}/v2/api/${this.apiPath}/carts`)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    onsubmit() {
      if (this.carts.carts.length === 0) {
        alert('請加入商品到購物車');
        return;
      }
      const url = `${this.apiUrl}/v2/api/${this.apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            //輸入完資料按送出訂單，購物車清空 ( 這邊的form 為VForm元件底下的方法clearForm )
            this.$refs.hivForm.resetForm();
            this.form.message = '';
            this.getCart();
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err.response.data.message);
        })
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

// VeeValidation
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');