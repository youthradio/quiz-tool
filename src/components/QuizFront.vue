<template>
<div class="row">
  <div class="col-12 col-md-12 mx-auto">

    <div class="position-relative w-100">
      <span class="num"><h1>1</h1></span>
      <img class="img-fluid w-100" src="https://www.verywellfamily.com/thmb/i7DhOuOyBsQqb49Yb3ScyFZzauk=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-519516013-56cb3aea3df78cfb379b789f.jpg">
      <div class="texture-back"> </div>
    </div>
    <div class="bodyQ">
      <div class="card my-3">
        <div class="p-2">
          This graphic went viral on social media but was debunked. What should make you doubt it?
        </div>
      </div>
      <button type="button" class="btn btn-outline-secondary btn-block">The cheesy photo</button>
      <button type="button" class="btn btn-outline-secondary btn-light btn-block"> No link to an original post</button>
      <div class="row mb-5">
        <div class="col">
          <p class="mt-2">
            <span class="answer font-weight-bold "> Yes! </span> The font, date, and photo aren't the problem--it's the lack of a source! Anyone can photoshop words on top of an image. Memes like this can originate from satire sites, hacked
            accounts,
            or tabloids that make stuff up so you grab them while paying for toilet paper. Beware!
          </p>
            <div class="text-right pulse">
              <span class="icon-arrow-right arrow"></span>
            </div>
        </div>

      </div>

    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
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
    top: -10%;
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
