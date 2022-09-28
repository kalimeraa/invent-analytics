# Library Application

### APP
- Runs on :3000


#### Used
* **EXPRESS**
* **SEQUELIZE**
* **YUP**

### Requirements for local installation

- Docker
- GIT

### Installation
```
  cp .env.example .env
  docker-compose up -d
  docker-compose exec application bash
  npx sequelize-cli db:migrate
```