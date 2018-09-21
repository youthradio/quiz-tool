<template>
  <div class="row">
    <div class="col-12 col-md-12 mx-auto">

      <div class="position-relative w-100">
        <template v-if="!quizResult">
          <span class="num">
            <h1>{{ currQuestionCounter + 1 }}</h1>
          </span>
          <img
            :src="isLoading ? 'null' : quizCurrQuestion.featureImage"
            class="img-fluid w-100">
        </template>
        <template v-else>
          <img
            :src="scorePage.scoreImage"
            class="img-fluid w-100">
        </template>
        <div class="texture-back" />
      </div>
      <div class="bodyQ">
        <div class="card my-3">
          <template v-if="quizResult">
            <div class="card-body">
              <h3> {{ scorePage.scoreTitle }} </h3>
              <p>
                You got
                <span class="correct">{{ totalScore }}</span>
                out of
                <span class="qList">{{ totalQuestion }}</span>
                correct!  {{ scorePage.scoreDescription }}
              </p>
            </div>
            <div class="d-flex align-items-center pl-3 pb-2">
              <span
                class="icon-facebook-inverted share-icon m-1 pointer"
                @click="facebookThis"/>
              <span
                class="icon-twitter-inverted share-icon m-1 pointer"
                @click="tweetMessage"/>

              <div
                class="ml-auto align-middle pointer d-flex align-items-center pr-2"
                @click="tryAgain">
                <span>Try Again</span>
                <div class="ml-2 icon-arrow-right pulse"/>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="p-3 question">
              {{ isLoading ? 'Loading...' : quizCurrQuestion.questionText }}
            </div>
          </template>
        </div>
        <template v-if="!quizResult">
          <template v-if="!isLoading">
            <button
              v-for="(option, index) in quizCurrQuestion.options"
              :key="option.id"
              :disabled="hasRespondOption"
              :class="[hasRespondOption ? (option.correctOption ?
                         'btn-yes':
                         'btn-no') :
                       '',
                       'btn btn-outline-dark btn-block']"
              type="button"
              @click="processResponse(index)">
              {{ option.optionText }}
            </button>
          </template>
          <template v-else>
            <button
              type="button"
              class="btn btn-outline-dark btn-block">
              Loading...
            </button>
          </template>
          <template v-if="hasRespondOption">
            <div class="row mb-5">
              <div class="col">
                <div
                  :class="[questionResult.yesNo == 'Wrong'?
                             'shakeNo':
                             'shakeYes',
                           'answer font-weight-bold d-inline-block']">
                  {{ questionResult.yesNo }}
                </div>
                <div
                  class="responseBox"
                  v-html="questionResult.resultText"/>
                <div class="text-right pulse">
                  <span
                    class="icon-arrow-right arrow"
                    @click="nextQuestion" />
                </div>
              </div>

            </div>
          </template>
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
      hasRespondOption: false,
      quizResult: false,
      currQuestionCounter: 0,
      questionResult: {},
      clickedOption: -1,
      totalScore: 0,
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
    quizData() {
      return this.$store.state.quizData;
    },
    quizQuestions() {
      if (!this.isLoading) {
        return this.$store.state.quizData.questions;
      }
    },
    totalQuestion() {
      if (!this.isLoading) {
        return this.$store.state.quizData.questions.length;
      }
    },
    quizCurrQuestion() {
      if (!this.isLoading && this.currQuestionCounter < this.totalQuestion) {
        // return this.quizQuestions[this.currQuestionCounter];
        return Object.assign(this.quizQuestions[this.currQuestionCounter], {
          options: this.shuffleOptions
        })
      }
    },
    shuffleOptions() {
      return this.quizQuestions[this.currQuestionCounter]
        .options
        .slice(0)
        .sort(() => 0.5 - Math.random());
    },
    scorePage() {
      if (!this.isLoading) {
        return this.$store.state.quizData.scorePage.find(score => {
          const range = score.scoreRange.split('-').map(e => parseInt(e))
          return this.totalScore >= range[0] && this.totalScore <= range[1];
        })
      }
    },
  },
  methods: {
    processResponse(index) {
      if (this.clickedOption < 0) {
        this.clickedOption = index;
        if (this.quizCurrQuestion.options[index].correctOption) {
          this.totalScore++;
          this.questionResult.yesNo = "Correct"
          this.questionResult.resultText = this.quizCurrQuestion.options[index].resultText
        } else {
          this.questionResult.yesNo = "Wrong"
          this.questionResult.resultText = this.quizCurrQuestion.options[index].resultText
        }
        this.hasRespondOption = true;
      }
    },
    nextQuestion() {
      this.currQuestionCounter++;
      this.clickedOption = -1;
      this.hasRespondOption = false;
      if (this.currQuestionCounter >= this.totalQuestion) {
        this.quizResult = true;
      }
    },
    tryAgain() {
      this.totalScore = 0;
      this.currQuestionCounter = 0;
      this.clickedOption = -1;
      this.quizResult = false;
      this.hasRespondOption = false;
    },
    tweetMessage () {
      const url = 'https://www.youthradio.org/mid-term-elections'
      const tweet = `YR Media Mid Term Elections: ${url}`
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
      window.open(tweetUrl, 'pop', 'width=600, height=400, scrollbars=no')
    },
    facebookThis () {
      const url = 'https://www.youthradio.org/mid-term-elections'
      const title = 'Mid Terms Elections by YR Media'
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`
      window.open(facebookUrl, '_blank')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/styles/variables';

h1 {
    color: $white !important;
}
.btn {
    white-space: normal;
    background-color: $white;
}
.btn:disabled{
  opacity: 1.0;
}
.btn-yes:disabled {
  color: $white;
  background-color: $green;
  border-color: $green;
}
.btn-no:disabled {
  color: $white;
  background-color: $red;
  border-color: $red;
}
.img-limit {
    max-width: 30px;
}

.question {
    background-color: $white;
    border-radius: 5px;
    box-shadow: 0px 3px 3px $dark;
    font-weight: 900 !important;
    font-family: 'Days Sans', sans-serif !important;
    line-height: 1.05;
    letter-spacing: 0.64px;
    color: $black !important;
}

.num {
    z-index: 4;
    position: absolute;
    left: 5%;
}
.num {
  h1, h2, h3, h4 {
    font-weight: 700 !important;
    font-family: 'Assistant', sans-serif !important;
    color: $white !important;
    font-size: 2.5rem;
  }
}



.answer {
    font-family: 'Open', sans-serif;
    font-size: 1.5rem;
    color: #00cec3;
}

.arrow {
    color: $sky-blue;
    font-size: 2rem;
}
.share-icon {
    color: $sky-blue;
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
        transform: translateX(-5px);
    }
    to {
        transform: translateX(0px);
    }
}
.shakeNo {
    animation: shakeNo 0.82s ease-in both;
    color: $red;
}
.shakeYes {
    animation: shakeYes 0.82s ease-in both;
    color: $green;
}
@keyframes shakeNo {
    10%,
    90% {
        transform: translateX(-1px);
    }

    20%,
    80% {
        transform: translateX(2px);
    }

    30%,
    50%,
    70% {
        transform: translateX(-4px);
    }

    40%,
    60% {
        transform: translateX(4px);
    }
}
@keyframes shakeYes {
    10%,
    90% {
        transform: translateY(-1px);
    }

    20%,
    80% {
        transform: translateY(2px);
    }

    30%,
    50%,
    70% {
        transform: translateY(-4px);
    }

    40%,
    60% {
        transform: translateY(4px);
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
</style>
