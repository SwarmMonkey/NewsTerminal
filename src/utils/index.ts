import type { MaybePromise } from "@shared/type.util"
import { $fetch } from "ofetch"

export function safeParseString(str: any) {
  try {
    return JSON.parse(str)
  } catch {
    return ""
  }
}

export class Timer {
  private timerId?: any
  private start!: number
  private remaining: number
  private callback: () => MaybePromise<void>

  constructor(callback: () => MaybePromise<void>, delay: number) {
    this.callback = callback
    this.remaining = delay
    this.resume()
  }

  pause() {
    clearTimeout(this.timerId)
    this.remaining -= Date.now() - this.start
  }

  resume() {
    this.start = Date.now()
    clearTimeout(this.timerId)
    this.timerId = setTimeout(this.callback, this.remaining)
  }

  clear() {
    clearTimeout(this.timerId)
  }
}

export const myFetch = $fetch.create({
  timeout: 15000,
  retry: 0,
  baseURL: "/api",
})

export function isiOS() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod",
  ].includes(navigator.platform)
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

// Common Chinese source names and their English equivalents
const commonTranslations: Record<string, string> = {
  // Source names
  "知乎": "Zhihu",
  "微博": "Weibo",
  "联合早报": "Lianhe Zaobao",
  "酷安": "Coolapk",
  "华尔街见闻": "Wall Street News",
  "36氪": "36Kr",
  "抖音": "Douyin",
  "虎扑": "Hupu",
  "百度贴吧": "Baidu Tieba",
  "今日头条": "Today's Headlines",
  "IT之家": "IT Home",
  "澎湃新闻": "The Paper",
  "卫星通讯社": "Sputnik News",
  "参考消息": "Reference News",
  "远景论坛": "PCBeta Forum",
  "财联社": "Cailian Press",
  "雪球": "Xueqiu",
  "格隆汇": "Gelonghui",
  "法布财经": "Fastbull Finance",
  "哔哩哔哩": "Bilibili",
  "快手": "Kuaishou",
  "靠谱新闻": "Kaopu News",
  "金十数据": "Jin10 Data",
  "百度热搜": "Baidu Trending",
  "果核剥壳": "Ghxi",
  "什么值得买": "SMZDM",
  "牛客": "Nowcoder",
  "少数派": "SSPAI",
  "稀土掘金": "Juejin",
  "凤凰网": "iFeng",
  "虫部落": "ChongBuLuo",

  // Common section titles
  "实时热搜": "Real-time Trending",
  "今日最热": "Today's Hottest",
  "实时快讯": "Real-time Express",
  "最新资讯": "Latest News",
  "最热文章": "Hottest Articles",
  "快讯": "Express",
  "主干道热帖": "Hot Posts",
  "热议": "Hot Topics",
  "热榜": "Hot List",
  "电报": "Telegraph",
  "深度": "In-depth",
  "热门": "Popular",
  "热门股票": "Hot Stocks",
  "事件": "Events",
  "头条": "Headlines",
  "热搜": "Hot Search",
  "热门视频": "Hot Videos",
  "排行榜": "Rankings",
  "最新": "Latest",
  "今日最热": "Today's Hot",
  "热点资讯": "Hot News",
  "最热": "Hottest",

  // Common news phrases
  "更新": "updated",
  "发布": "released",
  "上市": "launched",
  "首发": "first release",
  "看法": "opinion",
  "观点": "viewpoint",
  "比特币": "Bitcoin",
  "国社": "State Agency",
  "小米": "Xiaomi",
  "华为": "Huawei",
  "苹果": "Apple",
  "特斯拉": "Tesla",
  "美股": "US stocks",
  "人民币": "Yuan",
  "创新高": "reached new high",
  "跌破": "fell below",
  "突破": "broke through",
  "关注": "follow",
  "震荡": "fluctuation",
  "涨停": "limit up",
  "跌停": "limit down",
  "芯片": "chip",
  "战略": "strategy",
  "合作": "cooperation",
  "智能": "intelligent",
  "科技": "technology",
  "金融": "finance",
  "财报": "financial report",
  "亏损": "loss",
  "盈利": "profit",
  "数据": "data",
  "分析": "analysis",
  "报告": "report",
  "评测": "review",
  "测评": "test review",

  // Descriptions
  "来自第三方网站: 早晨报": "From third-party site: Morning Post",
  "不一定靠谱，多看多思考": "May not be reliable, read and think more",
  "Windows 资源": "Windows Resources",
}

// Translation function that uses the mapping table
export function translateText(text: string): string {
  if (!text) return text

  // Check if we have a direct translation
  if (commonTranslations[text]) {
    return commonTranslations[text]
  }

  // Try to detect if the text is Chinese
  const isChinese = /[\u3400-\u9FBF]/.test(text)
  if (!isChinese) return text

  // For longer texts, search and replace known words/phrases
  const words = Object.keys(commonTranslations)
  let translatedText = text

  for (const word of words) {
    if (text.includes(word)) {
      translatedText = translatedText.replace(
        new RegExp(word, "g"),
        commonTranslations[word],
      )
    }
  }

  // If we made changes, return the translated text
  if (translatedText !== text) {
    return translatedText
  }

  // If text is too long, return a placeholder
  if (text.length > 50) {
    return "[Translated content]"
  }

  return text
}

// Cache for translated items to avoid repeated translations
export const translationCache = new Map<string, string>()
