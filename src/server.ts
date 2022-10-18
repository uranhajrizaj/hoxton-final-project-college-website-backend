import {PrismaClient} from "@prisma/client";
import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {generateToken, getToken, hash} from "./Auth";


dotenv.config();

const prisma = new PrismaClient({
    log: ["error", "info", "query", "warn"]
});

const app = express();
const SECRET = process.env.SECRET!;
const port = 4455;

app.use(cors());
app.use(express.json());

async function getCurrentUser(token: string) {
    const decodedData = jwt.verify(token, SECRET);
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: decodedData.id }
      })
    if (!user) return null;
    return user ;
  }

app.get("/class/:name", async (req, res) => {
    try {
        const classByName = await prisma.class.findMany({
            where: {
                name: req.params.name
            },
            select: {
                name: true,
                students: {
                    select: {
                        id: true,
                        fullname: true,
                        image: true,
                        email: true
                    }
                },
                teachers: {
                    select: {
                        id: true,
                        fullname: true,
                        image: true,
                        email: true
                    }
                },
                subjects: true
            }
        })
        res.send(classByName)
    } catch (error) { // @ts-ignore
        res.status(400).send({errors: error.message})
    }
})

app.get("/student/:email", async (req, res) => {
    try {
        const student = await prisma.user.findMany({
            where: {
                email: req.params.email
            },
            select: {
                id: true,
                fullname: true,
                image: true,
                email: true,
                password: true,
                class: {
                    select : {
                        name: true,
                        subjects: {
                            select: {
                                id: true,
                                name: true,
                                professors: {
                                    select: {
                                        id: true,
                                        fullname: true,
                                        image: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                },
                parent: {
                    select: {
                        id: true,
                        fullname: true,
                        image: true,
                        email: true
                    }
                }

            }
        })
        res.send(student)
    } catch (error) { // @ts-ignore
        res.status(400).send({errors: error.message})
    }
})

app.get("/teacher/:email", async (req, res) => {
    try {
        const teacher = await prisma.user.findMany({
            where: {
                email: req.params.email
            },
            select: {
                id: true,
                fullname: true,
                image: true,
                email: true,
                password: true,
                classes: {
                    select: {
                        name: true,
                        students: {
                            select: {
                                id: true,
                                fullname: true,
                                image: true,
                                email: true
                            }
                        }
                    }
                },
                subjects: true
            }
        })
        res.send(teacher)
    } catch (error) { // @ts-ignore
        res.status(400).send({errors: error.message})
    }
})

app.get("/parent/:email", async (req, res) => {
    try {
        const parent = await prisma.user.findMany({
            where: {
                email: req.params.email
            },
            select: {
                id: true,
                fullname: true,
                image: true,
                email: true,
                password: true,
                childrens: {
                    select: {
                        fullname: true,
                        image: true,
                        email: true,
                        class: {
                            select : {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        res.send(parent)
    } catch (error) { // @ts-ignore
        res.status(400).send({errors: error.message})
    }
})

app.post("/subject", async (req, res) => {
    const newSubject = await prisma.subject.create({
        data: {
            name: req.body.name,
            classes: {
                connect: req.body.classes.map(
                    (classNname : string) => ({name: classNname})
                )
            },
            professors: {
                connect: {
                    email: req.body.teacher
                }
            }
        }
    })
    res.send(newSubject)
})

app.post("/class", async (req, res) => {
    const newSubject = await prisma.class.create({
        data: {
            name: req.body.name,
            teachers: {
                connect: {
                    email: req.body.teacher
                }
            },
            students: {
                connect: req.body.sudents.map(
                    (email : string) => ({email: email})
                )
            },
            subjects: {
                connect: req.body.subjects.map(
                    (name : string) => ({name: name})
                )
            }

        }
    })
    res.send(newSubject)
})

app.post("/users", async (req, res) => {
    try {
        const {
            fullname,
            image,
            email,
            password,
            role
        } = req.body;

        const findUser = await prisma.user.findUnique({where: {
                email
            }});

        const errors: string[] = [];

        if (typeof fullname !== "string") {
            errors.push("Fullname not provided or not a string");
        }

        if (typeof image !== "string") {
            errors.push("Image not provided or not a string");
        }

        if (typeof email !== "string") {
            errors.push("Email not provided or not a string");
        }

        if (typeof role !== "string") {
            errors.push("Role not provided or not a string");
        }
        if (typeof password !== "string") {
            errors.push("Password not provided or not a string");
        }


        if (errors.length > 0) {
            res.status(400).send({errors});
            return
        }

        if (findUser) 
            res.send({message: "This account already exists"})
         else {
            const user = await prisma.user.create({
                data: {
                    fullname,
                    image,
                    email,
                    password: hash(password),
                    role
                }
            });
            const token = generateToken(user.id);
            res.send({user, token});
        }


    } catch (error) { // @ts-ignore
        res.status(400).send({errors: error.message});
    }
})

app.post("/sign-in", async (req, res) => {
    try {
        const {email, password} = req.body;

        const errors: string[] = [];

        if (typeof email !== "string") {
            errors.push("Email not provided or not a string");
        }
        if (typeof password !== "string") {
            errors.push("Password not provided or not a string");
        }

        if (errors.length > 0) {
            res.status(400).send({errors});
            return;
        }

        const user = await prisma.user.findUnique({where: {
                email
            }});
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user.id);
            res.send({user, token});
        } else {
            res.status(400).send({errors: ["Wrong email or password. Try again"]});
        }
    } catch (error) { 
        // @ts-ignore
        res.status(400).send({ errors: [error.message]
        });
    }
})

app.get("/validate", async (req, res) => {
    try {
        if (req.headers.authorization) {
          const user = await getCurrentUser(req.headers.authorization);
          // @ts-ignore
          res.send({ user, token: getToken(user.id) });
        }
      } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message });
      }
});

app.post("/news",async(req,res)=>{
    try{
        const newPost={
            title:req.body.title,
            content:req.body.content,
            image:req.body.image
        }
        const news = await prisma.news.create({data:newPost})
        res.send(news)
    }catch (error) { 
        // @ts-ignore
        res.status(400).send({ errors: [error.message]
        });
    }
 
})

app.listen(port, () => {
    console.log(`Serveri is running on: http://localhost:${port}`);
});
