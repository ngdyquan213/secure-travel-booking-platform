import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StitchPageDefinition } from '@/shared/config/stitchPages'
import {
  bridgeSelector,
  resolveBridgeRoute,
  resolveSubmitBridgeRoute,
} from '@/shared/lib/stitchNavigationBridge'
import { enhanceMockInteractions } from '@/shared/mock/stitchPageEnhancers'

type StitchFrameProps = {
  definition: StitchPageDefinition
  src: string
  title: string
}

export function StitchFrame({ definition, src, title }: StitchFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(960)
  const navigate = useNavigate()

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) {
      return
    }

    let cleanupObservers: (() => void) | undefined
    let cleanupEnhancer: (() => void) | undefined

    const syncHeight = () => {
      const documentNode = frame.contentDocument
      const frameWindow = frame.contentWindow
      if (!documentNode || !frameWindow) {
        return
      }

      const bodyHeight = documentNode.body
        ? Math.max(documentNode.body.scrollHeight, documentNode.body.offsetHeight)
        : 0

      const documentHeight = Math.max(
        documentNode.documentElement.scrollHeight,
        documentNode.documentElement.offsetHeight,
        bodyHeight,
        frameWindow.innerHeight,
      )

      setHeight((currentHeight) =>
        Math.abs(currentHeight - documentHeight) > 2 ? documentHeight : currentHeight,
      )
    }

    const attachObservers = () => {
      cleanupObservers?.()
      cleanupEnhancer?.()

      const documentNode = frame.contentDocument
      const frameWindow = frame.contentWindow
      if (!documentNode || !frameWindow) {
        return
      }

      const resizeObserver = new ResizeObserver(() => {
        syncHeight()
      })

      resizeObserver.observe(documentNode.documentElement)
      if (documentNode.body) {
        resizeObserver.observe(documentNode.body)
      }

      const mutationObserver = new MutationObserver(() => {
        syncHeight()
      })

      mutationObserver.observe(documentNode.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
      })

      const handleResize = () => {
        syncHeight()
      }

      frameWindow.addEventListener('resize', handleResize)

      const bridgeCandidates = documentNode.querySelectorAll<HTMLElement>(bridgeSelector)

      bridgeCandidates.forEach((candidate) => {
        const route = resolveBridgeRoute(candidate, definition)
        if (!route) {
          return
        }

        candidate.dataset.routerBridge = route

        if (candidate.tagName.toLowerCase() === 'a') {
          const anchorNode = candidate as HTMLAnchorElement
          anchorNode.href = route
          anchorNode.target = '_top'
        } else {
          candidate.style.cursor = 'pointer'
        }

        if (
          candidate.tagName.toLowerCase() !== 'a' &&
          candidate.tagName.toLowerCase() !== 'button' &&
          !candidate.hasAttribute('tabindex')
        ) {
          candidate.tabIndex = 0
          candidate.setAttribute('role', 'link')
        }
      })

      const handleClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) {
          return
        }

        const targetNode = event.target
        if (!(targetNode instanceof Element)) {
          return
        }

        const bridgeNode = targetNode.closest<HTMLElement>('[data-router-bridge]')
        const route = bridgeNode?.dataset.routerBridge
        if (!bridgeNode || !route) {
          return
        }

        event.preventDefault()
        event.stopPropagation()
        navigate(route)
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return
        }

        const targetNode = event.target
        if (!(targetNode instanceof HTMLElement)) {
          return
        }

        const route = targetNode.dataset.routerBridge
        if (!route) {
          return
        }

        event.preventDefault()
        navigate(route)
      }

      const handleSubmit = (event: SubmitEvent) => {
        const route = resolveSubmitBridgeRoute(definition)
        if (!route) {
          return
        }

        event.preventDefault()
        navigate(route)
      }

      documentNode.addEventListener('click', handleClick)
      documentNode.addEventListener('keydown', handleKeyDown)
      documentNode.addEventListener('submit', handleSubmit)

      cleanupEnhancer = enhanceMockInteractions({
        definition,
        documentNode,
        navigate,
      })

      documentNode.querySelectorAll('img').forEach((imageNode) => {
        if (!imageNode.complete) {
          imageNode.addEventListener('load', syncHeight, { once: true })
        }
      })

      void documentNode.fonts.ready.then(() => {
        syncHeight()
      })

      syncHeight()

      cleanupObservers = () => {
        resizeObserver.disconnect()
        mutationObserver.disconnect()
        frameWindow.removeEventListener('resize', handleResize)
        documentNode.removeEventListener('click', handleClick)
        documentNode.removeEventListener('keydown', handleKeyDown)
        documentNode.removeEventListener('submit', handleSubmit)
        cleanupEnhancer?.()
        cleanupEnhancer = undefined
      }
    }

    frame.addEventListener('load', attachObservers)

    if (frame.contentDocument?.readyState === 'complete') {
      attachObservers()
    }

    return () => {
      frame.removeEventListener('load', attachObservers)
      cleanupObservers?.()
      cleanupEnhancer?.()
    }
  }, [definition, navigate, src])

  return (
    <iframe
      ref={frameRef}
      className="stitch-frame"
      src={src}
      style={{ height: `${height}px` }}
      title={title}
    />
  )
}
