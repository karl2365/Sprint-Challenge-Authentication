const request = require('supertest');

const db = require('../database/dbConfig');
const server = require('../api/server.js');

describe('server', () => {
    beforeEach(async () => {
        await db('users').truncate();
    });



    describe('POST /register', () => {
        it('should insert one user in to the database', () => {
            return request(server)
                .post('/api/auth/register')
                .send({
                    username: 'Lisa',
                    password: 'homer'
                })
                .then(res => {
                    console.log(res.body);
                    expect(res.body.id).toBe(1);
                });
        });

        it('should insert more than one user', async () => {
            await request(server)
                .post('/api/auth/register')
                .send([{
                        name: 'karl',
                        password: 'hello'
                    },
                    {
                        name: 'Lisa',
                        password: 'hello'
                    },
                    {
                        name: 'Jack',
                        password: 'hello'
                    }
                ]);
            const users = await db('users');
            console.log('users', users)
            expect(users).toHaveLength(0);

        });


        it('returns JSON', () => {
            return request(server)
                .post('/api/auth/register')
                .send({
                    username: 'Lisa',
                    password: 'homer'
                })
                .then(res => {
                    // matching on regular expression
                    expect(res.type).toMatch(/json/);
                });
        });
    });


    describe('POST /login', () => {

        it('returns status 401 unauthorized', () => {
            return request(server)
                .post('/api/auth/login')
                .send({
                    username: 'not',
                    password: 'authorized'
                })
                .then(res => {
                    expect(res.status).toBe(401);
                })
        });
        

        it('returns status 200 authorized', async () => {

            await request(server)
                .post('/api/auth/register')
                .send({
                    username: 'Karl',
                    password: 'money'
                });


            await request(server)
                .post('/api/auth/login')
                .send({
                    username: 'Karl',
                    password: 'money'
                })
                .then(res => {
                    expect(res.status).toBe(200);
                });
        });
    });

    describe('GET /jokes', () => {
        it('returns JSON', async () => {
            await request(server)
            .post('/api/auth/register')
            .send({
                username: 'Karl',
                password: 'money'
            });


        await request(server)
            .post('/api/auth/login')
            .send({
                username: 'Karl',
                password: 'money'
            });

        await request(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.type).toMatch(/json/);
            });
        });
    });

    it('returns 400 no token', () => {
        return request(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

});