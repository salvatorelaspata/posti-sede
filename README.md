# Posti Sede

## Setup

```bash
npm install
```

## Environment

```bash
cp .env.sample .env
```

Fill the `.env` file with the correct values.

- `EXPO_PUBLIC_DATABASE_URL`: The URL of the database.
- `EXPO_PUBLIC_DATABASE_DRIVER`: The driver of the database. (neon, postgres, etc.)

> [!NOTE]
> For now only neon is supported.

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

## Install on simulator

```bash
eas build:run -p ios --latest
```

## Teck Stack

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