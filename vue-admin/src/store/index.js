import Vue from "vue";
import Vuex from "vuex";
import Cookie from "cookie_js";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
      isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false
    },
    getters: {
      // computed
      isCollapse: state => state.isCollapse
    },
    mutations: {
      SET_COLLAPSE(state){
        state.isCollapse = !state.isCollapse
        //html5本地存储
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
      },
      SET_COUNT(state, value){
        state.count = value
        // console.log(state.count)   
      }
    },
    actions: {}
});