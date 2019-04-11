<template>
  <div class="tree-wrap left">
    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :highlight-current="true" :expand-on-click-node="false"></el-tree>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        type:''
      }
    },
    methods:{
      handleNodeClick(data) {
        var that = this;
        that.type = data.type;
        this.$emit("childByType", this.type);
      }
    },
    components: {

    },
    props: {
      treeData: Array,
    }
  }
</script>

<style>
.el-tree-node__label{overflow:hidden;}/**防止ie下有滚动条*/

</style>
