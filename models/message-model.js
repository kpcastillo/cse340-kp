const pool = require('../database/')

/* ****************************************
*  Add new message to the database
* *************************************** */
async function handleMessageForm(message_firstname, message_lastname, message_email, message_subject, message_body) {
    try {
        const sql = 'INSERT INTO messages (message_firstname, message_lastname, message_email, message_subject, message_body, client_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        const values = [message_firstname, message_lastname, message_email, message_subject, message_body]
        return await pool.query(sql, values)
    } catch (error) {
        console.error('Error adding message:', error)
        return error.message
    }
}

/* ****************************************
 * Get all messages from the database
* *************************************** */
async function getMessages() {
    try {
        const sql = 'SELECT * FROM public.messages ORDER BY message_id DESC'
        return await pool.query(sql)
    } catch (error) {
        console.error('Error retrieving messages from the db:', error)
        return error.message
    }
}



module.exports = {
  handleMessageForm, getMessages
}