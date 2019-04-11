<template>
  <div class="sidebar">
    <!-- <el-radio-group v-model="isCollapse">
      <el-radio-button :label="false" id="btn-arrow-left" v-show="isShowLeft" @click.native="showRightBtn">
        <i class="el-icon-d-arrow-left"></i>
      </el-radio-button>
      <el-radio-button :label="true" id="btn-arrow-right" v-show="isShowRight" @click.native="showLeftBtn">
        <i class="el-icon-d-arrow-right"></i>
      </el-radio-button>
    </el-radio-group> -->
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
    <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu>
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" @click="routerPush(subItem.index,subItem.url)">
              {{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item @click="routerPush(item.index,item.url)">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>

        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-setting",
          index: "0",
          title: "实时库管理",
          subs: [
            {
              index: "real-time",
              url: "",
              title: "实时库查询"
            },
            {
              index: "archivedata",
              url: "",
              title: "历史库查询"
            }
          ]
        },
        {
          icon: "el-icon-warning",
          index: "iframe",
          title: "事件告警",
          subs: [
            {
              index: "realtimealarm",
              url: "",  //http://39.107.241.142:3502/ws/
              title: "实时报警"
            },
            {
              index: "archivealarm",
              url: "",
              title: "历史报警"
            }
          ]
        }
      ],
      isShowLeft: false,
      isShowRight: true,
      isCollapse: false,
    };
  },
  methods: {
    routerPush(name, url) {
      if (name === "iframe") {
        this.$router.push({ name: "temp", params: { url: url } });
      } else {
        this.$router.push({ name: name });
      }
    },
    showRightBtn() {
         //alert('111');
       this.isShowLeft = true;
      this.isShowRight = false;

      this.$emit("childByValue", this.isShowRight);

    },
    showLeftBtn() {
        //alert('22');
     this.isShowLeft = false;
      this.isShowRight = true;
      this.$emit("childByValue", this.isShowRight);


    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
