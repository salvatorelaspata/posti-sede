# Posti Sede

## Setup

```bash
npm install
```

## Environment variables

- `EXPO_PUBLIC_DATABASE_URL`: The URL of the database.
- `EXPO_PUBLIC_DATABASE_DRIVER`: The driver of the database. (neon)
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: The publishable key of the Clerk project.

Set environment variables in the `.env.local` file.

## Run

```bash
npm start
```

## Database

Generate the schema.

```bash
npm run generate
```

Push the schema to the database.

```bash 
npm run push
```

Studio

```bash
npm run studio
```

## EAS

Build the app for the development profile.

```bash
eas build --profile development --platform ios
```

Build the app for the preview profile.

```bash
eas build --profile preview --platform ios
```

### Sync environment variables

Pull environment variables from EAS.

```bash
eas env:pull --profile <profile>
```

Push environment variables to EAS.

```bash
eas env:push --profile <profile>
# or
eas env:push --environment=<profile>
```

> [!NOTE]
> The profile is the name of the profile in the `eas.json` file.


## Install on simulator

```bash
eas build:run -p ios --latest
```

## Submit to App Store

```bash
eas build --platform ios --profile production
```

```bash
eas submit --platform ios
```


## Submit to Play Store

```bash
eas build --platform android --profile production
``` 

```bash
eas submit --platform android
```

## Teck stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Neon](https://neon.tech/)
- [Drizzle](https://orm.drizzle.team/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Clerk](https://clerk.com/)


# TODO

- [ ] Manage google auth
- [ ] I18N

## Thanks

Fast development:

- [Cursor](https://www.cursor.com/)
- [a0](https://a0.dev/)