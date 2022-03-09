<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <h3>Project</h3>
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="computedSidebar" />
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import menus from './_menus';

export default {
  name: 'TheSidebar',
  computed: {
    user() {
        return this.$store.state.user;
    },
    show () {
      return this.$store.state.sidebarShow 
    },
    minimize () {
      return this.$store.state.sidebarMinimize 
    },
    currentMenus() {
      const vm = this;

      if (!vm.user.role) {
        return [];
      }

      return menus.filter(menu => {
        return !menu.roles || menu.roles.includes(vm.user.role);
      });
    },
    computedSidebar() {
      return [
        {
          _name: "CSidebarNav",
          _children: this.currentMenus
        }
      ];
    }
  }
}
</script>
