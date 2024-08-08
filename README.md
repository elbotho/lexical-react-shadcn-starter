# Lexical react shadcn/ui Starter

Inspired by the lexical playground but with some nice dependencies.

### install vite (ts, react-swc)

```sh
bun create vite@latest project-name -- --template react-swc
```

### add tailwind

https://tailwindcss.com/docs/guides/vite

```sh
bun add tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

add your path to tailwinds config

```
content: ["./index.html", "./src/**/*.{ts,tsx}"],
```

replace the default vite styles in index.css with

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
