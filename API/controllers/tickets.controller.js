const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const TICKETS = 'tickets';

let admin = require("firebase-admin");
let serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://db-test-9b6af-default-rtdb.firebaseio.com"
});
const db = getFirestore();

//Get tickets for current user (needs validation)
module.exports.get_tickets = async (req, res) => {
  const ticketsRef = db.collection(TICKETS);
  const snapshot = await ticketsRef.get();
  const tickets = [];

  snapshot.forEach(doc => {
      tickets.push(doc.data())
  });

  res.send(tickets);
}

//Get a single ticket
module.exports.get_ticket = async (req, res) => {
  const ticketRef = db.collection(TICKETS).doc(req.params.id);
  const doc = await ticketRef.get();

  res.send(doc.data());
}

//Add a ticket
module.exports.add_ticket = async (req, res) => {
  await db.collection(TICKETS).add(req.body);
}

//Delete a ticket
module.exports.delete_ticket = (req, res) => {
  db.collection(TICKETS).doc(req.params.id).delete().then(() => {
    res.send("1");
  }).catch((error) => {
    res.send("-1");
  })
}