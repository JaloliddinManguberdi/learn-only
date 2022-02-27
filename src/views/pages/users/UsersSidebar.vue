<template>
  <v-navigation-drawer
    v-model="sidebar"
    :permanent="sidebar"
    width="400"
    right
    temporary
    top
    fixed
  >
    <v-card
      class="mx-4"
      elevation="0"
    >
      <v-card-title>
        {{ username }}
      </v-card-title>
      <v-card-text></v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="editingUser.name"
          label="User name"
          type="text"
          outlined
          dense
          class="mb-2"
          :rules="[$rules.required]"
        />
        <v-text-field
          v-model="editingUser.username"
          label="Username"
          outlined
          dense
          class="mb-2"
          :rules="[$rules.required]"
        />
        <v-text-field
          v-model="editingUser.email"
          label="Email"
          outlined
          dense
          class="mb-2"
          :rules="[$rules.required]"
        />
        <v-btn
          class="mr-2"
          rounded
          color="primary"
          :disabled="!valid"
          @click="$refs.form.validate() && save()"
        >
          Save
        </v-btn>
        <v-btn
          rounded
          color="secondary"
          @click="close"
        >
          Cancel
        </v-btn>
      </v-form>
    </v-card>
  </v-navigation-drawer>
</template>

<script>

const defaultUser = {
  id: null,
  name: null,
  username: '',
  email: '',
}

export default {
  name: 'UsersSidebar',
  data() {
    return {
      sidebar: false,
      editingUser: { ...defaultUser },
      valid: true,
    }
  },
  computed: {
    username() {
      if (this.editingUser.id) return 'Edit user'

      return 'Create a new user'
    },
  },
  methods: {
    show(user) {
      this.$refs.form.resetValidation()
      this.editingUser = { ...defaultUser, ...user }
      this.sidebar = true
    },
    save() {
      if (this.editingUser.id) {
        this.update()
      } else {
        this.create()
      }
    },
    close() {
      this.sidebar = false
    },

    async update() {
      try {
        await this.$store.dispatch('users/updateUser', this.editingUser)
        this.$toast.success('User info updated succesfully')
        this.sidebar = false
      } catch (error) {
        this.$toast.error('Error occured while updating the user!')
      }
    },

    async create() {
      try {
        await this.$store.dispatch('users/createUser', this.editingUser)
        this.$toast.success('User info created succesfully')
        this.sidebar = false
      } catch (error) {
        this.$toast.error('Error occured while creating a new user info!')
      }
    },
  },
}
</script>

<style>

</style>
