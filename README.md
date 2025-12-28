# Solidarité Paysans calendar component

## Uses case

## dependencies

- <https://calendar.jeraidi.tech/docs/react/installation>

## TODO

- [ ] manage all day events
  - [x] workaround
  - [x] properly manage whole day member in IEvent
  - [x] don't show hour for month
  - [ ] manage wholeday for week and day view
  - [ ] view dialog : don't show time
- [x] properly link color and calendar
- [x] IUser -> ICalendar
- [ ] ics duplicate?
- [ ] webdav event in the past
- [ ] SP graphic chart
  - [ ] 2nd color accessibility
- [ ] french translation
  - [ ] i18n
- [ ] why parseISO everywhere?
- [ ] clean wrap up release
  - [ ] rename request
  - [x] remove delete / editing
  - [x] remove dead / commented code
- [x] fix hydration issues
- [ ] include description in adapters
- [ ] cache calendar call
- [ ] Add comments in data
- [ ] Get configuration from SPO
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
