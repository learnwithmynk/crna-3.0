/**
 * Tabs Component
 *
 * Tabs component built with Radix UI.
 * Soft pill-style tabs with smooth transitions.
 *
 * Example:
 * <Tabs defaultValue="clinical">
 *   <TabsList>
 *     <TabsTrigger value="clinical">Clinical</TabsTrigger>
 *     <TabsTrigger value="eq">EQ Tracker</TabsTrigger>
 *     <TabsTrigger value="shadow">Shadow Days</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="clinical">Clinical content...</TabsContent>
 *   <TabsContent value="eq">EQ content...</TabsContent>
 *   <TabsContent value="shadow">Shadow content...</TabsContent>
 * </Tabs>
 */

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex min-h-11 items-center justify-center rounded-2xl bg-gray-100/80 p-1 text-gray-500",
      "w-full md:w-auto",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
      "data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:bg-gray-200/50",
      "flex-1 md:flex-none",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4",
      "focus-visible:outline-none",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
