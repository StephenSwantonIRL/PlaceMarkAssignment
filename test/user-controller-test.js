import chai from "chai"
import chaiHttp from "chai-http"
import { db } from "../src/models/db.js";
import { maggie, suzie, testUsers } from "./fixtures.js";

const should = chai.should();

chai.use(chaiHttp);

describe("User Test Set Up", async() => {
  beforeEach((done) => {
    db.init("mem");
    db.userStore.deleteAll();
    done();
  })

  describe("/GET signup", () => {
    it("it should GET the signup page", (done) => {
      chai.request("http://localhost:3000")
        .get("/signup")
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.contain("Sign up")
          done();
        });
    });
  });

  describe("/POST register", () => {
    it("it should create a new user", (done) => {
      const user = maggie
        chai.request("http://localhost:3000")
        .post("/register", )
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("/POST register - failed duplicate user", () => {
    it("it should fail as user already exists", (done) => {
      db.userStore.addUser(maggie);
      chai.request("http://localhost:3000")
        .post("/register", )
        .send(maggie)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.contain("User Already Exists");
          done();
        });
    });
  });
});