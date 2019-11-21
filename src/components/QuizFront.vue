<template>
  <div class="row">
    <div
      v-if="!isLoading"
      class="col-12 col-md-12 mx-auto">
      <div class="w-100">
        <template v-if="!quizResult">
          <span class="num">
            <h1>{{ currQuestionCounter + 1 }}</h1>
          </span>
          <img
            :src="`quizes/${quizName}/${quizCurrQuestion.featureImage}`"
            class="img-fluid w-100">
        </template>
        <template v-else>
          <picture>
            <source 
              :srcset="`quizes/${quizName}/${scorePage.scoreImage}`"
              type="image/webp">
            <source 
              :srcset="`quizes/${quizName}/${scorePage.scoreImage.split('.')[0]}.gif`"
              type="image/gif"> 
            <img 
              :src="`quizes/${quizName}/${scorePage.scoreImage}`"
              class="img-fluid w-100">
          </picture>

        </template>
      </div>
      <div class="bodyQ">
        <div class="card my-3">
          <template v-if="quizResult">
            <div class="card-body">
              <h3> {{ scorePage.scoreTitle }} </h3>
              <p>
                You got
                <span class="correct">{{ correctScore }}</span>
                out of
                <span class="qList">{{ totalQuestion }}</span>
                correct!
                <span v-html="scorePage.scoreDescription"/>
              </p>
            </div>
            <div class="d-flex align-items-center pl-3 pb-2">
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
                       clickedOption === index ?
                         'active' :
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
            <div class="row">
              <div class="col">
                <span
                  :class="[questionResult.yesNo == 'Wrong'?
                             'shakeNo':
                             'shakeYes',
                           'answer font-weight-bold d-inline-block mr-2']"
                  v-html="questionResult.yesNo"/>
                <span
                  class="responseBox"
                  v-html="questionResult.resultText"/>
              </div>

            </div>
          </template>
          <div class="row mt-3">
            <div class="col">
              <div :class="['d-flex', currQuestionCounter > 0 && !wentBack ? 'justify-content-between':'justify-content-end']">
                <span
                  v-if="currQuestionCounter > 0 && !wentBack"
                  class="icon-arrow-left arrow"
                  @click="previousQuestion" />
                <span
                  v-if="hasRespondOption"
                  class="icon-arrow-right arrow pulse"
                  @click="nextQuestion" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      v-else
      class="col-12 col-md-12 mx-auto">
      Loading...
      <div class="spinner-wrap">
        <div class="spinner-default">
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
          <div/>
        </div>
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
      scoreList: [],
      wentBack: false,
    }
  },
  computed: {
    correctScore() {
      var totalScore = 0;
      for (var i = 0; i < this.scoreList.length; i++) {
        totalScore = totalScore + this.scoreList[i];
      }
      return totalScore;
    },
    quizName() {
      return this.$route.query.quizName;
    },
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
          return this.correctScore >= range[0] && this.correctScore <= range[1];
        })
      }
    },
  },
  methods: {
    processResponse(index) {
      if (this.clickedOption < 0) {
        this.clickedOption = index;
        if (this.quizCurrQuestion.options[index].correctOption) {
          this.scoreList.push(1);
          this.questionResult.yesNo = "Correct";
          this.questionResult.resultText = this.quizCurrQuestion.options[index].resultText;
        } else {
          this.scoreList.push(0);
          this.questionResult.yesNo = "Wrong";
          this.questionResult.resultText = this.quizCurrQuestion.options[index].resultText;
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
      this.wentBack = false;

      },
    previousQuestion() {
      this.currQuestionCounter--;
      this.clickedOption = -1;

      if (this.hasRespondOption) {
        this.scoreList = this.scoreList.slice(2);
      } else {
        this.scoreList.pop();
      }

      this.hasRespondOption= false;
      this.wentBack = true;

    },
    tryAgain() {
      this.scoreList = [];
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
@import "~@/styles/variables";

h1 {
  color: $white !important;
}
.btn {
  white-space: normal;
  background-color: $white;
  // font-weight: 600;
}
.btn:disabled {
  opacity: 1;
}
.btn-yes:disabled {
  color: $dark;
  background-color: lighten($green, 10%);
  border-color: lighten($green, 10%);
}
.btn-no:disabled {
  color: $dark;
  background-color: lighten($red, 10%);
  border-color: lighten($red, 10%);
}
.active {
  box-shadow: 0px 0px 4px 2px lighten($dark, 20%);
}
.img-limit {
  max-width: 30px;
}

.question {
  background-color: $white;
  border-radius: 5px;
  box-shadow: 0px 3px 3px $dark;
  font-weight: 900 !important;
  font-family: "Days Sans", sans-serif !important;
  line-height: 1.05;
  letter-spacing: 0.64px;
  color: $black !important;
}

.num {
  z-index: 4;
  position: absolute;
  left: 6%;
  text-shadow: 0px 3px 3px #323232;
}
.num {
  h1,
  h2,
  h3,
  h4 {
    font-weight: 700 !important;
    font-family: "Assistant", sans-serif !important;
    color: $white !important;
    font-size: 2.5rem;
  }
}

.answer {
  font-family: "Open", sans-serif;
  font-size: 1.5rem;
  color: #00cec3;
}

.arrow {
  color: $sky-blue;
  font-size: 2rem;
  cursor: pointer;
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

.bodyQ {
  z-index: 3;
  position: relative;
  top: -50px;
  margin: 5%;
}
</style>
