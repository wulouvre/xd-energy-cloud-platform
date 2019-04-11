<template>
 <div>

 </div>
</template>

<script>
 export default {
   data () {
     return {
        url: this.$route.params.url,
     }
   },
   created(){
         this.$router.push({ name: 'iframe', params: { url: this.url } });
   },
   components: {

   }
 }
</script>

<style>

 
</style>
