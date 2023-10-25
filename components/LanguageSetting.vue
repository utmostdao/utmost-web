<template>
  <div class="language-setting">
    <div
      v-if="locale === 'en-US'"
      class="language"
      @click="changeLang(langs[1].code)"
    >
      {{ langs[1].name }}
    </div>
    <div v-else class="language" @click="changeLang(langs[0].code)">
      {{ langs[0].name }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'LanguageSetting',
  computed: {
    locale: {
      get() {
        return this.$i18n.locale
      },
      set(lang: string) {
        this.$i18n.setLocale(lang)
      },
    },
    langs() {
      return [
        { code: 'en-US', name: 'EN' },
        { code: 'zh-TW', name: '繁' },
      ]
    },
  },
  methods: {
    changeLang(code: string) {
      this.$i18n.setLocale(code)
    },
  },
})
</script>

<style scoped lang="scss">
.language-setting {
  width: 24px;
  height: 24px;
  margin-right: 20px;
  border: 2px solid $textPrimary;
  border-radius: 4px;
  text-align: center;
  user-select: none;
  .language {
    color: $textPrimary;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>
