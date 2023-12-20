<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-button @click="testAxios">testAxios</el-button>
    <el-button @click="testAxiosToo">testAxiosToo</el-button>
  </div>
</template>

<script>
import _axios from '@/common/utils/_axios'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'about-view',
  computed: {
    ...mapGetters([ 'cacheRequestConfig' ]),
  },
  methods: {
    testAxios () {
      _axios.get('http://localhost:7001').then(res => {
        console.log('testAxios: ', res)
      }).catch(e => {
        console.error(e + 'testAxios')
      })
    },
    testAxiosToo () {
      this.cacheRequestConfig.forEach(config => {
        _axios(config)
      })
    },
    ...mapMutations({
      setCacheRequestConfig: 'SET_CACHE_REQUEST_CONFIG',
    }),
  },
}
</script>
