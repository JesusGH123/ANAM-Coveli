const { getFirestore, QuerySnapshot } = require('firebase-admin/firestore');

const USERS = 'users';

const db = getFirestore();

//Get all registered users
module.exports.get_users = async (req, res) => {
    const userRef = await db.collection(USERS).get();
    const users = [];

    userRef.forEach(doc => {
        users.push(doc.data());
    });

    res.send(users);
}

//Get a single user
module.exports.get_user = (req, res) => {
    db.collection(USERS).where("email", "==", req.params.email)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                res.json(doc.data());
            })
        })
        .catch((error) => {
            console.log("Error getting the document: " + error);
        })
}

//Add a new user
module.exports.add_user = async (req, res) => {
    await db.collection(USERS).add(req.body).then(() => {
        res.send("1");
    }).catch((error) => {
        res.send("-1");
    });
}

//Delete a user
module.exports.delete_user = async (req, res) => {
    db.collection(USERS).doc(req.params.id).delete().then(() => {
        res.send("1");
    }).catch((error) => {
        res.send("-1");
    })
}

//Validate a user
module.exports.validate_user = async (req, res) => {
    let result = 0;
    const user = await db.collection(USERS)
        .where("email", "==", req.body.email)
        .where("password", "==", req.body.password)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                result = doc.id;
            })
        })
    console.log(result);
    res.send(result)
}