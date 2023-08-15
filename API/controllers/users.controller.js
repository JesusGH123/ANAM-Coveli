const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const USERS = 'users';

let admin = require("firebase-admin");
let serviceAccount = require("../key.json");

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