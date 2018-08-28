# Alarmapp Admin
Control panel for the [Alarmapp](https://github.com/ramomar/alarmapp) project made with Ionic.

## Features

- Realtime system state updates (e.g., a window opens, a door closes, etc.).
- Push notifications when system gets breached or is in panic mode.
- Sentry for error reporting.
- Activate/deactivate system.
- Disable areas.
- Panic button.
- General summary view.
- Floor diagram summary view.
- Test siren button.
- _Push notifications not enabled_ alert.
- _Not watching anything_ alert (all areas are disabled or all areas are open).
- _No network_ alert.
- _Trouble connecting_ alert.

### Platforms

- iOS.
- Android.

## Credentials

Since this is a personal project, I decided to hardcode tokens in files in order to avoid hosting a backend app (tokens are easily resetable if a device gets compromised 😛).

You must set your own credentials in the following files: `src/config.json` and `sentry.properties`.

| Credential | Description | File |
|------------|-------------|------|
| PARTICLE_ACCESS_TOKEN | Your access token to the Particle Cloud API. | `src/config.json` |
| PARTICLE_DEVICE_ID | The ID of your Particle Photon. | `src/config.json` |
| SENTRY_DSN | DSN provided by Sentry. | `src/config.json` |
| auth.token | Access token provided by Sentry. | `sentry.properties`|
## Deploying to devices

Run `ionic cordova run android` or `ionic cordova run ios`.
