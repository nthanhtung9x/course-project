const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const jwt = require("jsonwebtoken");
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
  

const URL_MONGO = 'mongodb+srv://nthanhtung9x:tung1998@cluster0.eythg.mongodb.net/<dbname>?retryWrites=true&w=majority';

const connectMongo = MongoClient.connect(URL_MONGO, { useNewUrlParser: true,useUnifiedTopology: true });

connectMongo.then(client => {
    console.log("connect database");
    const db = client.db('TCREATION');
    const users = db.collection('users');
    const role = db.collection('role');
    const features = db.collection('features');
    const courses = db.collection('courses');
    const registerCourses = db.collection('registerCourses');
    const videoCourses = db.collection('videoCourses');

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
        users.insertOne({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            idRole: "1",
            courses: []
        }).then(response => {
            return res.json({
                message:'success'
            });
        }).catch(err => console.log(err))
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
                        courses: []
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
            const checkRole = await role.findOne({
                idRole: checkUser.idRole
            });
            const token = jwt.sign({ id: checkUser._id, name:checkUser.name, username: checkUser.username, role: checkUser.idRole, features: checkRole.groupFeature }, "my_secret_key", {
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
                    return res.json(data);
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
                                // let registerCourseAfterConfirm = await registerCourses.find().toArray();
                                // let usersList = await users.find().toArray();
                                // let result = [];
                                // for(let i = 0; i < registerCourseAfterConfirm.length; i++) {
                                //     for(let j = 0; j < usersList.length; j++) {
                                //         if(registerCourseAfterConfirm[i].idUser.toString() === usersList[j]._id.toString()) {
                                //             result.push(usersList[j]);
                                //             break;
                                //         }
                                //     }
                                // }
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

    app.get('/getVideo', async(req, res) => {
        jwt.verify(req.headers.authorization, "my_secret_key", async(err,data) => {
            if(err) {
                res.sendStatus(403);
            } else {
                let checkRole = await users.findOne({
                    _id: new ObjectId(data.id)
                });
                if(checkRole) {
                   let result = await videoCourses.find().toArray();
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

}).catch(error => console.error(error))

//  jwt.verify(req.token, "my_secret_key", function (err, data) {
// const token = await jwt.verify(ctx.token, "my_secret_key");

app.listen(process.env.PORT || 8080);