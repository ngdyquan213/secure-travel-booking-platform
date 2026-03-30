import { FaqSection } from '@/widgets/help/FaqSection'
import { HelpHeroSection } from '@/widgets/help/HelpHeroSection'
import { HelpTopicsSection } from '@/widgets/help/HelpTopicsSection'
import { SupportContactSection } from '@/widgets/help/SupportContactSection'

export function HelpPage() {
  return (
    <>
      <HelpHeroSection />
      <HelpTopicsSection />
      <FaqSection />
      <SupportContactSection />
    </>
  )
}
