
// describe("lab testing:", () => {


//     describe("users routes:", () => {
//         // Note: user name must be sent in req query not req params
//         it("req to get(/search) ,expect to get the correct user with his name", async () => { })
//         it("req to get(/search) with invalid name ,expect res status and res message to be as expected", async () => { })

//         it("req to delete(/) ,expect res status to be 200 and a message sent in res", async () => { })
//     })


//     describe("todos routes:", () => {
//         it("req to patch(/) with id only ,expect res status and res message to be as expected", async () => { })
//         it("req to patch(/) with id and title ,expect res status and res to be as expected", async () => { })

//         it("req to get( /user) ,expect to get all user's todos", async () => { })
//         it("req to get( /user) ,expect to not get any todos for user hasn't any todo", async () => { })

//     })

//     afterAll(async () => {
//         await clearDatabase()
//     })


// })

const app = require("../index");
const request = require("supertest");
const req = request(app);
const usermodel = require("../models/user");
const todosmodel = require("../models/todo");

describe("lab testing:", () => {
  
  afterAll(async () => {
    await usermodel.clearDatabase();
  });

  describe("users routes:", () => {
  
    it("req to get(/search), expect to get the correct user with his name", async () => {
      const user = await usermodel.create({ name: "maria" , email: "maria99@gmail.com", password: "asdasdasd"});
      const res = await req.get("/user/search").query({ name: "maria" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("maria");
    });

    it("req to get(/search) with invalid name, expect res status and res message to be as expected", async () => {
      const res = await req.get("/user/search").query({ name: "the name isn't valid" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("There is no user with name: Invalid Name");
    });

    it("req to delete(/), expect res status to be 200 and a message sent in res", async () => {
      const res = await req.delete("/user");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(" successfully opreation");
    });
  });


  
  describe("todos routes:", () => {
    let testtodo;

    it("should update todo title by id", async () => {
        const user = await usermodel.create({  name: "maria" , email: "maria99@gmail.com", password: "asdasdasd" });
        const todo = await todosmodel.create({ title: "Todo ", userId: "userid" });
        testtodo = todo._id;

        const res = await req.patch(`/todo/${testtodo}`).send({ title: " todo Updated  " });

        expect(res.status).toBe(200);
        expect(res.body.data.title).toBe(" todo Updated  ");
    });

    it("should get all todos for a user", async () => {
        const user = await usermodel.create({ name: "hala emam", email: "hala@gmail.com", password: "123" });
        await todosmodel.create({ title: "Todo ", userId: user._id });

        const res = await req.get('/todo/user').set('Authorization', ' Token');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should get no todos for a user if user has none", async () => {
        const user = await usermodel.create({ name: "maria" , email: "maria99@gmail.com", password: "asdasdasd" });
        const res = await req.get('/todo/user').set('Authorization', `${AuthToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe(" todos not found");
    });

    it("should return error for invalid todo ID", async () => {
        
        const res = await req.patch(`/todo/invalid_id`).send({ title: " todo Updated  " });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("todo is not valid");
    });

    afterAll(async () => {
        await todosmodel.clearDatabase();
    });
  });
})