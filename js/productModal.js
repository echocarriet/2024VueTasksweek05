export default {
  props: ['product'],
  data() {
    return {
      bsModal: null,
      qty: 1,
    }
  },
  methods: {
    openModal() {
      this.bsModal.show();
    },
    closeModal() {
      this.bsModal.hide();
    }
  },
  mounted() {
    this.bsModal = new bootstrap.Modal(this.$refs.productDetail,
      {
        keyboard: false,
        backdrop: 'static'
      });
  },
  template: `
  <div class="modal fade" ref="productDetail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-dark">
          <h1 class="modal-title fs-5 text-white" id="exampleModalLabel">{{product.title}}</h1>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="product.imageUrl" :alt="product.title" />
            </div>
            <div class="col-sm-6">
              <span class="badge text-bg-primary">{{product.category}}</span>
              <p>商品描述: {{product.description}}</p>
              <p>商品內容:{{product.content}}</p>
              <del class="h6">原價 {{product.origin_price}} 元</del>
              <p class="h5">現在只要 {{product.price}} 元</p>
              <div className="input-group">
                <input class="form-control" type="number" min="1" v-model.number="qty" />
                <button class="btn btn-primary"
                @click.prevent="$emit('addToCart', product.id, qty)">
                加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
}