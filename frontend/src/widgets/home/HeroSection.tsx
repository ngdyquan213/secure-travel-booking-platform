import { ShieldCheck, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@/app/router/routePaths'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <Badge variant="teal" size="lg">
            <ShieldCheck className="h-4 w-4" />
            World-Class Curated Travel
          </Badge>

          <div className="space-y-6">
            <h1 className="max-w-xl font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[1.05] tracking-tight text-[color:var(--color-primary)] md:text-7xl">
              Journey into the <span className="text-[color:var(--color-secondary-strong)]">Extraordinary.</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--color-on-surface-variant)] md:text-xl">
              Experience travel redefined through hand-picked destinations and seamless luxury planning. Your story begins where the horizon ends.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="hero"
              size="xl"
              onClick={() => scrollToSection(routePaths.sections.featuredTours)}
            >
              Browse Tours
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => navigate(routePaths.public.destinations)}
            >
              Explore Destinations
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-[0_32px_72px_rgba(15,23,42,0.18)]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuABWV97ScoS35wsmCpuWP8psYlOLuZHcCl7hdA8NPuXKjRFeUPaS_cUI-CWzG-d-T3tAV86GxvWxMac6JUwpgpbCZ7vHvT6HClWmJWBBXFFrnwMpmiErgYFIY-nChORRbevXSqQGozTnikLLONbAHUTDjPJdmxoSeGBzXjaDESH-rqchTyq9JvFXk55Hg_hvCc_fBey1YLS1_pCfXtyIEksmuqyNDq1Hz_O8ZfRtIRoPXi32HiQK9kQZOXWHhf-zieZPwMOcAR-6g2Q"
              alt="Luxury infinity pool overlooking a turquoise tropical ocean at sunset."
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="surface-panel absolute -bottom-8 left-4 hidden max-w-xs rounded-[1.5rem] border border-white/70 p-5 shadow-[var(--shadow-card)] md:block">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-secondary-container)] text-[color:var(--color-secondary-strong)]">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[color:var(--color-primary)]">
                  4.9/5 Rating
                </p>
                <p className="text-sm text-[color:var(--color-on-surface-variant)]">
                  From 2,500+ global voyagers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
