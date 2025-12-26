```md
# Spring Boot + MongoDB (Complete Summary)

## 1. Project Structure (What goes where)

```

Backend/
│── pom.xml
│── .env                (optional – NOT auto-read by Spring Boot)
│
└── src/
└── main/
├── java/
│   └── com.example.backend/
│       ├── BackendApplication.java   (Main class)
│       │
│       ├── controller/
│       │   └── UserController.java   (REST APIs)
│       │
│       ├── model/
│       │   └── User.java              (MongoDB document)
│       │
│       └── repository/
│           └── UserRepository.java   (Database access)
│
└── resources/
└── application.properties        (Configuration)

```

---

## 2. Configuration (Database connection)

**File path:**
```

src/main/resources/application.properties

````

```properties
spring.application.name=Backend
spring.data.mongodb.uri=${MONGO_URI}
spring.data.mongodb.database=mydb
server.port=8080
````

* Database credentials are **not hard-coded**
* MongoDB URI is read from an **environment variable**

---

## 3. Environment Variable (Where Mongo URI lives)

* Stored **outside the code**
* Spring Boot reads it at startup

Example (Windows):

```powershell
setx MONGO_URI "mongodb+srv://username:password@cluster0.mongodb.net/mydb"
```

---

## 4. Model Layer (Data structure)

**Path:**

```
src/main/java/.../model/User.java
```

```java
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
}
```

* One Java class = One MongoDB collection
* Fields are stored as JSON

---

## 5. Repository Layer (Database operations)

**Path:**

```
src/main/java/.../repository/UserRepository.java
```

```java
public interface UserRepository
        extends MongoRepository<User, String> {
}
```

* No SQL
* No implementation needed
* Spring Boot auto-handles CRUD operations

---

## 6. Controller Layer (API → DB)

**Path:**

```
src/main/java/.../controller/UserController.java
```

```java
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public User save(@RequestBody User user) {
        return repo.save(user);
    }

    @GetMapping
    public List<User> getAll() {
        return repo.findAll();
    }
}
```

* Client talks only to the API
* API talks to the database

---

## 7. How the Database Works (Flow)

```
Client (Browser / Postman)
        ↓
Spring Boot Controller
        ↓
MongoRepository
        ↓
MongoDB Atlas (Cloud Database)
```

* Spring Boot does **not** host the database
* MongoDB runs on **MongoDB Atlas**
* Data is stored as **documents (JSON)**

---

## 8. Security & Best Practices

* Credentials are stored in environment variables
* No secrets inside code or GitHub
* MongoDB Atlas controls IP access and users
* Easy to deploy on cloud platforms

---

## 9. Final Summary (One paragraph)

Spring Boot connects to a cloud-hosted MongoDB Atlas database using an environment variable for the connection URI. Configuration is done in `application.properties`, while data models, repositories, and controllers are placed in their respective packages. The backend handles all database operations through Spring Data MongoDB, storing data as JSON documents securely and making the application production-ready.

```
