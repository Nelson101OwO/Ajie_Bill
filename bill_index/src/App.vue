<template>
  <div id="app">
    <Time id="time"/>
    <Date/>
    <Content/>
    <User/>
    <Overview/>
  </div>
</template>
<script>
// 整个项目的根组件  页头页尾存放地址 由此切换其他组件的显示

import Time from './components/Time.vue';
import Date from './components/Date.vue';
import Content from './components/Content.vue';
import User from './components/User.vue';
import Overview from './components/Overview.vue';


export default {
  name: 'App',
  components: {
    Time,
    Date,
    Content,
    User,
    Overview
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width:100%;
  height:900px;
  border: 1px  solid #000;
}
#time{
  width:30%;border: 1px solid #000;
}
Date{}
Content{}
User{}
Overview{}
</style>
