import type { Ref } from 'vue'

export type TocLevel = 'h2' | 'h3' | 'h4'

export type TocItem = {
  id: string
  text: string
  level: TocLevel
  parentId: string | null
}

export type TocState = {
  title: string
  toc: TocItem[]
  activeId: string
  /** 本文を読んでいる最中か。読み終えた後はフッターや関連記事を隠さないようバーを引っ込める */
  isInBody: boolean
}

// 記事タイトル(ArticleDetailのh1)のid。最初の見出しより上にいる間は
// ここがactiveIdになり、どの見出しも現在地にならない状態を表す
export const TOC_TITLE_ID = 'articleTitle'

const emptyTocState = (): TocState => ({
  title: '',
  toc: [],
  activeId: TOC_TITLE_ID,
  isInBody: true,
})

// バーの高さぶん。本文の下端がここまで上がったら読み終えたとみなす
const BAR_CLEARANCE = 100

// ArticleDetail(本文)とSideBar(PC目次)は別コンポーネントツリーなので、
// useStateでSSR安全に共有する（モジュールスコープのrefだとリクエスト間で状態が漏れる）
export const useTocState = () => useState<TocState>('toc', emptyTocState)

// 現在地として扱う見出しのid。h4にいるときは親のh3も含めるので、
// 小見出しを読んでいる間もどのセクションにいるかが分かる
export const activeTocIds = (toc: TocItem[], activeId: string) => {
  const active = toc.find((item) => item.id === activeId)
  return new Set([activeId, active?.parentId].filter((id): id is string => Boolean(id)))
}

/**
 * 記事本文からh2/h3/h4を抜き出し、スクロールに応じた現在地(activeId)とあわせて
 * 共有状態(useTocState)に書き込む。ArticleDetailからのみ呼び出す想定。
 */
export const useToc = (
  title: Ref<string | undefined>,
  content: Ref<string | undefined>,
  body: Ref<HTMLElement | undefined>,
) => {
  const state = useTocState()
  let observer: IntersectionObserver | undefined
  let bodyObserver: IntersectionObserver | undefined

  const setup = () => {
    observer?.disconnect()
    observer = undefined
    bodyObserver?.disconnect()
    bodyObserver = undefined

    if (!content.value) {
      state.value = emptyTocState()
      return
    }

    const parsed = new DOMParser().parseFromString(content.value, 'text/html')
    const headings = Array.from(parsed.querySelectorAll('h2, h3, h4'))

    // 直前の上位見出しをparentIdとして持たせる。下位の見出しにいる間、
    // 親の見出しも「今いるセクション」として控えめにハイライトするために使う
    let currentH2Id: string | null = null
    let currentH3Id: string | null = null
    const toc: TocItem[] = headings
      .filter((heading): heading is Element & { id: string } => heading.id !== '')
      .map((heading) => {
        const level = heading.tagName.toLowerCase() as TocLevel
        if (level === 'h2') {
          currentH2Id = heading.id
          currentH3Id = null
        }
        if (level === 'h3') currentH3Id = heading.id
        return {
          id: heading.id,
          text: heading.textContent ?? '',
          level,
          parentId: level === 'h2' ? null : level === 'h3' ? currentH2Id : currentH3Id ?? currentH2Id,
        }
      })

    state.value = { title: title.value ?? '', toc, activeId: TOC_TITLE_ID, isInBody: true }
    if (toc.length === 0) return

    // 本文の下端を通り過ぎたらバーを引っ込める（下端をバーの高さぶん切り上げて判定する）
    if (body.value) {
      bodyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            state.value = { ...state.value, isInBody: entry.isIntersecting }
          })
        },
        { rootMargin: `0px 0px -${BAR_CLEARANCE}px 0px` },
      )
      bodyObserver.observe(body.value)
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) state.value = { ...state.value, activeId: entry.target.id }
        })
      },
      // 画面上部から「-100px」の位置から、下から「-70%」の位置までを判定エリアに
      { rootMargin: '-100px 0px -70% 0px' },
    )

    // 記事タイトルも観測対象に加える。最初のh2/h3より上にいる間はタイトルがハイライトされる
    ;[TOC_TITLE_ID, ...toc.map((item) => item.id)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer?.observe(el)
    })
  }

  onMounted(() => {
    watch(content, () => nextTick(setup), { immediate: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
    bodyObserver?.disconnect()
    state.value = emptyTocState()
  })
}
