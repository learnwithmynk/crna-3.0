/**
 * UI Components Index
 *
 * Central export point for all UI components.
 * Import components from here for cleaner imports:
 *
 * Instead of:
 *   import { Button } from '@/components/ui/button'
 *   import { Card } from '@/components/ui/card'
 *
 * Use:
 *   import { Button, Card } from '@/components/ui'
 */

// Base shadcn/ui components
export { Avatar, AvatarImage, AvatarFallback } from './avatar'
export { Badge } from './badge'
export { Button } from './button'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
export { Checkbox } from './checkbox'
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu'
export { Input } from './input'
export { Label } from './label'
export { Progress } from './progress'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select'
export { Skeleton } from './skeleton'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'

// Custom CRNA Club components
export { EmptyState } from './empty-state'
export { HighlightHeading } from './highlight-heading'
export { ProgressRing } from './progress-ring'
export { StatCard } from './stat-card'
export { StatusBadge } from './status-badge'
export { TagSelect } from './tag-select'
