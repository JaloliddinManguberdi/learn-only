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
        {{ title }}
      </v-card-title>
      <v-card-text></v-card-text>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="editingPost.userId"
          label="User id"
          type="number"
          outlined
          dense
          class="mb-2"
          :rules="[$rules.required]"
        />
        <v-text-field
          v-model="editingPost.title"
          label="Title"
          outlined
          dense
          class="mb-2"
          :rules="[$rules.required]"
        />
        <v-textarea
          v-model="editingPost.body"
          label="Body"
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

const defaultPost = {
  id: null,
  userId: null,
  title: '',
  body: '',
}

export default {
  name: 'PostsSidebar',
  data() {
    return {
      sidebar: false,
      editingPost: { ...defaultPost },
      valid: true,
    }
  },
  computed: {
    title() {
      if (this.editingPost.id) return 'Edit post'

      return 'Create a new post'
    },
  },
  methods: {
    show(post) {
      this.$refs.form.resetValidation()
      this.editingPost = { ...defaultPost, ...post }
      this.sidebar = true
    },
    save() {
      if (this.editingPost.id) {
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
        await this.$store.dispatch('posts/updatePost', this.editingPost)
        this.$toast.success('Post updated succesfully')
        this.sidebar = false
      } catch (error) {
        this.$toast.error('Error occured while updating the post!')
      }
    },

    async create() {
      try {
        await this.$store.dispatch('posts/createPost', this.editingPost)
        this.$toast.success('Post created succesfully')
        this.sidebar = false
      } catch (error) {
        this.$toast.error('Error occured while creating a new post!')
      }
    },
  },
}
</script>

<style>

</style>
