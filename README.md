# Calendar component

## Uses case

## dependencies

- <https://calendar.jeraidi.tech/docs/react/installation>

## TODO

- [ ] manage all day events
  - [ ] manage whole day for week and day view
  - [ ] loading future events or webdav new event not loaded
- [ ] parametrize calendar invalidation period
- [ ] Data loading : progressively display calendars
- [ ] settings : remove?
- [ ] clean up ui folder
- [ ] test mobile
- [ ] "type a command or search"
- [ ] event dialog : display
  - [ ] date if 1 day
  - [ ] start and end without time if several whole days
- [ ] missing description warning on event dialog
- [ ] manage max number of calendars
- [ ] SP graphic chart
  - [ ] 2nd color accessibility
- [ ] clean wrap up release
- [ ] improve readme
  - [ ] configuration
  - [ ] description
  - [ ] badges
  - [ ] licence
- [ ] Add comments in data
- [ ] Get configuration from SPO
- [ ] CI
- [ ] deploy

## Getting Started

Add config file `dev.config.json`

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
