const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const employees = [
    { id: 1, name: 'Quentin Tarantino' },
    { id: 2, name: 'Oleg Sentsov' },
    { id: 3, name: 'Takeshi Kitano' },
    { id: 4, name: 'Luke Besson'}
];

app.get('/', (req, res) => {
    res.send("It's a beautiful world");
});

app.get('/api/employees', (req, res) => {
    res.send(employees);
});

app.get('/api/employees/:id', (req, res) => {
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    if (!employee) res.status(404).send('The employee with the given ID was not found');
    res.send(employee);
});

app.get('/:name', (req, res) => {
    res.send('user ' + req.params.name);
});

app.post('/api/employees', (req, res) => {
    const employee = {
        id: employees.length + 1,
        name: req.body.name
    };
    if (!req.body.name || req.body.name.length<3) res.status(400).send('Name is required and should be minimum 3 characters');
    if(!employee.name.includes(' ')) res.status(400).send('The employee should have First Name and Family Name');
    employees.push(employee);
    res.send()
});

app.put('/api/employees/:id', (req, res) => {
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    if (!employee) res.status(404).send('Employee with given ID was not found');
    
    const schema = Joi.object({ name: Joi.string().min(3).required() });

    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    employee.name = req.body.name;
    res.send(employee.id + " updated with name: " + req.body.name)
});

app.delete('/api/employees/:id', (req, res) => {
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    if (!employee) res.status(404).send('Employee with given ID was not found');
    const index = employees.indexOf(employee);
    employees.splice(index, 1);
    res.send(employees);
});
const port = process.env.PORT || 3000
app.listen(port, ()=>console.log('listening on port 3000...'))