<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>

    <template v-if="article.author.username === user.username">
      <button class="btn btn-sm btn-outline-secondary" @click="editArticle">
        <i class="ion-edit"></i>
        &nbsp;
        Edit Article
      </button>
      &nbsp;&nbsp;
      <button class="btn btn-sm btn-outline-danger" @click="delArticle">
        <i class="ion-trash-a"></i>
        &nbsp;
        Delete Article
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
        @click="onFollow(article.author)"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
        @click="onFavorite(article)"
        :disabled="!!article.favoriteDisabled"
      >
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { deleteArticle, deleteFavorite, addFavorite } from '@/api/article'
import { followUser, unfollowUser } from '@/api/user'

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    console.log(this.article)
  },
  methods: {
    async delArticle() {
      await deleteArticle(this.article.slug)
      this.$router.push('/')
    },
    editArticle() {
      this.$router.push({
        name: 'editor',
        query: {
          slug: this.article.slug
        }
      })
    },
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    async onFollow(profile) {
      if (profile.following) {
        await unfollowUser(profile.username)
        profile.following = false
      } else {
        await followUser(profile.username)
        profile.following = true
      }
    }
  }
}
</script>

<style>

</style>
