<template>
    <div>
        <iframe :src="url" width='100%' height='1000' frameborder='0'></iframe>
    </div>
</template>

<script>
export default {
  data() {
    return {
         url: this.$route.params.url,
    };
  },
  created(){
   
  },
  components: {}
};
</script>

<style>
</style>
