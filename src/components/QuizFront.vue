<template>
<div class="row">
  <div class="col-12 col-md-12 mx-auto">

    <div class="position-relative w-100">
      <span class="num"><h1>1</h1></span>
      <img class="img-fluid w-100" :src=" isLoading ? 'null' : quizCurrQuestion.featureImage">
      <div class="texture-back"> </div>
    </div>
    <div class="bodyQ">
      <div class="card my-3">
        <div class="p-2">
          {{ isLoading ? 'Loading...' : quizCurrQuestion.questionText }}
        </div>
      </div>
      <template v-if="!isLoading">
        <button v-for="(option, index) in quizCurrQuestion.options" :key="option.id" type="button" :class="[clickedOption === index? 'active' : '','btn btn-outline-secondary btn-block']" @click="processResponse(index)">{{ option.optionText }}</button>
      </template>
      <template v-else>
        <button type="button" class="btn btn-outline-secondary btn-block">Loading...</button>
      </template>
      <template v-if="response">
        <div class="row mb-5">
          <div class="col">
            <p class="mt-2">
              <span class="answer font-weight-bold "> {{ questionResult.yesNo }} </span> {{questionResult.resultText}}
            </p>
              <div class="text-right pulse">
                <span class="icon-arrow-right arrow"></span>
              </div>
          </div>

        </div>
      </template>

    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'QuizFront',
  data() {
    return {
      response: false,
      currQuestionCounter: 0,
      questionResult: {},
      clickedOption: -1,
    }
  },
  methods: {
    processResponse(index) {
      if(this.clickedOption < 0){
        this.clickedOption = index;
        if(this.quizCurrQuestion.options[index].correctOption){
          this.questionResult.yesNo = "Yes"
          this.questionResult.resultText = this.quizCurrQuestion.options[index].resultText
        }else{
          this.questionResult.yesNo = "No"
          this.questionResult.resultText = this.quizCurrQuestion.options[index].resultText
        }
        this.response = true;
      }
    }
  },
  computed: {
    isLoading(){
      return this.$store.state.isLoading;
    },
    quizData() {
      return this.$store.state.quizData;
    },
    quizQuestions() {
      if(!this.isLoading){
        return this.$store.state.quizData.questions;
      }
    },
    quizCurrQuestion() {
      if(!this.isLoading){
        return this.quizQuestions[this.currQuestionCounter];
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/styles/variables';

h1 {
  color: $white !important;
}

.btn {
    background-color: $white;
}
.img-limit {
  max-width: 30px;
}

.question {
    background-color: $white;
    border: lightgrey 1px solid;
    border-radius: 2px;
    padding: 1%;
    height: 97px;

}

.answer {
    font-family: 'Open', sans-serif;
    font-size: 1.5rem;
    color: #00cec3;
}

.arrow {
  color: $green;
  font-size: 2rem;

}
.pulse {
  cursor: pointer;
  animation-duration: 0.5s;
  animation-name: pulse;
  animation-direction: alternate;
  animation-iteration-count: infinite;
}

@keyframes pulse {
  from {
    transform: translateX(0)
  }
  to {
    transform: translateX(10px)
  }
}

.texture-back {
    position: absolute;
    z-index: -1;
    top: 10%;
    left: -10%;
    height: 100%;
    width: 30%;

    /* border: 3px solid blue; */
    background-image: url("https://images-na.ssl-images-amazon.com/images/I/A1Kuvnb5YAL._SX425_.jpg");

}

.bodyQ {
    z-index: 3;
    position: relative;
    top: -50px;
    margin: 5%;
}

.num {
    z-index: 4;
    position: absolute;
    left: 5%;
    // padding-left: 0%;
    // top: 0%;
    /*   font-weight: medium; */
}


</style>
