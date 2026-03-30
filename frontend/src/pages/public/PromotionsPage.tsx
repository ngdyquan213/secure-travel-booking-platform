import { PromotionBannerSection } from '@/widgets/promotions/PromotionBannerSection'
import { PromotionCatalogSection } from '@/widgets/promotions/PromotionCatalogSection'
import { PromotionHeroSection } from '@/widgets/promotions/PromotionHeroSection'

export function PromotionsPage() {
  return (
    <>
      <PromotionHeroSection />
      <PromotionBannerSection />
      <PromotionCatalogSection />
    </>
  )
}
