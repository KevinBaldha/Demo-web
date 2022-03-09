<template>
  <CFooter :fixed="false">
    <div>
      <a href="#" target="_blank">Project</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}} All Right Reserved.</span>
    </div>
  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>
