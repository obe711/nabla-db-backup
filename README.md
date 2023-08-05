# Nabla DB Backup server

Mongodb Database backup server that stores gzip mongodump to AWS S3 bucket


## Installation

Clone the repo:

```bash
git clone --depth 1 https://github.com/obe711/nabla-db-backup.git
cd nabla-db-backup
npx rimraf ./.git
```

Node.js version:

```bash
nvm use
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```


