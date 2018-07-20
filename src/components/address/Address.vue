<template>
  <div class="page page-search">
    <search-header :ifSearch=false ></search-header>
    <div class="main"></div>
  </div>
</template>
<script>
import SearchHeader from '../SearchHeader'
export default {
  components: {
    SearchHeader
  }
}
</script>
