const pool = require("../database/")

/* ****************************************
*  Add new message to the database
* *************************************** */
async function handleMessageForm(
    message_firstname, 
    message_lastname, 
    message_email, 
    message_subject, 
    message_body) {
    try {
        const sql = 'INSERT INTO public.message_request (message_firstname, message_lastname, message_email, message_subject, message_body) VALUES ($1, $2, $3, $4, $5) RETURNING *'
        const values = [
            message_firstname, 
            message_lastname, 
            message_email, 
            message_subject, 
            message_body
        ]
        const result = await pool.query(sql, values)
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ****************************************
 * Get all messages from the database
* *************************************** */
async function getMessages() {
    try {
        const sql = 'SELECT * FROM public.message_request ORDER BY message_created_at DESC'
        const data = await pool.query(sql)
        return data.rows
    } catch (error) {
        throw error
    }
}

module.exports = {
  handleMessageForm, getMessages
}