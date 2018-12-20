<template>
  <div>
    <!-- header -->
    <mu-appbar style="width: 100%;" color="primary">
      <mu-button icon slot="left" @click="open = !open">
        <mu-icon value="menu"></mu-icon>
      </mu-button>XXXXXXXXXX系统
      <mu-menu slot="right">
        <mu-list>
          <mu-list-item avatar>
            <mu-list-item-action avatar>
              <mu-avatar>
                <img src="../assets/avatar.jpg">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>管理员</mu-list-item-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
        <mu-list slot="content">
          <mu-list-item button>
            <mu-list-item-content>
              <mu-list-item-title>注销</mu-list-item-title>
            </mu-list-item-content>
          </mu-list-item>
          <mu-list-item button>
            <mu-list-item-content>
              <mu-list-item-title>设置</mu-list-item-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-menu>
    </mu-appbar>
    <!-- header -->
    <!-- left menu -->
    <mu-drawer :open.sync="open" :docked="docked" :right="position === 'right'">
      <mu-list>
        <router-link to="/heatMapPage">
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="inbox"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>热力图</mu-list-item-title>
          </mu-list-item>
        </router-link>
        <router-link to="/example">
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="grade"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>echarts示例</mu-list-item-title>
          </mu-list-item>
        </router-link>
        <router-link to="/about">
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="send"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>空白页</mu-list-item-title>
          </mu-list-item>
        </router-link>
        <mu-list-item @click="open = false" button>
          <mu-list-item-title>关闭</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
    <!-- left menu -->
    <!-- main page -->
    <router-view/>
    <!-- main page -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      docked: false,
      open: false,
      position: "left"
    };
  }
};
</script>