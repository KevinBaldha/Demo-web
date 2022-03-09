<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            src="/img/avatars/user.jpeg"
            class="c-avatar-img "
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownItem @click="goToChangePassword">
      Change Password
    </CDropdownItem>
    <CDropdownItem @click="logout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { AuthSvc } from '@/service/api';

export default {
  name: 'TheHeaderDropdownAccnt',
  methods: {
    logout() {
      const vm = this;

      AuthSvc.logout().then(function (res) {
        vm.$store.commit('removeUser');
      }).catch((err) => {
        console.log(err);
      }).then(() => {
        vm.$router.push({ name: 'Login' });
      });
    },
    goToChangePassword() {
      this.$router.push({ name: 'ChangePassword' });
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>