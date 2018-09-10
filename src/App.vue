<template>
  <div class="container-fluid" id="app">
    <h1>HAHAH testing</h1>

    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

const QUERY = (id) => `
query {
  quiz: getQuizById( id: "${id}" ){
    id
    description
    featureImage
    questions {
      id
      questionOrder
      questionText
      featureImage
      options{
        id
        optionText
        resultText
        correctOption
      }
    }
  }
}
`
export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data() {
    return {
      data : null,
      loading: false
    }
  },
  created() {
    this.makeGraphQLQuery('http://localhost:4000/graphql', QUERY('5b930f393f9082129af6bc74'))
  },
  methods: {
      async  makeGraphQLQuery (serverURL, query) {
        this.loading = true;
        const graphqlFetch = async () => {
            const res = await fetch(serverURL, {
              headers: { 'Content-Type': 'application/json' },
              referrer: "no-referrer", // no-referrer, *client
              method: 'POST',
              body: JSON.stringify({ query })
            });
          return res;
        }
        const fetchedData = await graphqlFetch();
        const data = await fetchedData.json();
        this.data = data.data;
        this.loading = false;
    }
  }
}
</script>

<style lang="scss">
@import "./styles/custom";

</style>
