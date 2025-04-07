const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');
const app = express();
const port = 8080;

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);
const tableName = 'Notes';

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

app.use(express.static('public'));
app.use(express.json());

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

app.post('/notes', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).send('Title and content are required');

    const encryptedContent = encrypt(content);
    const params = {
        TableName: tableName,
        Item: { id: Date.now().toString(), title, content: encryptedContent }
    };
    try {
        await docClient.send(new PutCommand(params));
        res.send('Note created');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/notes', async (req, res) => {
    const params = { TableName: tableName };
    try {
        const data = await docClient.send(new ScanCommand(params));
        const notes = data.Items.map(note => ({
            id: note.id,
            title: note.title,
            content: decrypt(note.content)
        }));
        res.json(notes);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/notes/:id', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).send('Title and content are required');

    const encryptedContent = encrypt(content);
    const params = {
        TableName: tableName,
        Key: { id: req.params.id },
        UpdateExpression: 'set title = :t, content = :c',
        ExpressionAttributeValues: { ':t': title, ':c': encryptedContent }
    };
    try {
        await docClient.send(new UpdateCommand(params));
        res.send('Note updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/notes/:id', async (req, res) => {
    const params = { TableName: tableName, Key: { id: req.params.id } };
    try {
        await docClient.send(new DeleteCommand(params));
        res.send('Note deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));console.log('Pipeline test');
app.get('/', (req, res) => res.send('CloudNotes CI/CD Success!'));
console.log('CI/CD with encryption');
app.listen(process.env.PORT || 8080, () => console.log('Server running on port 8080'));

