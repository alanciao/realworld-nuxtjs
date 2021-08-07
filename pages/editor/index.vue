<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="tag" type="text" class="form-control" placeholder="Enter tags" @keyup.enter.prevent="addTag">
                  <div class="tag-list" v-for="(item, index) in article.tagList" :key="index">
                    <span class="tag-default tag-pill">
                      <i class="ion-close-round" @click="deleteTag(index)"></i>
                      {{ item }}
                    </span>
                  </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click.prevent="submit">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, getArticle, updateArticle } from '@/api/article'

export default {
  middleware: 'authenticated',
  name: 'EditorIndex',
  data() {
    return {
      slug: '',
      tag: '',
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      }
    }
  },
  async mounted() {
    this.slug = this.$route.query.slug
    if (!this.slug) return

    const { data } = await getArticle(this.slug)
    this.article = data.article
  },
  methods: {
    addTag() {
      if (!this.tag) return
      this.article.tagList.push(this.tag)
      this.tag = ''
    },
    deleteTag(index) {
      this.article.tagList.splice(index, 1)
    },
    async submit() {
      if (!this.slug) {
        const { data } = await createArticle({
          article: this.article
        })
        this.slug = data.article.slug
      } else {
        const { data } = await updateArticle(this.slug, {
          article: this.article
        })
        this.slug = data.article.slug
      }
      
      this.$router.push({
        name: 'article',
        params: {
          slug: this.slug
        }
      })
    }
  }
}
</script>

<style>

</style>
