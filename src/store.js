import Vue from 'vue'
import Vuex from 'vuex'
import { csvParse } from 'd3-dsv'
Vue.use(Vuex)

const state = {
  isLoading: false,
  quizData: null,
}
const actions = {
  fetchData ({ commit }) {
    commit('CSV_DATA');
    //commit('FAKE_DATA');
    //   commit('MAKE_GQL_QUERY', {
    //     url: 'http://localhost:4000/graphql',
    //     query: QUERY('5b930f393f9082129af6bc74')
    // })
  }
}
const mutations = {
  async CSV_DATA(state){
    state.isLoading = true;
    const scoreData = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRcB6J-KsftmFuygHudtucGSi5yjsMcjhSbtQGv4RohpoibjAmoipZN_AhQFbvzV_jwP3tZcsUxVYjc/pub?gid=1758770676&single=true&output=csv')
      .then(res => res.text())
      .then(res => csvParse(res))
      .then(data => {
        delete data.columns;
        return data.map(score => ({
          scoreRange: score.ScoreRange,
          scoreTitle: score.Title,
          scoreImage: score.ScoreImage,
          scoreDescription: score.Description,
      }))
    })
    const questionData =  await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRcB6J-KsftmFuygHudtucGSi5yjsMcjhSbtQGv4RohpoibjAmoipZN_AhQFbvzV_jwP3tZcsUxVYjc/pub?gid=0&single=true&output=csv')
      .then(res => res.text())
      .then(res => csvParse(res))
      .then(data => {
        delete data.columns
        const questions = data.map(question => {
          if (question.Question) {
            const options = Array.from(Array(parseInt(question.Options_Quantity)), (v, i) => ({
                "id": `optionID-${i+1}`,
                "optionText": question[`optionText-${i+1}`],
                "resultText": question[`resultText-${i+1}`],
                "correctOption": question[`isOptionCorrect-${i+1}`] === 'TRUE',
            }));
            return ({
                "id": "",
                "questionOrder": 1,
                "questionText": question.Question,
                "featureImage": question.Question_Feature_Image,
                "options" : options,
            })
          }
        })
        return { "quiz": {
            "id": "5b930f393f9082129af6bc74",
            "description": "",
            "featureImage": "",
            "questions": questions,
            "scorePage": scoreData,
        }
       }
     })
    state.quizData = questionData.quiz;
    state.isLoading = false;
  },
  async FAKE_DATA(state){
    state.isLoading = true;
    const allData = require('./assets/fake.json')
    state.quizData = allData.data.quiz;
    state.isLoading = false;
  },
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
      state.quizData = data.data.quiz;
      state.isLoading = false;
  }
}
export default new Vuex.Store({
  mutations,
  state,
  actions
})
//
// const QUERY = (id) => `
// query {
//   quiz: getQuizById( id: "${id}" ){
//     id
//     description
//     featureImage
//     questions {
//       id
//       questionOrder
//       questionText
//       featureImage
//       options{
//         id
//         optionText
//         resultText
//         correctOption
//       }
//     }
//   }
// }
// `
