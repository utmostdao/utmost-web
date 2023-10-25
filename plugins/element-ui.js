import Vue from 'vue'
import {
  Button,
  Image,
  Input,
  Form,
  FormItem,
  Select,
  Icon,
  Pagination,
  Popover,
  Switch,
  Skeleton,
  SkeletonItem,
  Empty,
  InfiniteScroll,
  Tooltip,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import elementLocale from 'element-ui/lib/locale'

Vue.use(Button, { locale })
Vue.use(Image, { locale })
Vue.use(Input, { locale })
Vue.use(Form, { locale })
Vue.use(FormItem, { locale })
Vue.use(Select, { locale })
Vue.use(Icon, { locale })
Vue.use(Pagination, { locale })
Vue.use(Popover, { locale })
Vue.use(Switch)
Vue.use(Skeleton)
Vue.use(SkeletonItem)
Vue.use(Empty)
Vue.use(Tooltip)
Vue.use(InfiniteScroll)

export default ({ app }) => {
  elementLocale.i18n((key, value) => app.i18n.t(key, value))
}
