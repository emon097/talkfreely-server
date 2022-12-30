const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FreelyTalk server");
});

const uri =
  "mongodb+srv://FreelyTalk:9S5eCRPOrB2yKAdW@cluster0.k9jkjo0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

try {
  const peoplePost = client.db("FreelyTalk").collection("peoplePosting");
  const peopleComment = client.db("FreelyTalk").collection("peopleComment");
  const allUserColl = client.db("FreelyTalk").collection("user");

  app.post("/peoplePost", async (req, res) => {
    const info = req.body;
    const peoplePosts = await peoplePost.insertOne(info);
    res.send(peoplePosts);
  });

  app.get("/peoplePost", async (req, res) => {
    const query = {};
    const cursor = await peoplePost.find(query).toArray();
    res.send(cursor);
  });
  app.get("/peoplePost/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const post = await peoplePost.findOne(query);
    res.send(post);
  });

  app.post("/comment", async (req, res) => {
    const comment = req.body;
    const result = await peopleComment.insertOne(comment);
    res.send(result);
  });
  app.post("/user", async (req, res) => {
    const user = req.body;
    const query = {
      email: user.email,
    };
    const alreadyRegister = await allUserColl.find(query).toArray();
    if (alreadyRegister.length) {
      return res.send({ acknowledged: false });
    }
    const result = await allUserColl.insertOne(user);
    res.send(result);
  });

  // update
  app.patch("/user/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const user = req.body;
    const option = { upsert: true };
    const updatedUser = {
      $set: {
        displayName: user.displayName,
        university: user.university,
        address: user.address,
      },
    };
    const result = await allUserColl.updateOne(filter, updatedUser, option);
    res.send(result);
  });
  // update

  app.get("/user", async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const result = await allUserColl.find(query).toArray();
    res.send(result);
  });

  app.get("/comment", async (req, res) => {
    const singleComment = req.query.singleComment;
    console.log(singleComment);
    const query = { singleComment: singleComment };
    const cursor = await peopleComment.find(query).toArray();
    res.send(cursor);
  });
} catch {}
app.listen(port, () => {
  console.log(`FreeTalk Server is Running on ${port} `);
});
