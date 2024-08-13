import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";
import { toggleVariants } from "@/components/ui/toggle";
import { ButtonProps, buttonVariants } from "./button";

/* currently not part of shadcn/ui, maybe start PR */

const Toolbar = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Root ref={ref} className={cn(className)} {...props} />
));
Toolbar.displayName = ToolbarPrimitive.Root.displayName;

const ToolbarSeparator = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator ref={ref} className={cn(className)} {...props} />
));
ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName;

const ToolbarButton = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Button>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button> & ButtonProps
>(({ className, variant, size, ...props }, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  />
));
ToolbarButton.displayName = ToolbarPrimitive.Button.displayName;

const ToolbarToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

const ToolbarToggleGroupPrimitive = ToolbarPrimitive.ToolbarToggleGroup;
const ToogleToolbarGroupItemPrimitive = ToolbarPrimitive.ToolbarToggleItem;

const ToolbarToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToolbarToggleGroupPrimitive>,
  React.ComponentPropsWithoutRef<typeof ToolbarToggleGroupPrimitive> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToolbarToggleGroupPrimitive
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToolbarToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToolbarToggleGroupContext.Provider>
  </ToolbarToggleGroupPrimitive>
));

ToolbarToggleGroup.displayName = ToolbarToggleGroupPrimitive.displayName;

const ToolbarToggleItem = React.forwardRef<
  React.ElementRef<typeof ToogleToolbarGroupItemPrimitive>,
  React.ComponentPropsWithoutRef<typeof ToogleToolbarGroupItemPrimitive> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToolbarToggleGroupContext);

  return (
    <ToogleToolbarGroupItemPrimitive
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToogleToolbarGroupItemPrimitive>
  );
});

ToolbarToggleItem.displayName = ToogleToolbarGroupItemPrimitive.displayName;

export {
  Toolbar,
  ToolbarSeparator,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarToggleItem,
};
