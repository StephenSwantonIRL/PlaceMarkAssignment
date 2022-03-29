import chai from "chai";
import chaiHttp from "chai-http";
import { userMemStore } from "../src/models/mem/user-mem-store.js";
import { maggie, suzie, stephen, testUsers, updatedMaggie } from "../test/fixtures.js";

const should = chai.should();
const { assert, expect } = chai;

chai.use(chaiHttp);

const db = [];

async function authMaggie(password = "secret") {
  const agent = await chai.request.agent("http://localhost:3000");
  const response = await agent.post("/authenticate").send({ email: "maggie@simpson.com", password: password });
  return { response, agent };
}

describe("User Test Set Up", async () => {
  beforeEach(async () => {
    db.userStore = userMemStore;
    await db.userStore.deleteAll();
  });

  describe("/GET signup", () => {
    it("it should GET the signup page", (done) => {
      chai
        .request("http://localhost:3000")
        .get("/signup")
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.contain("Sign up");
          done();
        });
    });
  });

  describe("/POST register maggie", () => {
    it("it should create a new user", async () => {
      await db.userStore.deleteAll();
      const user = maggie;
      const response = await chai.request("http://localhost:3000").post("/register").send(user);
      console.log(response.text);
      response.should.have.status(200);
      // });
    });
  });

  describe("/POST register stephen", () => {
    it("it should create a new user", async () => {
      await db.userStore.deleteAll();
      const user = stephen;
      const response = await chai.request("http://localhost:3000").post("/register").send(user);
      console.log(response.text);
      response.should.have.status(200);
      // });
    });
  });

  describe("/POST register - failed duplicate user", () => {
    it("it should fail as user already exists", async () => {
      await chai
        .request("http://localhost:3000")
        .post("/register")
        .send(stephen)
        .then((err, res) => {
          assert.exists(err);
        });
    });
  });

  describe("/POST authenticate stephen", () => {
    it("it should authenticate the user and display the dashboard", async () => {
      const u = await db.userStore.getUserByEmail("stephenswanton@gmail.com");
      console.log(u);
      const agent = await chai.request.agent("http://localhost:3000");
      await agent
        .post("/authenticate")
        .send({ email: "stephenswanton@gmail.com", password: "secret" })
        .then((res) => {
          console.log(res.text);
          expect(res).to.have.status(200);
          return agent
            .get("/dashboard")
            .then((res) => {
              expect(res).to.have.status(200);
              res.text.should.contain("Dashboard");
            })
            .then(() => agent.close());
        });
    });
  });

  describe("/POST authenticate authMaggie", () => {
    it("it should authenticate the user and display the dashboard", async () => {
      const response = await authMaggie().then((res) => {
        expect(res.response).to.have.status(200);
        return res.agent
          .get("/dashboard")
          .then((res) => {
            expect(res).to.have.status(200);
            res.text.should.contain("Dashboard");
          })
          .then(() => res.agent.close());
      });
    });
  });

  describe("/POST authenticate fail - bad password", () => {
    it("it should fail and not proceed to the dashboard", async () => {
      const response = await authMaggie("badpassword").then((res) => {
        expect(res.response).to.have.status(200);
        return res.agent
          .get("/dashboard")
          .then((res) => {
            expect(res).to.have.status(200);
            res.text.should.not.contain("Dashboard");
          })
          .then(() => res.agent.close());
      });
    });
  });

  describe("/POST updateUser", () => {
    it("it should update the users information", async () => {
      const response = await authMaggie().then((res) => {
        return res.agent
          .post("/updateUser")
          .send(updatedMaggie)
          .then((res) => {
            expect(res).to.have.status(200);
            res.text.should.contain("Dashboard");
          })
          .then(() => res.agent.close());
      });
      await authMaggie("updatedSecret").then((res) => {
        console.log(res.response.text);
      });
    });
  });
});
