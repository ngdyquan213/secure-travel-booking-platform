import { BookingConfidenceSection } from '@/widgets/home/BookingConfidenceSection'
import { FeaturedToursSection } from '@/widgets/home/FeaturedToursSection'
import { FinalCtaSection } from '@/widgets/home/FinalCtaSection'
import { HeroSection } from '@/widgets/home/HeroSection'
import { HowItWorksSection } from '@/widgets/home/HowItWorksSection'
import { PopularDestinationsSection } from '@/widgets/home/PopularDestinationsSection'
import { PromotionSection } from '@/widgets/home/PromotionSection'
import { TestimonialsSection } from '@/widgets/home/TestimonialsSection'
import { TrustStrip } from '@/widgets/home/TrustStrip'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedToursSection />
      <PopularDestinationsSection />
      <PromotionSection />
      <HowItWorksSection />
      <BookingConfidenceSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </>
  )
}
