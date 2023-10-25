import { Context } from '@nuxt/types'

export default ({
  redirect,
  localePath,
  getRouteBaseName,
  $accessor,
  route,
}: Context) => {
  const baseName = getRouteBaseName()
  const txPages = ['index-preview', 'index-approve', 'index-results']

  if (txPages.includes(baseName ?? '')) {
    const { fromChain, toChain, swapPreviewInfos } = $accessor.swap
    if (!(fromChain || toChain || swapPreviewInfos)) {
      redirect(localePath({ path: '/', query: route.query }))
    }
  }
}
