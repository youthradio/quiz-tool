<template>
  <div
    id="app"
    class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 mx-auto">
        <QuizFront/>
      </div>
    </div>
  </div>
</template>

<script>
import QuizFront from './components/QuizFront.vue'

export default {
  name: 'App',
  components: {
    QuizFront
  },
  data() {
    return {
    }
  },
  created() {
    this.$store.dispatch('fetchData');
  },
  methods: {

  }
}
</script>

<style lang="scss">
@import "./styles/custom";

</style>
