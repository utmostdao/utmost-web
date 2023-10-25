#!/usr/bin/env ts-node
/* eslint-disable no-console */

import { writeFileSync } from 'fs'
import path from 'path'
import fetch from 'node-fetch'

async function saveApi() {
  ;(await import('dotenv')).config({ path: '.yapirc' })

  const token = process.env.YAPI_TOKEN
  // const crossToken = process.env.YAPI_CROSS_CHAIN_TOKEN
  if (!token) {
    console.log('Yapi token not found!')
    return
  }
  const filePath = path.join(__dirname, './swagger.json')
  // const crossFilePath = path.join(__dirname, './crossSwagger.json')
  const baseUrl =
    'https://yapi.abmatrix.cn/api/plugin/exportSwagger?type=OpenAPIV2&pid=96&status=all&isWiki=false&token='
  const res = await fetch(baseUrl + token)
  // const tokenRes = await fetch(baseUrl + crossToken)
  const api = await res.json()
  // const crossApi = await tokenRes.json()
  writeFileSync(filePath, JSON.stringify(api))
  // writeFileSync(crossFilePath, JSON.stringify(crossApi))
  console.info('🎉  Yapi sync successfully')
}

try {
  saveApi()
} catch (err) {
  console.log(err)
}
