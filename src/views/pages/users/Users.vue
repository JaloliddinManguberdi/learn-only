<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :items="users"
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
              Users
            </span>
            <v-spacer />
            <!--Search-->
            <v-text-field
              id="search"
              v-model="search"
              type="text"
              class="form-v-input__control mr-2"
              placeholder="search user"
              label="Search"
              @blur="init"
            />
            <v-btn
              color="primary"
              @click="openSidebar"
            >
              Create user info
            </v-btn>
          </v-card-title>
        </template>
        <template #footer>
          <v-pagination
            v-if="!loading && users.length"
            v-model="options.page"
            :length="totalPages"
            :total-visible="7"
          >
          </v-pagination>
        </template>
        <template #item.phone="{ item }">
          {{ item.phone | filterUser }}
        </template>
        <template
          #item.actions="{ item }"
        >
          <v-btn
            small
            icon
            color="error"
            @click="deleteUser(item)"
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
    <users-sidebar
      ref="sidebar"
      fixed
    />
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex'
import { mdiDeleteCircleOutline, mdiPencilBoxOutline } from '@mdi/js'
import UsersSidebar from './UsersSidebar.vue'

const headers = [
  {
    text: 'ID',
    value: 'id',
  },
  {
    text: 'Name',
    value: 'name',
  },
  {
    text: 'User name',
    value: 'username',
  },
  {
    text: 'Email',
    value: 'email',
  },
  {
    text: 'Phone',
    value: 'phone',
  },
  {
    text: 'Actions',
    value: 'actions',
  },
]

export default {
  name: 'Users',
  components: { UsersSidebar },
  filters: {
    filterUser(val) {
      if (val && val.length > 100) return `${val.slice(0, 100)}...`

      return val
    },
  },
  data() {
    return {
      loading: false,
      search: '',
      options: {
        page: 1,
      },
      headers,
      icons: { mdiDeleteCircleOutline, mdiPencilBoxOutline },
    }
  },
  computed: {
    ...mapGetters({
      users: 'users/getItems',
      totalPages: 'users/getTotalPages',
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
        if (this.users.length && !force) return
        this.loading = true
        await this.$store.dispatch('users/fetchUsers', {
          _page: this.options.page,
          q: this.search,
        })
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error occured while fetching users')
      } finally {
        this.loading = false
      }
    },
    async deleteUser(user) {
      try {
        await this.$store.dispatch('users/deleteUser', user)
        this.$toast.success('User deleted succesfully!')
      } catch (error) {
        this.$toast.error('Error occured while deleting users')
      }
    },
    openSidebar(user = null) {
      setTimeout(() => { this.$refs.sidebar.show(user) }, 0)
    },
  },
}
</script>
