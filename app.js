
const express = require('express');
const mysever = express();
const cors = require('cors');
mysever.use(cors());
const allowedOrigins = ['http://localhost:4200', 'https://shop-world.surge.sh'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
mysever.use(cors(corsOptions));
mysever.use(express.json());
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Tayyab001:sm5BPyYE3YppfOYi@cluster0.amgfpsu.mongodb.net/newdb');
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});
const signupdata = new mongoose.Schema({
    userName: String,
    email: { type: String, unique: true },
    password: String,
    shopname: String,
    accountid: String,
    Type:String
});
const admindata = new mongoose.Schema({
    userName: String,
    email: { type: String, unique: true },
    password: String,
    shopname: String,
    accountid: String
})
const tableData = new mongoose.Schema({
    itemName: String,
    itemType: String,
    itemWeight: String,
    itemPrice: String,
    Adminid: String
})
const mainSchema = new mongoose.Schema({
    0: [{
        shopname: String,
        customer: String,
        date: String,
        invoiceno: String,
        assignto: String,
        id: String,
        useraccountid: String,
        adminid: String
    }],
    1: [{
        itemName: String,
        itemWeight: Number,
        itemType: String,
        itemPrice: Number
    }],
    2: [{
        fullprice: Number
    }],
    3: String,
    4: String
});
const forgotpassword= new mongoose.Schema({
    Fruit:String,
    Vegetable:String,
    Colour:String,
    email: { type: String, unique: true }
})
const saveorder = new mongoose.Schema({
    0: [{
        shopname: String,
        customer: String,
        date: String,
        invoiceno: String,
        assignto: String,
        id: String,
        useraccountid: String,
        adminid: String
    }],
    1: [{
        itemName: String,
        itemWeight: Number,
        itemType: String,
        itemPrice: Number
    }],
    2: [{
        fullprice: Number
    }],
    3: String,
    4: String
});
const superadmin = new mongoose.Schema({
    userName: String,
    email: { type: String, unique: true },
    password: String,
    shopname: String,
    accountid: String
  })
  
const userimage=new mongoose.Schema({
    photo:String,
    useremail:String
})

const User = mongoose.model('User', userSchema);
const Signupdata = mongoose.model('Signupdata', signupdata);
const Admindata = mongoose.model('Admindata', admindata);
const SuperAdmindata = mongoose.model('SuperAdmindata', superadmin);
const TableData = mongoose.model('TableData', tableData);
const OrderCard = mongoose.model('UserOrder', mainSchema)
const saveorderadmin = mongoose.model('SaveOrder', saveorder)
const image=mongoose.model('userimg' , userimage)
const forgotpasswordmodal=mongoose.model('forgotpassword' , forgotpassword)
mysever.get('/', (req, res) => {
    res.send('Welcome to our app!');
});

mysever.get('/superadmindatas', async (req, res) => {
    const admindata = await SuperAdmindata.find();
    res.json(admindata);
});

mysever.post('/SuperAdminData', async (req, res) => {
    const user = new SuperAdmin(req.body);
    await user.save();
    res.json(user);
});


mysever.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

mysever.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

mysever.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted!');
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).send('Error deleting user: ' + error.message);
    }
});


const port = 8000;
mysever.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


// shop project signup data


mysever.post('/Signupdata', async (req, res) => {
    const signupdata = req.body;
    const newsignupdata = {
        ...signupdata,
        Type: 'unbann'  
    };
    const user = new Signupdata(newsignupdata);
    await user.save();
    res.json(user);
});
mysever.get('/Signupdata', async (req, res) => {
    const users = await Signupdata.find();
    res.json(users);
});

mysever.delete('/Signupdata/:id', async (req, res) => {
    try {
        const user = await Signupdata.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted!');
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).send('Error deleting user: ' + error.message);
    }
});
mysever.put('/Signupdata/:id', async (req, res) => {
    let id =req.params.id;
    let status=req.body.status;
    try {
        const updatedUser = await Signupdata.findByIdAndUpdate(
            id, { $set: { userName: status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
mysever.put('/changeshop/:id', async (req, res) => {
    let id =req.params.id;
    let status=req.body.status;
    try {
        const updatedUser = await Signupdata.findByIdAndUpdate(
            id, { $set: { shopname: status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
mysever.put('/changepassword/:id', async (req, res) => {
    let id =req.params.id;
    let status=req.body.status;
    try {
        const updatedUser = await Signupdata.findByIdAndUpdate(
            id, { $set: { password: status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
mysever.put('/accountapple/:id', async (req, res) => {
    let id =req.params.id;
    let status=req.body.status;
    try {
        const updatedUser = await Signupdata.findByIdAndUpdate(
            id, { $set: { Type: status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
// admin data sceema 
mysever.post('/Mainadmindata', async (req, res) => {
    const user = new Admindata(req.body);
    await user.save();
    res.json(user);
});
mysever.get('/Mainadmindata', async (req, res) => {
    const users = await Admindata.find();
    res.json(users);
});
mysever.put('/Mainadmindata/:id', async (req, res) => {
    let id =req.params.id;
    let status=req.body.status;
    try {
        const updatedUser = await Admindata.findByIdAndUpdate(
            id, { $set: { userName: status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
mysever.put('/changeshopadmin/:id', async (req, res) => {
    let id =req.params.id;
    let status=req.body.status;
    try {
        const updatedUser = await Admindata.findByIdAndUpdate(
            id, { $set: { shopname: status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
mysever.put('/changpasswordadmin/:id', async (req, res) => {
    let id =req.params.id;
    let status=req.body.status;
    try {
        const updatedUser = await Admindata.findByIdAndUpdate(
            id, { $set: { password: status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});
// my shop item table data 
mysever.post('/Tableitems', async (req, res) => {
    const user = new TableData(req.body);
    await user.save();
    res.json(user);
});
mysever.get('/Tableitems', async (req, res) => {
    const users = await TableData.find();
    res.json(users);
});

mysever.delete('/Tableitems/:id', async (req, res) => {
    try {
        const user = await TableData.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted!');
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).send('Error deleting user: ' + error.message);
    }
});
mysever.put('/Tableitems/:id', async (req, res) => {
    try {
        const updatedUser = await TableData.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});



// order items table
mysever.post('/Carditems', async (req, res) => {
    try {
        const orderCard = new OrderCard(req.body);
        await orderCard.save();
        res.status(201).json(orderCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

mysever.get('/Carditems', async (req, res) => {
    try {
        const orderCards = await OrderCard.find();
        res.json(orderCards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

mysever.delete('/Carditems/:id', async (req, res) => {
    try {
        const user = await OrderCard.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted!');
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).send('Error deleting user: ' + error.message);
    }
});
mysever.put('/Carditems/:id', async (req, res) => {
    let id =req.params.id;
    let status=req.body.status;
    try {
        const updatedUser = await OrderCard.findByIdAndUpdate(
            id, { $set: { "4": status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

mysever.get('/CarditemsAmount/:id', async (req, res) => {
    try {
        const orderCards = await OrderCard.find();
        const itemCounts = countItemOccurrences(orderCards, req.params.id);
        res.json(itemCounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function countItemOccurrences(data, adminId) {
    const itemCounts = new Map();
    const orders = data.filter(order => 
        order["0"] && order["0"][0] && order["0"][0].adminid === adminId
    );
    orders.forEach(card => {
        card["1"].forEach(item => {
            const itemName = item.itemName;
            itemCounts.set(itemName, (itemCounts.get(itemName) || 0) + 1);
        });
    });
    const result = {};
    itemCounts.forEach((count, name) => {
        result[name] = count;
    });
    return result;
}

//save order card
mysever.post('/SaveCard', async (req, res) => {
    try {
        const orderCard = new saveorderadmin(req.body);
        await orderCard.save();
        res.status(201).json(orderCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

mysever.get('/SaveCard', async (req, res) => {
    try {
        const orderCards = await saveorderadmin.find();
        res.json(orderCards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
mysever.delete('/SaveCard/:id', async (req, res) => {
    try {
        const user = await saveorderadmin.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted!');
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).send('Error deleting user: ' + error.message);
    }
});
mysever.get('/SaveCardbyid/:id', async (req, res) => {
    try {
        const orderCards = await saveorderadmin.find();
        const itemCounts = countItemOccurrencessave(orderCards, req.params.id);
        res.json(itemCounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
function countItemOccurrencessave(data, adminId) {
    const itemCounts = new Map();
    const orders = data.filter(order => order['3'] === adminId);
    orders.forEach(card => {
        card["1"].forEach(item => {
            const itemName = item.itemName;
            itemCounts.set(itemName, (itemCounts.get(itemName) || 0) + 1);
        });
    });
    const result = {};
    itemCounts.forEach((count, name) => {
        result[name] = count;
    });
    return result;
}

//img

mysever.post('/profile', async (req, res) => {
    try {
        const orderCard = new image(req.body);
        await orderCard.save();
        res.status(201).json(orderCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
mysever.get('/profile', async (req, res) => {
    try {
        const orderCards = await image.find();
        res.json(orderCards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
mysever.put('/profile/:id', async (req, res) => {
    try {
        const updatedUser = await image.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// forgotpassword
mysever.post('/forgotpassword', async (req, res) => {
    const user = new forgotpasswordmodal(req.body);
    await user.save();
    res.json(user);
});
mysever.get('/forgotpassword', async (req, res) => {
    try {
        const dataforgot = await forgotpasswordmodal.find();
        res.json(dataforgot);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
mysever.put('/forgotpassword/:id', async (req, res) => {
    try {
        const updatedUser = await forgotpasswordmodal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});