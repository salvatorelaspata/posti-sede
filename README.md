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

# TODO

- [ ] Manage google auth
- [ ] I18N
