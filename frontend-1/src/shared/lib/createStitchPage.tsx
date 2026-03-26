import type { StitchPageDefinition } from '@/shared/config/stitchPages'
import { StitchPage } from '@/shared/ui/StitchPage'

export function createStitchPage(definition: StitchPageDefinition) {
  function GeneratedPage() {
    return <StitchPage definition={definition} />
  }

  GeneratedPage.displayName = `${definition.title.replace(/\s+/g, '')}Page`

  return GeneratedPage
}
