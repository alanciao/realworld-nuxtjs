<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button 
              v-if="$route.params.username === user.username" 
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="gotoSettings">
              <i class="ion-gear-a"></i>
              &nbsp;
              Edit Profile Settings
            </button>
            <button v-else class="btn btn-sm btn-outline-secondary action-btn" @click="onFollow(profile)">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'my_articles'
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      tab: 'my_articles'
                    }
                  }"
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  :class="{
                    active: tab === 'favorited_articles'
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      tab: 'favorited_articles'
                    }
                  }"
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }"><img :src="article.author.image" /></nuxt-link>
              <div class="info">
                <nuxt-link 
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }">{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button 
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      page: item,
                      tab: tab
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getArticles,
  addFavorite,
  deleteFavorite
} from '@/api/article'
import { 
  getProfile,
  followUser,
  unfollowUser
} from '@/api/user'

export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  async asyncData ({ query, params }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 5
    const tab = query.tab || 'my_articles'

    const info = {
      limit,
      offset: (page - 1) * limit
    }
    if (tab === 'my_articles') {
      info.author = params.username
    } else {
      info.favorited = params.username
    }

    const [ articleRes, profileRes ] = await Promise.all([
      getArticles(info),
      getProfile(params.username)
    ])
    const { articles, articlesCount } = articleRes.data
    articles.forEach(article => article.favoriteDisabled = false)

    return {
      articles, // 文章列表
      articlesCount, // 文章总数
      limit, // 每页大小
      page, // 页码
      profile: profileRes.data.profile,
      tab // 选项卡
    }
  },
  watchQuery: ['page', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    gotoSettings() {
      this.$router.push('/settings')
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
