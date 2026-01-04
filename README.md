# Cagendar view

[!Lint workflow status](https://img.shields.io/github/actions/workflow/status/ad2ien/cagendar-view/lint.yml?label=lint&logo=github)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A Next.js app to display several calendars in the same place.

Uses more or less [Solidarité paysans](https://solidaritepaysans.org/) graphic design. And is meant to be included to be included as an iframe.

## Features

- Started with <https://calendar.jeraidi.tech>
- But it's readonly
- Can be configured with Webdav and ICS agendas

## Configuration

### `.env` file

```.env
SETTINGS_FILE_PATH=config.json
```

### config.json

```json
[
  {
    "type": "ics",
    "name": "an ICS exported agenda",
    "url": "https://EXAMPLE.COM/remote.php/dav/public-calendars/XXX?export"
  },
  {
    "type": "webdav",
    "name": "a webdav agenda",
    "url": "https://EXAMPLE.COM",
    "calendarPath": "/remote.php/dav/calendars/USER/CALENDAR1/",
    "username": "user",
    "password": "xxx"
  }
...
]
```

## Getting Started

Add config file `dev.config.json` then classic Next app

commands : `npm run` (or whatever your dependency manager is)

- `lint`
- `build`
- `dev` then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- `start`

### Docker image

```sh
docker buildx build . -t cagendar-view
docker run -p 3083:3083 cagndare-view:latest
```

## TODO

- [ ] manage all day events
  - [ ] manage whole day for week and day view
  - [ ] loading future events or webdav new event not loaded
- [ ] parametrize calendar invalidation period
- [ ] Data loading : progressively display calendars
- [ ] clean up ui folder
- [ ] test mobile
- [ ] manage max number of calendars
- [ ] clean wrap up release
- [ ] warning font
- [ ] Get configuration from SPO
- [ ] Release CI
- [ ] deploy
