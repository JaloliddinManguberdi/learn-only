<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :items="posts"
        :headers="headers"
        disable-filtering
        disable-pagination
        hide-default-footer
        :server-items-length="totalPages"
        :options.sync="options"
        no-data-text="Ma'lumotlar mavjud emas"
        :loading="loading"
        class="mt-4"
      >
        <template #top>
          <v-card-title>
            <span>
              Posts
            </span>
            <v-spacer />
            <v-btn
              color="primary"
              @click="openSidebar"
            >
              Create post
            </v-btn>
          </v-card-title>
        </template>
        <template #footer>
          <v-pagination
            v-if="!loading && posts.length"
            v-model="options.page"
            :length="totalPages"
            :total-visible="7"
          >
          </v-pagination>
        </template>
        <template #item.body="{item}">
          {{ item.body | filterBody }}
        </template>
        <template
          #item.actions="{ item }"
        >
          <v-btn
            small
            icon
            color="error"
            @click="deletePost(item)"
          >
            <v-icon>
              {{ icons.mdiDeleteCircleOutline }}
            </v-icon>
          </v-btn>
          <v-btn
            small
            icon
            color="warning"
            @click="openSidebar(item)"
          >
            <v-icon>
              {{ icons.mdiPencilBoxOutline }}
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <posts-sidebar
      ref="sidebar"
      fixed
    />
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { mdiDeleteCircleOutline, mdiPencilBoxOutline } from '@mdi/js'
import PostsSidebar from './PostsSidebar.vue'

const headers = [
  {
    text: 'ID',
    value: 'id',
  },
  {
    text: 'User ID',
    value: 'userId',
  },
  {
    text: 'Title',
    value: 'title',
  },
  {
    text: 'Body',
    value: 'body',
  },
  {
    text: 'Actions',
    value: 'actions',
  },
]

export default {
  name: 'Posts',
  components: { PostsSidebar },
  filters: {
    filterBody(val) {
      if (val.length > 100) return `${val.slice(0, 100)}...`

      return val
    },
  },
  data() {
    return {
      loading: false,
      options: {
        page: 1,
      },
      headers,
      icons: { mdiDeleteCircleOutline, mdiPencilBoxOutline },
    }
  },

  computed: {
    ...mapGetters({
      posts: 'posts/getItems',
      totalPages: 'posts/getTotalPages',
    }),
  },
  watch: {
    'options.page': 'init',
  },
  created() {
    this.init()
  },
  methods: {
    async init(force = false) {
      try {
        if (this.posts.length && !force) return
        this.loading = true
        await this.$store.dispatch('posts/fetchPosts', {
          _page: this.options.page,
        })
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error occured while fetching posts')
      } finally {
        this.loading = false
      }
    },
    async deletePost(post) {
      try {
        await this.$store.dispatch('posts/deletePost', post)
        this.$toast.success('Post deleted succesfully!')
      } catch (error) {
        this.$toast.error('Error occured while deleting posts')
      }
    },
    openSidebar(post = null) {
      setTimeout(() => { this.$refs.sidebar.show(post) }, 0)
    },
  },
}
</script>
