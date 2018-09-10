import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLoading: false,
  quizData: null,
}
const actions = {
  fetchData ({ commit }) {
      commit('MAKE_GQL_QUERY', {
        url: 'http://localhost:4000/graphql',
        query: QUERY('5b930f393f9082129af6bc74')
    })
  }
}
const mutations = {
  async MAKE_GQL_QUERY (state, { url, query }) {
      state.isLoading = true;
      const graphqlFetch = async () => {
          const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            referrer: "no-referrer", // no-referrer, *client
            method: 'POST',
            body: JSON.stringify({ query })
          });
        return res;
      }
      const fetchedData = await graphqlFetch();
      const data = await fetchedData.json();
      state.quizData = data.data;
      state.isLoading = false;
  }
}
export default new Vuex.Store({
  mutations,
  state,
  actions
})

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
