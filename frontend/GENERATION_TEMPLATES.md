# Quick Generation Templates

Use these templates to generate remaining pages, components, and features quickly.

## 1. Standard Page Template

```tsx
// src/pages/[section]/[PageName].tsx
import { PageHeader } from '../../components/common/PageHeader'

export default function [PageName]Page() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="[Page Title]" 
        description="[Page description]"
      />
      
      <div className="grid gap-6">
        {/* Page content */}
      </div>
    </div>
  )
}
```

## 2. Layout Template

```tsx
// src/layouts/[Name]Layout.tsx
import { Outlet } from 'react-router-dom'
import Header from '../components/navigation/Header'
import Footer from '../components/navigation/Footer'

export default function [Name]Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

## 3. Feature API Template

```tsx
// src/features/[feature]/api/[feature].api.ts
import { apiClient } from '../../../services/http/apiClient'

export const [feature]Api = {
  list: async (params?: any) => {
    const response = await apiClient.get('/[endpoint]', { params })
    return response.data
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/[endpoint]/${id}`)
    return response.data
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/[endpoint]', data)
    return response.data
  },
  
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/[endpoint]/${id}`, data)
    return response.data
  },
  
  delete: async (id: string) => {
    const response = await apiClient.delete(`/[endpoint]/${id}`)
    return response.data
  },
}
```

## 4. Feature Hook Template

```tsx
// src/features/[feature]/hooks/use[Feature].ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { [feature]Api } from '../api/[feature].api'

export function use[Feature]() {
  return useQuery({
    queryKey: ['[feature]'],
    queryFn: () => [feature]Api.list(),
  })
}

export function use[Feature]Detail(id: string) {
  return useQuery({
    queryKey: ['[feature]', id],
    queryFn: () => [feature]Api.getById(id),
    enabled: !!id,
  })
}

export function useCreate[Feature]() {
  return useMutation({
    mutationFn: (data: any) => [feature]Api.create(data),
  })
}
```

## 5. Feature Component Template

```tsx
// src/features/[feature]/components/[ComponentName].tsx
import { Button } from '../../../components/ui/Button'

interface [ComponentName]Props {
  // Define props
}

export function [ComponentName]({ /* props */ }: [ComponentName]Props) {
  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  )
}
```

## 6. UI Component Template

```tsx
// src/components/ui/[ComponentName].tsx
import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface [ComponentName]Props 
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export const [ComponentName] = forwardRef<HTMLDivElement, [ComponentName]Props>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'base-styles',
        variant === 'default' && 'variant-styles',
        size === 'sm' && 'sm-styles',
        className
      )}
      {...props}
    />
  ),
)

[ComponentName].displayName = '[ComponentName]'
```

## 7. Schema/Validation Template

```tsx
// src/features/[feature]/schemas/[feature].schema.ts
import { z } from 'zod'

export const [Feature]Schema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.date(),
})

export type [Feature] = z.infer<typeof [Feature]Schema>

export const Create[Feature]Schema = [Feature]Schema.omit({
  id: true,
  createdAt: true,
})

export type Create[Feature] = z.infer<typeof Create[Feature]Schema>
```

## Quick Generation Commands

### Generate All Pages (use this structure)
1. Copy page template above
2. Replace [PageName] with actual page name
3. Replace [Page Title] with actual title
4. Create in correct `/src/pages/[section]/` folder

### Generate All Layouts
1. Copy layout template
2. Update with appropriate header/sidebar
3. Place in `/src/layouts/`

### Generate All Features
1. Create folder: `/src/features/[feature]/`
2. Create subfolders: `api`, `components`, `hooks`, `schemas`
3. Use templates for each file

## File Naming Conventions

- **Pages:** PascalCase + "Page" suffix (e.g., UserProfilePage.tsx)
- **Components:** PascalCase (e.g., UserCard.tsx)
- **Hooks:** camelCase + "use" prefix (e.g., useUserProfile.ts)
- **APIs:** camelCase + ".api" suffix (e.g., users.api.ts)
- **Schemas:** camelCase + ".schema" suffix (e.g., user.schema.ts)
- **Layouts:** PascalCase + "Layout" suffix (e.g., AccountLayout.tsx)

## Total Files to Create

- **Pages:** 41 files (~50-100 lines each)
- **Layouts:** 5 files (~40-80 lines each)
- **Features:** ~60 files total
- **Components:** ~30 files
- **Services:** 6 files
- **Others:** ~40 files
- **Total: ~182 files**
