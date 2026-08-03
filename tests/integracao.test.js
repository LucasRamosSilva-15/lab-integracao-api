process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database');

describe('Api de alunos - Testes de Integração', () => { 

    beforeEach((done) => {
        db.serialize(() => {
            db.run('DELETE FROM alunos', {}, (err) => {
                        if (err) return done(err);
                        done();
                    });
        });
        
    });

    afterAll((done) => {
        db.close((err) => {
            if (err) return done(err);
            done();
        });
    });

    // it('deve retornar todos os alunos', (done) => {
    //     request.get('/alunos')
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             done();
    //         });
    
    //     });
    
    it('deve verificar se a criação de um aluno está funcionando ', (done) => {
        request(app).post('/alunos')
            .send({ nome: 'João', matricula: '202610020005' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('deve validar o contrato HTTP', (done) => {
        request(app).post('/alunos')
            .send({ nome: 'Maria', matricula: '202610020006' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('Validação de Efeito Colateral, verificar duplicidade', async () => {
        await request(app).post('/alunos')
            .send({ nome: 'Carlos', matricula: '202610020007' })
            .expect(201);
        await request(app).post('/alunos')
            .send({ nome: 'Carlos', matricula: '202610020007' })
            .expect(409)
            /*.end((err, res) => {
                if (err) return done(err);
                done();
            }); */

            db.get
    });
})
