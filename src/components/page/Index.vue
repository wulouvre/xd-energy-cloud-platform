<template>
    <div>
        <div class="wrapper">
            <v-head></v-head>
            <div class="content">

            </div>
        </div>

    </div>
</template>

<script>
import vHead from "../common/Header.vue";
export default {
  data() {
    return {};
  },
  methods: {
    routerPush(_name, _url) {
      if (_name === "iframe") {
        this.$router.push({ name: _name, params: { url: _url } });
      } else {
        this.$router.push({ name: _name });
      }
    }
  },
  components: {
    vHead
  }
};
</script>


<style scoped>
/* .el-row {
  margin-bottom: 20px;
} */
.content {
  background-color: #f2f2f2;
  height: 1000px;
}
.grid-content {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100px;
  background-color: #f2f2f2;
}
.grid-content-fill {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #222222;
}
.grid-content-right {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 240px;
  background-color: #f2f2f2;
}
.grid-content-title {
  margin-top: 5px;
}
</style>
