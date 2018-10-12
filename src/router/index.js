import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// eslint-disable-next-line no-new
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL
})

export default router
