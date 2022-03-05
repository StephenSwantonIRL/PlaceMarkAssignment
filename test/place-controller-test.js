import chai from "chai";
import chaiHttp from "chai-http";
import { userMemStore } from "../src/models/mem/user-mem-store.js";
import { placeMemStore } from  "../src/models/mem/place-mem-store.js"
import { maggie, longplayer, svalbard, incompleteSvalbard } from "./fixtures.js";

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
    db.placeStore = placeMemStore;
    db.userStore = userMemStore;
    await db.placeStore.deleteAll();
  });


  describe("/POST addPlace", () => {
    it("it should create a new place", async () => {
      await db.placeStore.deleteAll();
      const place = longplayer;
      const response = await chai.request("http://localhost:3000").post("/addPlace").send(longplayer);
      console.log(response.text);
      response.should.have.status(200);
      // });
    });
  });
  
});
