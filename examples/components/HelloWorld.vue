<template>
  <div class="hello" style="height: 600px;">
    <arcgis-view
      mixed
      jsBaseUrl="http://localhost:8082/js/arcgis/4.12/dojo"
      jsUrl="http://localhost:8082/js/arcgis/4.12/init.js"></arcgis-view>
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
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
