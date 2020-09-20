# Record API

The api filters and returns the records. It is developed for a case-study.  

**Live Url:** https://record-case-api.herokuapp.com/  
**Documentation Url:** https://record-case-api.herokuapp.com/api-docs

#### Setting up the project

- In your terminal, Run;
 ```bash
  git clone https://github.com/berkayclk/nodejs-case-study.git
  cd nodejs-case-study
  npm install
  ```
* Set the **.env** file like bellow;
```
  PORT=8080
  APP_URL='http://live-app-url-to-docs'  ## its required for just production
  MONGODB_URL="mogodb://connection-string/database"
```

#### Running Project

The project can run on the local environment or the docker environment. The run commands are the following.  

* Local Run

```bash
  npm run start
```

* Docker Run
```bash
  docker-compose build
  docker-compose up
```

App will be running on the PORT that is given by env file.

### Running Tests

Integration and unit tests are created. To run these test, you should run the following command on your terminal.
```bash
  npm run test
```

