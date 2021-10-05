import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
/**Vuen tarvitsemat tiedot exportattuna kuten ostoskori ja tuotteet, sekä niiden tarvitsemat funktiot
 */
export default new Vuex.Store({
  state: {
    cart: [ ],
    products: [],
    userInfo: {
      loggedIn: false,
      loggedUsername: "",
      loggedEmail: "",
    },
    price: null,
  },
  /**Tuotteisiin ja ostoskoriin liittyvät funktiot
   * @method setProducts tuotteiden asettelu
   * @param {object} products
   * @method addToCart ostoskoriin lisääminen
   * @method removeFromCart ostoskorista poistaminen
   * @method inventaarion vähennys decrementProductInventory
   * @method inventaarion lisääminen incrementProductInventory
   * @param state ja products ovat vuen tarvitsemia parametrejä
  */

  mutations: {
    setProducts (state, products) {
      state.products = products;
    },
    addToCart (state, payload) {
      state.cart.push( Number(payload) )
    },
    removeFromCart (state, payload) {
      let indexToDelete = state.cart.indexOf( Number(payload) );
      state.cart.splice(indexToDelete, 1)
    },
    setPrice(state, price) {
      state.price = price;
    },
  },
  /**API:stä tuotteiden tuomiseen tarvittavat funktiot asynkronointia käyttäen
  * @param {object} store
  * @async
  * @method fetchProducts
  * @returns {json} fetchProducts palauttaa tuotteet API:sta json:ina
   */
  actions: {
    async fetchProducts(store) {
      const response = await fetch('http://localhost:8081/products');
      const products = await response.json();
      store.commit('setProducts', products);
      return store.state.products;
    },
    /** tuotteen ostoskoriin lisääminen ja poistaminen tietokanta muutokset
    * @method addToCart
     * @method removeFromCart
     */
    addToCart({ commit }, payload) {
      commit('addToCart', payload);
    },
    removeFromCart({ commit }, payload) {
      commit('removeFromCart', payload);
    }
  },
  /** Getterit
  * @method product hakee tuotteet id:llä
  * @method cartItems hakee ostoskorin sisällön
  * @param {number} id
  * @returns {id} product palauttaa tuotteen ID:n
  * @returns {id} cartItems palauttaa ostoskorin sisällön tuotteiden id:ineen
  *
   */
  getters: {
    product: (state) => (id) => {
      return state.products.filter(p => p.Product_id === Number(id))[0]
    },
    cartItems: (state) => {
      return state.cart.map(
          itemId => state.products.find(
              product => product.Product_id === itemId
          )
      )
    },
    /** Tuotteilla on boolean featured
    * @method featuredProducts filtteröi tuotteet joiden featured boolean on totta jotta ne voidaan asettaa sivun etusivulle
     */
    featuredProducts: (state) => {
      return state.products.filter(product => product.Featured === 1);
    },

    /** Hakee kategorian mukaan tuotteet
     * @method productsByCategory filtteröi tuotteet kategorian mukaan jolloin ne voidaan asetella kategoriaa vastaavillesivuille
     * @params {string} category
     * @return palauttaa tuotteet jotka vastaavat haetun kategorian kriteetejä
     * @param state
     */
    productsByCategory: (state) => (category) => {
      if(category < 5)
        return state.products.filter(p => p.Category_id === category);
      else
        return state.products.filter(p => p.Category_id > 4);
    },
    loggedUserEmailGetter: (state) => {
      return state.userInfo.loggedEmail;
    },
    loggedUserNameGetter: (state) => {
      return state.userInfo.loggedUsername;
    },
    loggedInGetter: (state) => {
      return state.userInfo.loggedIn;
    },
  }
});