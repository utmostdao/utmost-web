<template>
  <div ref="jazzicon" />
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import MersenneTwister from 'mersenne-twister'
import Color from 'color'

export default Vue.extend({
  name: 'JazzIcon',
  props: {
    seed: {
      type: Number,
      default: Math.round(Math.random() * 10000000),
    },
    diameter: {
      type: Number,
      default: 100,
    },
    address: {
      type: String,
      default: null,
    },
    shapeCount: {
      type: Number,
      default: 4,
    },
    colors: {
      type: Array,
      default: () => [
        '#01888C', // teal
        '#FC7500', // bright orange
        '#034F5D', // dark teal
        '#F73F01', // orangered
        '#FC1960', // magenta
        '#C7144C', // raspberry
        '#F3C100', // goldenrod
        '#1598F2', // lightning blue
        '#2465E1', // sail blue
        '#F19E02', // gold
      ],
    } as PropOptions<string[]>,
  },
  data() {
    return {
      generator: undefined as MersenneTwister | undefined,
      svgns: 'http://www.w3.org/2000/svg',
    }
  },
  watch: {
    seed: {
      handler() {
        this.icon()
      },
    },
    address: {
      handler() {
        this.icon()
      },
    },
    diameter: {
      handler() {
        this.icon()
      },
    },
  },
  mounted() {
    this.icon()
  },
  methods: {
    async icon() {
      const seed = this.address?.toLowerCase()
        ? this.addressToNumber(this.address)
        : this.seed
      ;(this.$refs.jazzicon as any).innerHTML = ''
      const el = await this.generateIdenticon(this.diameter, seed)
      await (this.$refs.jazzicon as any).append(el)
    },
    newPaper(diameter: number, color: string) {
      const container = document.createElement('div')
      container.style.borderRadius = `${diameter / 2}px`
      container.style.overflow = 'hidden'
      container.style.padding = '0px'
      container.style.margin = '0px'
      container.style.width = '' + diameter + 'px'
      container.style.height = '' + diameter + 'px'
      container.style.display = 'inline-block'
      container.style.background = color
      return {
        container,
      }
    },
    addressToNumber(address: string) {
      return parseInt(address.slice(2, 10), 16)
    },
    generateIdenticon(diameter: number, seed: number) {
      this.generator = new MersenneTwister(seed)
      const remainingColors = this.hueShift(this.colors.slice(), this.generator)
      const elements = this.newPaper(diameter, this.genColor(remainingColors))
      const container = elements.container
      const svg = document.createElementNS(this.svgns, 'svg')
      svg.setAttributeNS(null, 'x', '0')
      svg.setAttributeNS(null, 'y', '0')
      svg.setAttributeNS(null, 'width', diameter.toString())
      svg.setAttributeNS(null, 'height', diameter.toString())
      container.appendChild(svg)
      for (let i = 0; i < this.shapeCount - 1; i++) {
        this.genShape(remainingColors, diameter, i, this.shapeCount - 1, svg)
      }
      return container
    },
    genShape(
      remainingColors: string[],
      diameter: number,
      i: number,
      total: number,
      svg: Element
    ) {
      const center = diameter / 2
      const shape = document.createElementNS(this.svgns, 'rect')
      shape.setAttributeNS(null, 'x', '0')
      shape.setAttributeNS(null, 'y', '0')
      shape.setAttributeNS(null, 'width', diameter.toString())
      shape.setAttributeNS(null, 'height', diameter.toString())
      const firstRot = this.generator?.random()
      const angle = Math.PI * 2 * firstRot!
      const velocity =
        (diameter / total) * this.generator!.random() + (i * diameter) / total
      const tx = Math.cos(angle) * velocity
      const ty = Math.sin(angle) * velocity
      const translate = 'translate(' + tx + ' ' + ty + ')'
      // Third random is a shape rotation on top of all of that.
      const secondRot = this.generator!.random()
      const rot = firstRot! * 360 + secondRot * 180
      const rotate =
        'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')'
      const transform = translate + ' ' + rotate
      shape.setAttributeNS(null, 'transform', transform)
      const fill = this.genColor(remainingColors)
      shape.setAttributeNS(null, 'fill', fill)
      svg.appendChild(shape)
    },
    genColor(colors: string[]) {
      // const rand = this.generator!.random()
      const idx = Math.floor(colors.length * this.generator!.random())
      const color = colors.splice(idx, 1)[0]
      return color
    },
    hueShift(colors: string[], generator: MersenneTwister): string[] {
      const wobble = 30
      const amount = generator.random() * 30 - wobble / 2
      return colors.map((hex) => {
        const color = Color(hex)
        color.rotate(amount)
        return color.hex()
      })
    },
  },
})
</script>
