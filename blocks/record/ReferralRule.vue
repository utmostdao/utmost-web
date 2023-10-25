<template>
  <div class="referral-rule">
    <div class="title">{{ $t('referralRuleTitle') }}</div>
    <div class="tip">{{ $t('referralRuleTip') }}</div>
    <div class="content">
      <div v-for="item in ruleContent" :key="item.id" class="item">
        <div class="label">{{ item.title }}</div>
        <div class="content">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ReferralRule',
  computed: {
    ruleContent() {
      return [
        {
          id: 'recommend',
          title: this.$t('recommendTitle'),
          content: this.$t('recommendContent'),
        },
        {
          id: 'contribution',
          title: this.$t('contributionTitle'),
          content: this.$t('contributionContent'),
        },
      ]
    },
  },
})
</script>

<style scoped lang="scss">
.referral-rule {
  width: 450px;
  flex-shrink: 0;
  background-color: $secondary;
  border-radius: $radius;
  padding: 16px 20px;

  @include phone {
    width: 100%;
  }

  .title {
    color: $textColor;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%;
  }

  .tip {
    font-size: 12px;
    font-weight: 400;
    color: $textColorOp8;
    margin-bottom: 4px;
  }

  .content {
    .item {
      .label {
        color: $textColor;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 130%;
        padding: 10px 0;
      }
      .content {
        color: $textColorOp5;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5; /* 15.6px */
        white-space: pre-line;
      }
    }
  }
}
</style>
