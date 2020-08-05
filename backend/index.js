const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer'); 

const app = express();
require('dotenv').config();  

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
  

const URL_MONGO = 'mongodb+srv://nthanhtung9x:tung1998@cluster0.eythg.mongodb.net/TCREATION?retryWrites=true&w=majority';

const connectMongo = MongoClient.connect(process.env.MONGODB_URI || URL_MONGO, { useNewUrlParser: true,useUnifiedTopology: true });

connectMongo.then(client => {
    console.log("connect database");
    const db = client.db('TCREATION');
    const users = db.collection('users');
    const role = db.collection('role');
    const features = db.collection('features');
    const courses = db.collection('courses');
    const registerCourses = db.collection('registerCourses');
    const videoCourses = db.collection('videoCourses');
    const news = db.collection('news');
    const posts = db.collection('posts');
    const likes = db.collection('likes');
    const comments = db.collection('comments');
    const pendingFriends = db.collection('pendingFriends');
    const messages = db.collection('messages');


    app.get('/courses', async(req,res) => {
        const listUser = await courses.find().toArray();
        return res.json(listUser);
    });

    app.post('/signup', async(req,res) => {
        const checkUser = await users.findOne({
            username : req.body.username
        });
        if(checkUser) {
            return res.json({
                message:'failed'
            });
        } 
        let result = await users.insertOne({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            idRole: "1",
            courses: [],
            friendList: []
        });
        if(result.insertedCount > 0) {
            return res.json({
                message:'success'
            });
        }
        return res.json({
            message:'failed'
        });
        
    });

    app.post('/createUser', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    const checkUser = await users.findOne({
                        username : req.body.username
                    });
                    if(checkUser) {
                        return res.json({
                            message:'failed'
                        });
                    } 
                    const addUser = await users.insertOne({
                        username: req.body.username,
                        password: req.body.password,
                        name: req.body.name,
                        phone: req.body.phone,
                        address: req.body.address,
                        idRole: "1",
                        courses: [],
                        friendList: []
                    })
                    if(addUser.insertedCount > 0) {
                        let userList = await users.find().toArray();
                        return res.json({
                            userList
                        });
                    };
                    return res.json({
                        message:'failed'
                    });         
                }
                return res.sendStatus(403);
            }
        });

    });

    app.post('/signin', async(req,res) => {
        const checkUser = await users.findOne({
            $and: [
                {username : req.body.username},
                {password: req.body.password},
             ]
        });
        
        if(checkUser) {
            const token = jwt.sign({ id: checkUser._id, name:checkUser.name, username: checkUser.username, role: checkUser.idRole }, "my_secret_key", {
                expiresIn: "2h",
            });
            return res.json({token});
        }
        return res.json({});
    });

    app.get('/checkUser', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let check = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(check) {
                    let featureUser = await role.findOne({
                        idRole: check.idRole
                    });
                    
                    // check manager system
                    let isCheckManagerSystem = false;
                    let checkManagerSystem = await featureUser.groupFeature.findIndex(item => {
                        return item.toString() === "5f1015df39a6feaad03f4982"
                    });
                    if(checkManagerSystem !== -1) {
                        isCheckManagerSystem = true;
                    };

                    // check add course
                    let isCheckAddCourse = false;
                    let checkAddCourse = await featureUser.groupFeature.findIndex(item => {
                        return item.toString() === "5f1d18e306de7aaf66c86517"
                    });
                    if(checkAddCourse !== -1) {
                        isCheckAddCourse = true;
                    };

                    // check add register
                    let isCheckAddRegister = false;
                    let checkAddRegister = await featureUser.groupFeature.findIndex(item => {
                        return item.toString() === "5f1d29a406de7aaf66c8651a"
                    });
                    if(checkAddRegister !== -1) {
                        isCheckAddRegister = true;
                    };

                    // check update course
                    let isCheckUpdateCourse = false;
                    let checkUpdateCourse = await featureUser.groupFeature.findIndex(item => {
                        return item.toString() === "5f1d18f206de7aaf66c86518"
                    });
                    if(checkUpdateCourse !== -1) {
                        isCheckUpdateCourse = true;
                    };

                    // check create user
                    let isCheckCreateUser = false;
                    let checkCreateUser = await featureUser.groupFeature.findIndex(item => {
                        return item.toString() === "5f1d356d06de7aaf66c8651c"
                    });
                    if(checkCreateUser !== -1) {
                        isCheckCreateUser = true;
                    };

                    // check update user
                    let isCheckUpdateUser = false;
                    let checkUpdateUser = await featureUser.groupFeature.findIndex(item => {
                        return item.toString() === "5f1d357606de7aaf66c8651d"
                    });
                    if(checkUpdateUser !== -1) {
                        isCheckUpdateUser = true;
                    };

                    // check delete user
                    let isCheckDeleteUser = false;
                    let checkDeleteUser = await featureUser.groupFeature.findIndex(item => {
                        return item.toString() === "5f1d357f06de7aaf66c8651e"
                    });
                    if(checkDeleteUser !== -1) {
                        isCheckDeleteUser = true;
                    };

                     // check manager role
                     let isCheckManagerRole = false;
                     let checkManagerRole = await featureUser.groupFeature.findIndex(item => {
                         return item.toString() === "5f1e6fbd8b096576e3ba6c1b"
                     });
                     if(checkManagerRole !== -1) {
                         isCheckManagerRole = true;
                     };

                    return res.json({
                        id: data.id,
                        username: data.username,
                        name: data.name,
                        role: data.role,
                        checkManagerSystem: isCheckManagerSystem,
                        checkAddCourse: isCheckAddCourse,
                        checkAddRegister: isCheckAddRegister,
                        checkUpdateCourse: isCheckUpdateCourse,
                        checkCreateUser: isCheckCreateUser,
                        checkUpdateUser: isCheckUpdateUser,
                        checkDeleteUser: isCheckDeleteUser,
                        checkManagerRole: isCheckManagerRole
                    });
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/users', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let check = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(check) {
                    const usersList = await users.find().toArray();
                    return res.json(usersList);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.put('/updateUser', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    const updateUser = await users.findOneAndUpdate(
                        {
                            _id: new ObjectId(req.body.idUpdateUser)
                        },
                        {
                            $set: {
                                username: req.body.userNameUpdateUser,
                                password: req.body.passwordUpdateUser,
                                name: req.body.nameUpdateUser,
                                phone:req.body.phoneUpdateUser,
                                idRole: req.body.roleUpdateUser,
                                address: req.body.addressUpdateUser
                            }
                        },
                        {
                            upsert: false
                        }
                    )
                    if(updateUser.value) {
                        const usersList = await users.find().toArray();
                        return res.json(usersList);
                    } else {
                        return res.sendStatus(403);
                    }           
                }
                return res.sendStatus(403);
            }
        });
    });

    app.delete('/deleteUser', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    const updateUser = await users.deleteOne(
                        {
                            _id: new ObjectId(req.body.id)
                        }
                    )
                    if(updateUser.deletedCount) {
                        const usersList = await users.find().toArray();
                        return res.json(usersList);
                    } else {
                        return res.sendStatus(403);
                    }           
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/profile/:id', async(req,res) => {
        if(ObjectId.isValid(req.params.id)){
            const findUser = await users.findOne({
                _id: new ObjectId(req.params.id)
            })
            if(findUser) {
                return res.json({
                    name: findUser.name,
                    id: findUser._id
                })
            } else {
                res.sendStatus(404);
            }
        } else {
            return res.sendStatus(404);
        }   
    });

    app.get('/course/detail/:id', async(req,res) => {
        if(ObjectId.isValid(req.params.id)){
            const findCourse = await courses.findOne({
                _id: new ObjectId(req.params.id)
            })
            if(findCourse) {
                return res.json({
                    ...findCourse
                });
            } else {
                res.sendStatus(403);
            }
        } else {
            return res.sendStatus(403);
        }   
    });

    app.post('/registerCourses', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                return res.sendStatus(403);
            } else {
                let checkUser = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkUser) {
                    let checkExistsCourseInUser = await checkUser.courses.findIndex(item => {
                        return item.toString() === req.body.idCourse.toString()
                    }); 
                    if(checkExistsCourseInUser < 0) {
                        let checkRegisterCourse = await registerCourses.findOne({
                            $and: [
                                {idUser: new ObjectId(req.body.idUser)},
                                {idCourse: new ObjectId(req.body.idCourse)}
                            ]
                        })
                        if(checkRegisterCourse) {
                            return res.json({
                                message:'failed'
                            })
                        }
                        return registerCourses.insertOne({
                            idUser: new ObjectId(req.body.idUser),
                            idCourse: new ObjectId(req.body.idCourse)
                        }).then(response => {
                            return res.json({
                                message:'success'
                            })
                        }).catch(err => console.log(err))
                    }
                    return res.json({
                        message:'failed'
                    })
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/registerCoursesList', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let registerList = await registerCourses.find({
                        idCourse: new ObjectId(req.body.id)
                    }).toArray();
                    let usersList = await users.find().toArray();
                    let result = [];
                    for(let i = 0; i < registerList.length; i++) {
                        for(let j = 0; j < usersList.length; j++) {
                            if(registerList[i].idUser.toString() === usersList[j]._id.toString()) {
                                result.push(usersList[j]);
                                break;
                            }
                        }
                    }
                    return res.json({
                        users: [...result]
                    });
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/confirmRegister', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let registerList = await registerCourses.findOne({
                        $and: [
                            {idCourse: new ObjectId(req.body.idCourse)},
                            {idUser: new ObjectId(req.body.idUser)}
                        ]
                    });

                    let checkUser = await users.findOne({
                        _id: new ObjectId(req.body.idUser)
                    });

                    let checkExistsCourseInUser = await checkUser.courses.findIndex(item => {
                        return item.toString() === registerList.idCourse.toString()
                    })

                    if(checkExistsCourseInUser < 0) {
                        const addCourse = await users.findOneAndUpdate(
                            {
                                _id: new ObjectId(checkUser._id)
                            },
                            {
                                $set: {
                                    ...checkUser,
                                    courses: [...checkUser.courses,registerList.idCourse]
                                }
                            },
                            {
                                upsert: false
                            }
                        )
                        if(addCourse.value) {
                            let deleteRegister = await registerCourses.deleteOne({
                                _id: new ObjectId(registerList._id)
                            });
                            if(deleteRegister.deletedCount > 0) {
                                let findCourse = await courses.findOne({
                                    _id: new ObjectId(req.body.idCourse)
                                });

                                var today = new Date();
                                var dd = String(today.getDate()).padStart(2, '0');
                                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                var yyyy = today.getFullYear();
                                today = dd + '/' + mm + '/' + yyyy;

                                await news.insertOne({
                                    idUser: new ObjectId(addCourse.value._id),
                                    name: findCourse.name,
                                    imgURL: findCourse.image,
                                    title: 'Bạn đã được ghi danh thành công',
                                    time: today
                                })
                                return res.json({
                                    message: 'success'
                                });
                            }
                        }
                        return res.json({
                            message:'failed'
                        });
                    } else {
                        return res.json({
                            message:'failed'
                        });
                    }   
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/registedCoursesList', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkUser = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkUser) {
                    let usersList = await users.find().toArray();
                    let result = [];
                    for(let i = 0; i < usersList.length; i++) {
                        let item = usersList[i].courses;
                        for(let j = 0; j < item.length; j++) {
                            if(item[j].toString() === req.body.id.toString()){
                                result.push(usersList[i]);
                                break;
                            }
                        }
                    }
                    return res.json({
                        users: result
                    });
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getTeacher', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                return res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let teacherList = await users.find({
                        idRole: "2"
                    }).toArray();
                    if(teacherList) {
                        return res.json({
                            teachers: teacherList
                        })
                    }
                    return res.sendStatus(403);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/createCourse', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                return res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let checkCourse = await courses.findOne({
                        name: req.body.nameCourse
                    })

                    let checkAuthor = await users.findOne({
                        _id: new ObjectId(req.body.authorCourse)
                    })

                    if(!checkCourse) {
                        let addCourse = await courses.insertOne({
                            name: req.body.nameCourse,
                            description: req.body.descCourse,
                            image: req.body.uploadCourse,
                            author: checkAuthor.name,
                            idAuthor: new ObjectId(req.body.authorCourse),
                            timeStart: req.body.dateCourse,
                            type: req.body.typeCourse  
                        })
                        let coursesList = await courses.find().toArray();
                        return res.json({
                            listCourse: coursesList
                        })
                    }
                    return res.json({
                        message:'failed'
                    })
                }
                return res.sendStatus(403);
            }
        });
    });

    app.put('/cancelRegister', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let checkUser = await users.findOne({
                        _id: new ObjectId(req.body.idUser)
                    });
                    
                    let cancelRegister = await checkUser.courses.findIndex(item => {
                        return item.toString() === req.body.idCourse.toString();
                    });
                    let result = [...checkUser.courses];
                    result.splice(cancelRegister,1);

                    if(cancelRegister >= 0) {
                        const updateUser = await users.findOneAndUpdate(
                            {
                                _id: new ObjectId(req.body.idUser)
                            },
                            {
                                $set: {
                                    ...checkUser,
                                    courses: result
                                }
                            },
                            {
                                upsert: false
                            }
                        )
                        if(updateUser.value) {
                            // const usersList = await users.find().toArray();
                            // let temp = [];
                            // for(let i = 0; i < usersList.length; i++) {
                            //     let item = usersList[i].courses;
                            //     for(let j = 0; j < item.length; j++) {
                            //         if(item[j].toString() === req.body.idCourse.toString()){
                            //             result.push(usersList[i]);
                            //             break;
                            //         }
                            //     }
                            // }
                            return res.json({
                                message: 'success'
                            });
                        } else {
                            return res.sendStatus(403);
                        }           
                    }
                    return res.sendStatus(403);

                }
                return res.sendStatus(403);
            }
        });
    });

    app.put('/updateCourse', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                return res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    const checkAuthor = await users.findOne({
                        _id: new ObjectId(req.body.idAuthor)
                    });
                    console.log(checkAuthor);
                    const updateCourse = await courses.findOneAndUpdate(
                        {
                            _id: new ObjectId(req.body.id)
                        },
                        {
                            $set: {
                                name: req.body.name,
                                description: req.body.description,
                                image: req.body.image,
                                author:checkAuthor.name,
                                idAuthor: checkAuthor._id,
                                timeStart: req.body.timeStart,
                                type: req.body.type
                            }
                        },
                        {
                            upsert: false
                        }
                    )
                    if(updateCourse.value) {
                        const newCoursesList = await courses.find().toArray();
                        return res.json({
                            listCourse: newCoursesList
                        })
                    }
                    return res.json({
                        message: 'failed'
                    })
                }
                return res.sendStatus(403);
            }
        });
    });
    
    app.delete('/deleteCourse', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    const deleteCourse = await courses.deleteOne({
                        _id: new ObjectId(req.body.id)
                    });
                    if(deleteCourse.deletedCount > 0) {
                        const newCoursesList = await courses.find().toArray();
                        return res.json({
                            listCourse: newCoursesList
                        })
                    }
                    return res.json({
                        message: 'failed'
                    })
                }
                return res.sendStatus(403);
            }
        });
    });

    app.delete('/removeRegister', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let checkExist = await registerCourses.findOne({
                        $and: [
                            {idCourse: new ObjectId(req.body.idCourse)},
                            {idUser: new ObjectId(req.body.idUser)}
                        ]
                    })
                    if(checkExist) {
                        let removeRegister = await registerCourses.deleteOne({
                            _id: new ObjectId(checkExist._id)
                        });
                        if(removeRegister.deletedCount > 0) {
                            return res.json({
                                message: 'success'
                            })
                        }
                        return res.json({
                            message: 'failed'
                        })
                    }
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getCoursesOfUser', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let coursesData = await courses.find().toArray();

                    let coursesList = [];
                    for(let i = 0; i < checkRole.courses.length; i++) {
                        let item = checkRole.courses[i];
                        for(let j = 0; j < coursesData.length; j++) {
                            if(item.toString() === coursesData[j]._id.toString()){
                                coursesList.push(coursesData[j]);
                                break;
                            }
                        }
                    }
                    return res.json({
                        coursesList
                    })
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getDetailUser', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let roleUser = await role.findOne({
                        idRole: checkRole.idRole 
                    });
                    return res.json({
                        detailUser: {...checkRole,roleName:roleUser.name}
                    })
                }
                return res.sendStatus(403);
            }
        });
    });

    app.put('/updateDetailUser', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let updateUser = await users.findOneAndUpdate(
                        {
                            _id: new ObjectId(req.body.id)
                        },
                        {
                            $set: {
                                username: req.body.username,
                                name:req.body.name,
                                password:req.body.password,
                                idrole: checkRole.idRole,
                                phone: req.body.phone,
                                address:  req.body.address,
                                courses: checkRole.courses,
                                friendList: checkRole.friendList
                            }
                        },
                        {
                            upsert: false
                        }   
                    );
                    if(updateUser.value) {
                        let roleUser = await role.findOne({
                            idRole: checkRole.idRole 
                        });
                        let userAfter = await users.findOne({
                            _id: new ObjectId(req.body.id)
                        })
                        return res.json({
                            detailUser: {...userAfter,roleName:roleUser.name}
                        })
                    }
                    return res.sendStatus(403);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getVideoCourse/:id', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    if(ObjectId.isValid(req.params.id)){
                        const findCourse = await courses.findOne({
                            _id: new ObjectId(req.params.id)
                        });
                        const findVideoCourses = await videoCourses.find({
                            idCourse: new ObjectId(req.params.id)
                        }).toArray();
                        if(findVideoCourses) {
                            return res.json({
                                videoCourse: findVideoCourses,
                                image: findCourse.image
                            });
                        } else {
                            res.sendStatus(404);
                        }
                    } else {
                        return res.sendStatus(404);
                    }   
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/addVideo', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let addVideo = await videoCourses.insertOne({
                        serial: req.body.serial,
                        name: req.body.name,
                        videoURL: req.body.url,
                        idCourse: new ObjectId(req.body.idCourse)
                    });
                    if(addVideo.insertedCount > 0) {
                        return res.json({
                            message:'success'
                        });
                    }
                    return res.json({
                        message:'failed'
                    });
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getVideo/:id', async(req, res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                   let result = await videoCourses.find({
                       idCourse: new ObjectId(req.params.id)
                   }).toArray();
                   return res.json(result);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.put('/updateVideo', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {

                    let updateVideo = await videoCourses.findOneAndUpdate(
                        {
                            _id: new ObjectId(req.body.idVideo)
                        },
                        {
                            $set:   {
                                        serial: req.body.serial,
                                        name: req.body.name,
                                        videoURL: req.body.url,
                                        idCourse: new ObjectId(req.body.idCourse)
                                    }        
                        }
                    );
                    if(updateVideo.value) {
                        return res.json({
                            message:'success'
                        });
                    }
                    return res.json({
                        message:'failed'
                    });
                }
                return res.sendStatus(403);
            }
        });
    });

    app.delete('/deleteVideo', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {

                    let deleteVideo = await videoCourses.deleteOne(
                        {
                            _id: new ObjectId(req.body.idVideo)
                        }
                    );
                    if(deleteVideo.deletedCount > 0) {
                        return res.json({
                            message:'success'
                        });
                    }
                    return res.json({
                        message:'failed'
                    });
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getRoles', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let roleList = await role.find().toArray();
                    return res.json(roleList);
                   
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/addRole', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let roleList = await role.find().toArray();
                    let maxRoleCount = Math.max(...roleList.map(item => +item.idRole));
                    
                    let findExist = await roleList.findIndex((item) => {
                        return item.name === req.body.nameRole;
                    });

                    if(findExist !== -1) {
                        return res.json({
                            message:'failed'
                        });
                    }

                    let addRole = await role.insertOne({
                        idRole: (maxRoleCount + 1).toString(),
                        name: req.body.nameRole,
                        groupFeature: req.body.groupFeature
                    })
                    if(addRole.insertedCount > 0) {
                        let newRoleList = await role.find().toArray();
                        return res.json(newRoleList);
                    }
                    return res.json({
                            message:'failed'
                        });

                }
                return res.sendStatus(403);
            }
        });
    });

    app.put('/updateRole', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let updateRole = await role.findOneAndUpdate(
                        {
                            _id: new ObjectId(req.body.idUpdateRole)
                        },
                        {
                            $set: {
                                name: req.body.nameUpdateRole,
                                idRole: req.body.idRole,
                                groupFeature: req.body.groupUpdateFeature
                               
                            }
                        },
                        {
                            upsert: false
                        }
                    )
                    if(updateRole.value) {
                        let newRoleList = await role.find().toArray();
                        return res.json(newRoleList);
                    }
                    return res.json({
                            message:'failed'
                        });

                }
                return res.sendStatus(403);
            }
        });
    });

    app.delete('/deleteRole', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let deleteRole = await role.deleteOne(
                        {
                            _id: new ObjectId(req.body.id)
                        }
                    );
                    if(deleteRole.deletedCount > 0) {
                        let newRoleList = await role.find().toArray();
                        return res.json(newRoleList);
                    }
                    return res.json({
                        message:'failed'
                    });
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getFeatures', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let featureList = await features.find().toArray();
                    return res.json(featureList);
                
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getNews', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let notiList = await news.find({
                        idUser: new ObjectId(checkRole._id)
                    }).toArray();
                    return res.json(notiList)
                }
                return res.sendStatus(403);
            }
        });
    });

    app.delete('/deleteNews', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let deleteNoti = await news.deleteOne({
                        _id: new ObjectId(req.body.id)
                    });
                    if(deleteNoti.deletedCount > 0) {
                        let notiList = await news.find({
                            idUser: new ObjectId(checkRole._id)
                        }).toArray();
                        return res.json(notiList);
                    }
                    return res.sendStatus(403);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getPostById/:id', async(req, res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let postList = await posts.find({
                        idUser: new ObjectId(req.params.id)
                    }).toArray();
                    let likePostList = await likes.find().toArray();
                    return res.json({
                        postList,
                        likePost: likePostList
                    });
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/createPost', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    var currentdate = new Date().toLocaleString(); 
                    // var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " " + currentdate.getHours() + "h" + currentdate.getMinutes();
                    let createPost = await posts.insertOne({
                        idUser: new ObjectId(checkRole._id),
                        content: req.body.content,
                        img: req.body.img,
                        time:currentdate,
                        hashtag: req.body.hashtag,
                        like: 0
                    });
                    if(createPost.insertedCount > 0) {
                        let postList = await posts.find({
                            idUser: new ObjectId(checkRole._id)
                        }).toArray();
                        return res.json(postList);
                    }
                    return res.sendStatus(403);
                }
                return res.sendStatus(403);
            }
        });
    });
    app.delete('/deletePost/:id', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let deletePost = await posts.deleteOne(
                        {
                            _id: new ObjectId(req.params.id)
                        }
                    );
                    if(deletePost.deletedCount > 0) {
                        let postList = await posts.find({
                            idUser: new ObjectId(checkRole._id)
                        }).toArray();
                        return res.json(postList);
                    }
                    return res.sendStatus(403);
                }
                return res.sendStatus(403);
            }
        });
    });
    app.put('/updatePost', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                   let updatePost = await posts.findOneAndUpdate(
                        {
                           _id: new ObjectId(req.body.idUpdatePost)
                        },
                        {   $set: {
                                idUser: new ObjectId(req.body.idUserUpdatePost),
                                content: req.body.contentUpdatePost,
                                img: req.body.imgUpdatePost,
                                time: req.body.timeUpdatePost,
                                hashtag: req.body.hashTagUpdatePost,
                                like: parseInt(req.body.likeUpdatePost)
                            }
                        },
                        {
                            upsert: false
                        }
                    );
                    if(updatePost.value) {
                        let postList = await posts.find({
                            idUser: new ObjectId(req.body.idUserUpdatePost)
                        }).toArray();
                        return res.json(postList);
                    }
                    return res.sendStatus(403);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/likePost', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let checkLikePost = await likes.findOne({
                        $and : [
                            { idPost: new ObjectId(req.body.idPost) },
                            { idUser: new ObjectId(checkRole._id) }
                        ]
                    });
                    if(checkLikePost) {
                        let deleteLikePost = await likes.deleteOne({
                            _id: new ObjectId(checkLikePost._id)
                        });
                        let findPost = await posts.findOne({
                            _id: new ObjectId(req.body.idPost)
                        });
                        let updateLikePost = await posts.findOneAndUpdate(
                            {
                                _id: new ObjectId(req.body.idPost)
                            },
                            {
                                $set: {
                                    ...findPost,
                                    like: findPost.like - 1
                                }
                            },
                            {
                                upsert: false
                            }
                        );

                        let postList = await posts.find({
                            idUser: new ObjectId(req.body.idUser)
                        }).toArray();
                        let likePost = await likes.find().toArray();

                        return res.json({
                            postList,
                            likePost                      
                        });
                    } else {
                        let addToLikePost = await likes.insertOne({
                            idPost: new ObjectId(req.body.idPost),
                            idUser: new ObjectId(checkRole._id)
                        })
                        let findPost = await posts.findOne({
                            _id: new ObjectId(req.body.idPost)
                        });
                        let updateLikeCount = await posts.findOneAndUpdate(
                            {
                                _id: new ObjectId(req.body.idPost)
                            },
                            {
                                $set: {
                                    ...findPost,
                                    like: findPost.like + 1
                                }
                            },
                            {
                                upsert: false
                            }
                        );
                        if(addToLikePost.insertedCount > 0) {
                            let newPostList = await posts.find({
                                idUser: new ObjectId(req.body.idUser)
                            }).toArray();
                            let likePostList = await likes.find().toArray();
                            return res.json({
                                postList: newPostList,
                                likePost: likePostList                          
                            });
                        }
                        return res.sendStatus(403);
                    }

                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getCommentPost/:id', async(req,res) => {
        let commentPost = await comments.find({
            idPost: new ObjectId(req.params.id)
        }).toArray();
        return res.json(commentPost);
    });

    app.post('/createCommentPost', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let addCommentPost = await comments.insertOne({
                        idPost: new ObjectId(req.body.idPost),
                        idUser: new ObjectId(req.body.idUser),
                        name: req.body.name,
                        content: req.body.content
                    })
                    if(addCommentPost.insertedCount > 0) {
                        let commentList = await comments.find({
                            idPost: new ObjectId(req.body.idPost)
                        }).toArray();
                        return res.json(commentList);
                    }
                }
                return res.sendStatus(403);
            }
        });
    });

    app.delete('/deleteCommentPost/:id', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let deleteCommentPost = await comments.deleteOne({
                        _id: new ObjectId(req.params.id)
                    })
                    if(deleteCommentPost.deletedCount > 0) {
                        let commentList = await comments.find({
                            idPost: new ObjectId(req.body.idPost)
                        }).toArray();
                        return res.json(commentList);
                    }
                }
                return res.sendStatus(403);
            }
        });
    });

    app.put('/updateCommentPost', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let updateCommentPost = await comments.findOneAndUpdate(
                        {
                        _id: new ObjectId(req.body.idUpdateComment)
                        },
                        {
                            $set: {
                                idPost: new ObjectId(req.body.idPostUpdateComment),
                                idUser: new ObjectId(req.body.idUserUpdateComment),
                                name: req.body.nameUpdateComment,
                                content: req.body.contentUpdateComment
                            }
                        },
                        {
                            upsert: false
                        }
                    )
                    if(updateCommentPost.value) {
                        let commentList = await comments.find({
                            idPost: new ObjectId(req.body.idPost)
                        }).toArray();
                        return res.json(commentList);
                    }
                }
                return res.sendStatus(403);
            }
        });
    });

    // add friend
    app.get('/getNewsAddFriend', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let pendingFriendList = await pendingFriends.find({
                        idUserAdded: new ObjectId(checkRole._id)
                    }).toArray();
                    return res.json(pendingFriendList);
                }
                return res.sendStatus(403);
            }
        });
    })

    app.post('/addPendingFriend', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let checkExists = await pendingFriends.findOne({
                        $and: [
                            {idUserAdded: new ObjectId(req.body.idUserAdded)},
                            {idUserAdd: new ObjectId(req.body.idUserAdd)},
                        ]
                    });

                    let checkExistsFriend = await users.findOne({
                        _id: new ObjectId(req.body.idUserAdded)
                    });

                    let index = 0;
                    if(checkExistsFriend) {
                        for(let value of checkExistsFriend.friendList) {
                            if(value === req.body.idUserAdd.toString()){
                                index++;
                                break;
                            }
                        };
                    }

                    if(checkExists) {
                        return res.json({
                            message: 'Chờ duyệt'
                        })
                    } else if(!checkExists && index <= 0) {
                        let addToPendingFriends = await pendingFriends.insertOne({
                            idUserAdd: new ObjectId(req.body.idUserAdd),
                            nameUserAdd: req.body.nameUserAdd,
                            idUserAdded: new ObjectId(req.body.idUserAdded),
                        })
                        if(addToPendingFriends.insertedCount > 0) {
                            return res.json({
                                message:'Gửi thành công'
                            })
                        };
                    } else if(!checkExists && index >= 0) {
                        return res.json({
                            message: 'Đã là bạn bè'
                        })
                    };
                }
                return res.sendStatus(403);
            }
        });
    })

    app.delete('/deleteNewsAddFriend', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let deleteNoti = await pendingFriends.deleteOne({
                        _id: new ObjectId(req.body.id)
                    });
                    if(deleteNoti.deletedCount > 0) {
                        let notiPendingList = await pendingFriends.find({
                            idUserAdded: new ObjectId(checkRole._id)
                        }).toArray();
                        return res.json(notiPendingList);
                    }
                    return res.sendStatus(403);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.put('/addFriend', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                let checkRole2 = await users.findOne({
                    _id: new ObjectId(req.body.idUserAdd)
                });
                if(checkRole && checkRole2) {
                    let addFriend1 = await users.findOneAndUpdate(
                        {
                            _id: new ObjectId(checkRole._id)
                        },
                        {
                            $set: {
                                ...checkRole,
                                friendList: [...checkRole.friendList, req.body.idUserAdd]
                            }
                        },
                        {
                            upsert: false
                        }
                    );

                    let addFriend2 = await users.findOneAndUpdate(
                        {
                            _id: new ObjectId(checkRole2._id)
                        },
                        {
                            $set: {
                                ...checkRole2,
                                friendList: [...checkRole2.friendList, req.body.idUserAdded]
                            }
                        },
                        {
                            upsert: false
                        }
                    );
                    if(addFriend1.value && addFriend2.value) {
                        let removePending = await pendingFriends.deleteOne({
                            _id: new ObjectId(req.body.id)
                        })
                        if(removePending.deletedCount > 0) {
                            let notiPendingList = await pendingFriends.find({
                                idUserAdded: new ObjectId(checkRole._id)
                            }).toArray();
                            return res.json({
                                pendingList: notiPendingList,
                                message: true
                            });
                        } 
                        return res.json({
                            message: false
                        })
                    }
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getFriend/:id', async(req,res) => {
        let getFriendList = await users.findOne({
            _id: new ObjectId(req.params.id)
        });
        let getUser = await users.find().toArray();
        let list = getFriendList.friendList;
        let result = [];
        for(let i = 0; i < list.length; i++) {
            for(let j = 0; j < getUser.length; j++) {
                if(list[i].toString() === getUser[j]._id.toString()) {
                    result.push({
                        id: getUser[j]._id,
                        name: getUser[j].name
                    })
                    break;
                }
            }
        }

        return res.json({results: result})


    });

    app.put('/unfriend/:id', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let list = checkRole.friendList;
                    let checkIndex = await list.findIndex(item => {
                        return item.toString() === req.params.id.toString()
                    });

                    let checkRole2 = await users.findOne({
                        _id: new ObjectId(req.params.id)
                    });
                    let listUser2 = checkRole2.friendList;
                    let checkIndex2 = await listUser2.findIndex(item => {
                        return item.toString() === checkRole._id.toString()
                    });
                    if(checkIndex !== -1 && checkIndex2 !== -1) {
                        await list.splice(checkIndex, 1);
                        let updateFriendList = await users.findOneAndUpdate(
                            {
                                _id: new ObjectId(checkRole._id)
                            },
                            {
                                $set: {
                                    ...checkRole,
                                    friendList: list
                                }
                            },
                            {
                                upsert:false
                            }
                        )

                        await listUser2.splice(checkIndex, 1);
                        let updateFriendList2 = await users.findOneAndUpdate(
                            {
                                _id: new ObjectId(req.params.id)
                            },
                            {
                                $set: {
                                    ...checkRole2,
                                    friendList: listUser2
                                }
                            },
                            {
                                upsert:false
                            }
                        )
                        if(updateFriendList.value && updateFriendList2.value) {
                            let getFriendList = await users.findOne({
                                _id: new ObjectId(checkRole._id)
                            });
                            let friendListUser = getFriendList.friendList;
                            let getUser = await users.find().toArray();
                            let result = [];
                            for(let i = 0; i < friendListUser.length; i++) {
                                for(let j = 0; j < getUser.length; j++) {
                                    if(friendListUser[i].toString() === getUser[j]._id.toString()) {
                                        result.push({
                                            id: getUser[j]._id,
                                            name: getUser[j].name
                                        })
                                        break;
                                    }
                                }
                            }

                            return res.json({results: result})
                        }
                        return res.sendStatus(403);
                    }
                }
                return res.sendStatus(403);
            }
        });
    });

    // send message
    app.post('/sendMessage', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    if(!req.body.content) {
                        return res.json({
                            message: false
                        })
                    }
                    let addMess = await messages.insertOne({
                        idSend: new ObjectId(req.body.idSend),
                        idReceive: new ObjectId(req.body.idReceive),
                        content: req.body.content,
                        name: checkRole.name
                    })
                    if(addMess.insertedCount > 0) {
                        return res.json({
                            message: true
                        })
                    }
                    return res.json({
                        message: false
                    })
                }
                return res.sendStatus(403);
            }
        });
    });

    app.get('/getNewsMessage', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let getMessageList = await messages.find({
                        idReceive: new ObjectId(checkRole._id)
                    }).toArray();

                    return res.json(getMessageList);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.delete('/deleteNewsMessage', async(req,res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                    let deleteMessage = await messages.deleteOne({
                        _id: new ObjectId(req.body.id)
                    });
                    if(deleteMessage.deletedCount > 0) {
                        let getMessageList = await messages.find({
                            idReceive: new ObjectId(checkRole._id)
                        }).toArray();
                        return res.json(getMessageList);
                    }
                    return res.sendStatus(403);
                }
                return res.sendStatus(403);
            }
        });
    });

    app.post('/getPassword', async(req,res) => {
        let isCheckMail = await users.findOne({
            username: req.body.username 
        });
        if(isCheckMail) {
              
            let mailDetails = { 
                from: 'tcreation.work@gmail.com', 
                to: req.body.username.toLowerCase().trim(), 
                subject: 'Lấy lại mật khẩu', 
                html: `
                    <div 
                        style="border:1px solid black;padding: 0 12px;color:black;border-radius: 8px;background: lemonchiffon;text-align: center;"
                    >
                        <h2 style="margin: 8px 0 4px;font-size:16px">TCREATION đã nhận thông tin và phản hồi:</h2>
                        <div style="font-size:16px">Mật khẩu của bạn: <strong>${isCheckMail.password}</strong></div>
                        <p style="margin: 4px 0;font-size:16px">Chúc bạn học hành tốt !!!</p>
                        <article style="margin-bottom: 8px;font-size:16px">Happy Coding, <br/> <strong>TCREATION</strong></article>
                    </div>
                `
            }; 

            mailTransporter.sendMail(mailDetails, function(err, data) { 
                if(err) { 
                    console.log('Error Occurs');
                    return res.json({
                        message: false
                    }) 
                } else { 
                    console.log('Email sent successfully');
                    return res.json({
                        message: true
                    }) 
                } 
            });  
        } else {
            return res.json({
                message: false
            }) 
        }

          
    });

    app.get('/searchUser/:name', async(req,res) => {
        let name = req.params.name;
        let userList = await users.find().toArray();
        let findUser = userList.filter(item => {
            return item.name.toLowerCase().trim().indexOf(name.toLowerCase().trim()) !== -1;
        });
        return res.json(findUser);
    })

}).catch(error => console.error(error))

//  jwt.verify(req.token, "my_secret_key", function (err, data) {
// const token = await jwt.verify(ctx.token, "my_secret_key");

let mailTransporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: 'tcreation.work@gmail.com', 
        pass: 'Tung1998@'
    }
}); 

app.listen(process.env.PORT || 8080);