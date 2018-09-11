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
            class="img-fluid w-100"
            src="https://i.imgur.com/bieYsvQ.jpg">
        </template>
        <div class="texture-back" />
      </div>
      <div class="bodyQ">
        <div class="card my-3">
          <template v-if="quizResult">
            <div class="card-body">
              <h3> You are ready to hit the polls! </h3>
              <p>
                You got
                <span class="correct">{{ totalScore }}</span>
                out of
                <span class="qList">{{ totalQuestion }}</span>
                correct! This is a short description about your result. Result response should be short.
              </p>
            </div>
            <div class="d-flex align-items-center">
              <span
                class="icon-facebook-inverted share-icon m-1"
                @click="nextQuestion"/>
              <span
                class="icon-twitter-inverted share-icon m-1"
                @click="nextQuestion"/>

              <div
                class="ml-auto align-middle pointer d-flex align-items-center"
                @click="tryAgain">
                <span>Try Again</span>
                <div class="ml-2 icon-arrow-right pulse"/>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="p-2">
              {{ isLoading ? 'Loading...' : quizCurrQuestion.questionText }}
            </div>
          </template>
        </div>
        <template v-if="!quizResult">
          <template v-if="!isLoading">
            <button
              v-for="(option, index) in quizCurrQuestion.options"
              :key="option.id"
              :disabled="hasRespondOption && clickedOption !== index"
              :class="[clickedOption === index? 'active' : '','btn btn-outline-secondary btn-block']"
              type="button"
              @click="processResponse(index)">
              {{ option.optionText }}
            </button>
          </template>
          <template v-else>
            <button
              type="button"
              class="btn btn-outline-secondary btn-block">
              Loading...
            </button>
          </template>
          <template v-if="hasRespondOption">
            <div class="row mb-5">
              <div class="col">
                <p class="mt-2">
                  <span
                    :class="[questionResult.yesNo == 'No'?
                      'shakeNo':
                    'shakeYes','answer font-weight-bold d-inline-block']">
                    {{ questionResult.yesNo }}
                  </span>
                  {{ questionResult.resultText }}
                </p>
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
      return this.quizQuestions[this.currQuestionCounter].options.slice(0).sort(() => 0.5 - Math.random());
    }
  },
  methods: {
    processResponse(index) {
      if (this.clickedOption < 0) {
        this.clickedOption = index;
        if (this.quizCurrQuestion.options[index].correctOption) {
          this.totalScore++;
          this.questionResult.yesNo = "Yes"
          this.questionResult.resultText = this.quizCurrQuestion.options[index].resultText
        } else {
          this.questionResult.yesNo = "No"
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

.num {
    z-index: 4;
    position: absolute;
    left: 5%;
    // padding-left: 0%;
    // top: 0%;
    /*   font-weight: medium; */
}
</style>
