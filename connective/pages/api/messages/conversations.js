const mysql = require("mysql2")
import {withIronSession} from "next-iron-session"

export async function handler(req, res) {
    try {
        let user = req.session.get().user;
        if(typeof(user) == "undefined") {
            return res.status(403).json({success: false, error: "Not signed in"})
        }
        if (req.method == "GET") {
            const connection = mysql.createConnection(process.env.DATABASE_URL);
            var [results] = await connection
                .promise()
                .query(
                    `select distinct sender, receiver from messages where sender = ${user.id} union all select distinct sender, receiver from messages where receiver = ${user.id};`
                );
            var [profiles] = await connection
                .promise()
                .query(`SELECT Users.id, Users.email, Business.company_name as username, Business.location, Business.logo FROM Users JOIN Business on Users.id = Business.user_id UNION ALL SELECT Users.id, Users.email, Individual.name as username, Individual.location, Individual.profile_picture AS logo FROM Users JOIN Individual on Users.id = Individual.user_id;`)
            let temp = []
            results.forEach(result => {
                temp.push(profiles.filter((a) => a.id == result.sender || a.id == result.receiver))
            })
            let conversations = []
            temp.forEach(item => {
                if(conversations.filter(a => a.id == item.id).length == 0) {
                    conversations.push(item)
                }
            })
            res.status(200).json(temp);
        }
    } catch(e) {
        console.log(e)
        return res.status(500).json({success: false, error: e})
    }
} 

export default withIronSession(handler, {
    password: process.env.APPLICATION_SECRET,
    cookieName: "Connective",
    // if your localhost is served on http:// then disable the secure flag
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "4mb"
        }
    }
}