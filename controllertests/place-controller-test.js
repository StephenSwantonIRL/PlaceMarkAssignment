import chai from "chai";
import chaiHttp from "chai-http";
import { userMemStore } from "../src/models/mem/user-mem-store.js";
import { placeMemStore } from "../src/models/mem/place-mem-store.js"
import { maggie, longplayer, svalbard, incompleteSvalbard } from "../test/fixtures.js";
import { assertSubset } from "../test/test-utils.js";

const should = chai.should();
const { assert, expect } = chai;

chai.use(chaiHttp);

const db = [];

async function authMaggie(password = "secret") {
  await chai.request("http://localhost:3000").post("/register").send(maggie);
  const agent = await chai.request.agent("http://localhost:3000");
  const response = await agent.post("/authenticate").send({ email: "maggie@simpson.com", password: password });
  return { response, agent };
}

describe("User Test Set Up", async () => {
  beforeEach(async () => {
    db.placeStore = placeMemStore;
    db.userStore = userMemStore;
    await db.placeStore.deleteAll();
  });


  describe("/POST addPlace", () => {
    it("it should create a new place", async () => {

      const response = await authMaggie().then((res) => {
        return res.agent
          .post("/addPlace").send(longplayer)
          .then((res) => {
            expect(res).to.have.status(200);
            res.text.should.contain("Longplayer")
          })
          .then(() => res.agent.close());
      });

      // });
    });
  });

});
