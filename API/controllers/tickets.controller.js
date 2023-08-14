const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var admin = require("firebase-admin");
var serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://db-test-9b6af-default-rtdb.firebaseio.com"
});
const db = getFirestore();

module.exports.all_tickets = async (req, res) => {
    const ticketsRef = db.collection('tickets');
    const snapshot = await ticketsRef.get();

    snapshot.forEach(doc => {
        res.send(doc.data())
    });
}