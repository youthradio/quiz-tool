<template>
  <div class="container-fluid" id="app">
    <div class="row">
      <div class="col-12 col-md-6 mx-auto">
        <h1>Quiz</h1>
        <QuizFront msg="Welcome to Your Vue.js App"/>
      </div>
    </div>
  </div>
</template>

<script>
import QuizFront from './components/QuizFront.vue'

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
    QuizFront
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
